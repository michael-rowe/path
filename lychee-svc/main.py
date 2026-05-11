import os
import subprocess
import json
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Path Lychee API")

# Restrict CORS to the SilverBullet UI origin. The sidecar is also bound to
# 127.0.0.1 in compose; CORS is belt-and-braces.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

SPACE_PATH = "/space"

@app.get("/check")
async def check_links(path: str):
    # Sanitize path
    clean_path = path.lstrip("/")
    if not clean_path.endswith(".md"):
        clean_path += ".md"
    
    full_path = os.path.join(SPACE_PATH, clean_path)
    if not os.path.exists(full_path):
        logger.error(f"File not found: {full_path}")
        raise HTTPException(status_code=404, detail="File not found")

    try:
        logger.info(f"Checking links for: {full_path}")
        # Run lychee
        # --format json returns a JSON stream (multiple objects)
        result = subprocess.run(
            ["lychee", "--format", "json", full_path],
            capture_output=True,
            text=True
        )
        
        # Parse the JSON lines from stdout
        issues = []
        for line in result.stdout.strip().split("\n"):
            if line:
                try:
                    data = json.loads(line)
                    # Filter for broken links
                    # Lychee status can be 'Success', 'Error', 'Timeout', 'Fail', etc.
                    if data.get("status") in ["Error", "Timeout", "Fail"]:
                        issues.append({
                            "uri": data.get("uri"),
                            "status": data.get("status"),
                            "message": data.get("message")
                        })
                except Exception as e:
                    logger.error(f"Error parsing line: {line} - {e}")
                    continue
        
        return {"path": clean_path, "issues": issues}
    except Exception as e:
        logger.error(f"Execution error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8030)
