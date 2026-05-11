import os
import json
import subprocess
import logging
import threading
from datetime import datetime
from pathlib import Path
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
# Guards both last_sync_status writes and the subprocess.run for the sync
# itself. A non-blocking acquire means a second concurrent /sync returns
# 409 instead of interleaving with the first.
_sync_lock = threading.Lock()

# Persistent status file. The rclone config dir is bind-mounted from the
# host (rclone_config:/config/rclone in compose), so anything written here
# survives container restarts. Stored alongside rclone.conf rather than
# under /space (which is mounted read-only).
STATUS_FILE = Path(os.path.dirname(CONFIG_PATH)) / "sync-status.json"


def _load_status() -> None:
    """Restore last_sync_status from disk on startup. Quiet on missing /
    malformed file — defaults are fine."""
    try:
        if STATUS_FILE.exists():
            data = json.loads(STATUS_FILE.read_text())
            for k in ("last_run", "status", "details"):
                if k in data:
                    last_sync_status[k] = data[k]
            logger.info(f"Loaded persisted sync status: {last_sync_status['status']}")
    except Exception as e:
        logger.warning(f"Could not load {STATUS_FILE}: {e}")


def _save_status() -> None:
    """Persist current last_sync_status to disk. Called from inside the
    _sync_lock so writes never race with concurrent updates."""
    try:
        STATUS_FILE.parent.mkdir(parents=True, exist_ok=True)
        STATUS_FILE.write_text(json.dumps(last_sync_status, indent=2))
    except Exception as e:
        logger.warning(f"Could not persist sync status: {e}")


@app.get("/health")
async def health():
    return {"ok": True, "config_exists": os.path.exists(CONFIG_PATH)}


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

def _run_sync(target_remote: str) -> None:
    """The actual sync work. Runs in a background thread spawned by
    /sync so the HTTP request can return immediately. Holds _sync_lock
    for the whole duration; the /sync entrypoint checks the lock
    before spawning to refuse concurrent syncs."""
    try:
        dest = f"{target_remote}:{DEFAULT_DEST}"
        logger.info(f"Starting sync to {dest}")

        # Drop --verbose: with capture_output it buffers the entire log in
        # memory for the whole run, which on a large space can be hundreds
        # of MB. Rclone's default output is enough for the status line.
        result = subprocess.run(
            ["rclone", "sync", SPACE_PATH, dest],
            capture_output=True,
            text=True,
            timeout=600,  # 10 minute timeout — async, so no client waiting
        )

        if result.returncode == 0:
            last_sync_status["status"] = "Success"
            last_sync_status["details"] = "Sync completed successfully."
            last_sync_status["last_run"] = datetime.now().isoformat()
            logger.info("Sync success")
        else:
            last_sync_status["status"] = "Error"
            last_sync_status["details"] = (result.stderr or "")[:500]
            last_sync_status["last_run"] = datetime.now().isoformat()
            logger.error(f"Sync failed: {result.stderr}")
    except subprocess.TimeoutExpired:
        last_sync_status["status"] = "Timeout"
        last_sync_status["details"] = "Sync timed out after 10 minutes."
        last_sync_status["last_run"] = datetime.now().isoformat()
        logger.error("Sync timed out")
    except Exception as e:
        last_sync_status["status"] = "Error"
        last_sync_status["details"] = str(e)
        last_sync_status["last_run"] = datetime.now().isoformat()
        logger.exception("Sync background thread crashed")
    finally:
        _save_status()
        _sync_lock.release()


@app.post("/sync")
async def trigger_sync(remote: str = None):
    """Kick off a sync in the background and return immediately.

    Real rclone runs can take minutes; the SB plug sandbox-fetch has a
    30s timeout, so a synchronous endpoint reports failure even on a
    healthy sync. The background thread holds _sync_lock for its
    lifetime, so a second concurrent /sync still gets a clean 409.
    Status and last_run land in /status (and persist to disk) on
    completion."""
    target_remote = remote or DEFAULT_REMOTE

    if not os.path.exists(CONFIG_PATH):
        raise HTTPException(status_code=400, detail="Rclone not configured. Please run 'rclone config' first.")

    if not _sync_lock.acquire(blocking=False):
        raise HTTPException(status_code=409, detail="Sync already in progress")

    # Lock acquired here; the background thread releases it in finally.
    last_sync_status["status"] = "Running..."
    last_sync_status["last_run"] = datetime.now().isoformat()
    last_sync_status["details"] = ""
    _save_status()

    threading.Thread(
        target=_run_sync, args=(target_remote,), daemon=True
    ).start()

    # 202 Accepted: work started, not yet finished. Client polls /status
    # or just trusts the persisted state.
    return {
        "status": last_sync_status["status"],
        "last_run": last_sync_status["last_run"],
        "started": True,
    }

if __name__ == "__main__":
    import uvicorn
    # Create config dir if it doesn't exist
    os.makedirs(os.path.dirname(CONFIG_PATH), exist_ok=True)
    _load_status()
    uvicorn.run(app, host="0.0.0.0", port=8040)
