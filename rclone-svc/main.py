import os
import subprocess
import logging
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Path Rclone API")

# Restrict CORS to the SilverBullet UI origin. The sidecar is also bound to
# 127.0.0.1 in compose; CORS is belt-and-braces.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

SPACE_PATH = "/space"
CONFIG_PATH = os.getenv("RCLONE_CONFIG", "/config/rclone/rclone.conf")
# Default remote name if not specified in request
DEFAULT_REMOTE = os.getenv("RCLONE_REMOTE", "gdrive")
# Default destination folder on the remote
DEFAULT_DEST = "Path-Portfolio-Backup"

last_sync_status = {
    "last_run": None,
    "status": "Never run",
    "details": ""
}

@app.get("/status")
async def get_status():
    """Returns the status of the last sync and available remotes."""
    try:
        # Check if config exists
        config_exists = os.path.exists(CONFIG_PATH)
        
        # Get list of remotes
        remotes = []
        if config_exists:
            result = subprocess.run(["rclone", "listremotes"], capture_output=True, text=True)
            remotes = [r.strip().rstrip(':') for r in result.stdout.strip().split("\n") if r.strip()]

        return {
            "config_exists": config_exists,
            "remotes": remotes,
            "last_sync": last_sync_status,
            "default_remote": DEFAULT_REMOTE
        }
    except Exception as e:
        logger.error(f"Status check error: {e}")
        return {"error": str(e)}

@app.post("/sync")
async def trigger_sync(remote: str = None):
    """Triggers an rclone sync operation."""
    target_remote = remote or DEFAULT_REMOTE
    
    if not os.path.exists(CONFIG_PATH):
        raise HTTPException(status_code=400, detail="Rclone not configured. Please run 'rclone config' first.")

    try:
        last_sync_status["status"] = "Running..."
        last_sync_status["last_run"] = datetime.now().isoformat()
        
        # Build command: rclone sync /space remote:Path-Portfolio-Backup
        dest = f"{target_remote}:{DEFAULT_DEST}"
        logger.info(f"Starting sync to {dest}")
        
        # Run sync in background? No, let's wait for now to give immediate feedback.
        # If it takes too long, we might need to move to background tasks.
        result = subprocess.run(
            ["rclone", "sync", SPACE_PATH, dest, "--verbose"],
            capture_output=True,
            text=True,
            timeout=300 # 5 minute timeout
        )
        
        if result.returncode == 0:
            last_sync_status["status"] = "Success"
            last_sync_status["details"] = "Sync completed successfully."
            logger.info("Sync success")
        else:
            last_sync_status["status"] = "Error"
            last_sync_status["details"] = result.stderr
            logger.error(f"Sync failed: {result.stderr}")
            
        return last_sync_status
    except subprocess.TimeoutExpired:
        last_sync_status["status"] = "Timeout"
        last_sync_status["details"] = "Sync operation timed out after 5 minutes."
        return last_sync_status
    except Exception as e:
        logger.error(f"Sync error: {e}")
        last_sync_status["status"] = "Error"
        last_sync_status["details"] = str(e)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Create config dir if it doesn't exist
    os.makedirs(os.path.dirname(CONFIG_PATH), exist_ok=True)
    uvicorn.run(app, host="0.0.0.0", port=8040)
