import os
import time
import threading
import logging
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from git import Repo, GitCommandError

# Configuration
SPACE_PATH = "/space"
COMMIT_INTERVAL = 1800  # 30 minutes in seconds
API_PORT = 8020

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logger = logging.getLogger(__name__)

app = FastAPI(title="Path Time Machine API")

# Enable CORS for the SilverBullet interface
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure git safety first
os.system("git config --global --add safe.directory /space")

# Initialize Git Repo
repo = None
try:
    if not os.path.exists(os.path.join(SPACE_PATH, ".git")):
        logger.info(f"Initializing new git repository in {SPACE_PATH}")
        repo = Repo.init(SPACE_PATH)
        # Create a .gitignore to exclude system files if it doesn't exist
        gitignore_path = os.path.join(SPACE_PATH, ".gitignore")
        if not os.path.exists(gitignore_path):
            with open(gitignore_path, "w") as f:
                f.write(".git/\nLibrary/\n_system/\n.silverbullet.db\n")
        
        repo.git.add(".gitignore")
        repo.index.commit("initial: Path repository initialized")
        logger.info("Initial commit created.")
    else:
        repo = Repo(SPACE_PATH)
        logger.info("Existing git repository found.")
except Exception as e:
    logger.error(f"Failed to initialize git: {e}")
    # Try one more time to just open it if init failed because it already existed but was "dubious"
    try:
        repo = Repo(SPACE_PATH)
        logger.info("Existing git repository opened after safe.directory fix.")
    except Exception as e2:
        logger.error(f"Second attempt to open repo failed: {e2}")

def auto_commit_worker():
    """Background thread to perform commits every 30 minutes."""
    global repo
    if not repo:
        logger.error("Repo not initialized, auto-commit worker stopping.")
        return

    while True:
        try:
            # Refresh repo object in case it was re-initialized
            if repo.is_dirty(untracked_files=True):
                # We add everything that isn't gitignored
                repo.git.add(A=True)
                # Check again after adding
                if repo.is_dirty():
                    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
                    repo.index.commit(f"snapshot: {timestamp}")
                    logger.info(f"Automated snapshot created at {timestamp}")
            else:
                logger.debug("No changes detected, skipping snapshot.")
        except Exception as e:
            logger.error(f"Auto-commit error: {e}")
        
        time.sleep(COMMIT_INTERVAL)

@app.get("/history")
async def get_history(path: str):
    """Returns the version history for a specific file."""
    # Ensure the path is relative to the repo root and doesn't have leading slash
    clean_path = path.lstrip("/")
    if not clean_path.endswith(".md"):
        clean_path += ".md"

    try:
        # Get all commits that touched this file
        commits = list(repo.iter_commits(paths=clean_path))
        history = []
        for commit in commits:
            history.append({
                "hash": commit.hexsha,
                "timestamp": commit.authored_datetime.isoformat(),
                "message": commit.message.strip(),
                "author": commit.author.name
            })
        return {"path": clean_path, "history": history}
    except Exception as e:
        logger.error(f"Error fetching history for {clean_path}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/version")
async def get_version(path: str, hash: str):
    """Returns the content of a file at a specific commit."""
    clean_path = path.lstrip("/")
    if not clean_path.endswith(".md"):
        clean_path += ".md"

    try:
        commit = repo.commit(hash)
        blob = commit.tree / clean_path
        content = blob.data_stream.read().decode('utf-8')
        return {"path": clean_path, "hash": hash, "content": content}
    except Exception as e:
        logger.error(f"Error fetching version {hash} for {clean_path}: {e}")
        raise HTTPException(status_code=404, detail="Version or file not found")

if __name__ == "__main__":
    # Start the auto-commit thread
    threading.Thread(target=auto_commit_worker, daemon=True).start()
    
    # Start the API server
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=API_PORT)
