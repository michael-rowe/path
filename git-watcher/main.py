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
COMMIT_INTERVAL = int(os.environ.get("COMMIT_INTERVAL", "1800"))  # default 30 min
API_PORT = 8020

# Files / directories never to commit. Written into space/.gitignore on
# every startup so existing repos created before this list was extended
# pick up the additions.
GITIGNORE_LINES = [
    ".git/",
    "Library/",
    "_system/",
    ".silverbullet.db",
    ".silverbullet.db-journal",
    ".silverbullet.db-wal",
    ".silverbullet.db-shm",
]

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Sticky error surfaced via /health so the Inspector can tell the user
# the sidecar isn't doing anything useful.
init_error: str | None = None

app = FastAPI(title="Path Time Machine API")

# Restrict CORS to the SilverBullet UI origin. The sidecar is also bound to
# 127.0.0.1 in compose; CORS is belt-and-braces.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

# Configure git safety first
os.system("git config --global --add safe.directory /space")


def ensure_gitignore() -> None:
    """Make sure space/.gitignore lists everything in GITIGNORE_LINES.

    Runs on every startup, not only on fresh init, so repos created before
    a line was added still pick it up. Existing user entries are preserved.
    """
    gitignore_path = os.path.join(SPACE_PATH, ".gitignore")
    existing: list[str] = []
    if os.path.exists(gitignore_path):
        with open(gitignore_path) as f:
            existing = [line.rstrip("\n") for line in f.readlines()]
    missing = [line for line in GITIGNORE_LINES if line not in existing]
    if not missing:
        return
    with open(gitignore_path, "a" if existing else "w") as f:
        if existing and existing[-1] != "":
            f.write("\n")
        for line in missing:
            f.write(line + "\n")
    logger.info(f"Added {len(missing)} entries to .gitignore: {missing}")


# Initialize Git Repo
repo = None
try:
    if not os.path.exists(os.path.join(SPACE_PATH, ".git")):
        logger.info(f"Initializing new git repository in {SPACE_PATH}")
        repo = Repo.init(SPACE_PATH)
        ensure_gitignore()
        repo.git.add(".gitignore")
        repo.index.commit("initial: Path repository initialized")
        logger.info("Initial commit created.")
    else:
        repo = Repo(SPACE_PATH)
        ensure_gitignore()
        logger.info("Existing git repository found.")
except Exception as e:
    logger.error(f"Failed to initialize git: {e}")
    init_error = f"init failed: {e}"
    # Try one more time to just open it if init failed because it already existed but was "dubious"
    try:
        repo = Repo(SPACE_PATH)
        ensure_gitignore()
        init_error = None
        logger.info("Existing git repository opened after safe.directory fix.")
    except Exception as e2:
        logger.error(f"Second attempt to open repo failed: {e2}")
        init_error = f"init failed: {e}; reopen failed: {e2}"

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
                    # Include the changed paths in the commit message so the
                    # Inspector History tab can show which files this snapshot
                    # actually touched. Without this, every snapshot reads as
                    # "snapshot: <time>" and a user looking at one page sees
                    # commits that genuinely touched it but with messages that
                    # don't reveal what changed.
                    diff = repo.index.diff("HEAD") if repo.head.is_valid() else []
                    # diff items have .a_path / .b_path; new files use b_path.
                    changed = sorted({
                        (d.b_path or d.a_path) for d in diff
                        if (d.b_path or d.a_path)
                    })
                    if not changed:
                        # Initial commit or fully untracked — fall back to
                        # walking the index directly.
                        changed = sorted({e[0] for e in repo.index.entries.keys()})[:20]
                    summary_count = len(changed)
                    summary_paths = ", ".join(changed[:5])
                    if summary_count > 5:
                        summary_paths += f", … (+{summary_count - 5} more)"
                    message = (
                        f"snapshot: {timestamp} — {summary_count} file"
                        f"{'s' if summary_count != 1 else ''}: {summary_paths}"
                    )
                    repo.index.commit(message)
                    logger.info(f"Snapshot created: {summary_count} file(s)")
            else:
                logger.debug("No changes detected, skipping snapshot.")
        except Exception as e:
            logger.error(f"Auto-commit error: {e}")
        
        time.sleep(COMMIT_INTERVAL)

@app.get("/health")
async def health():
    """Liveness + init state. Used by the Inspector to warn when the
    Time Machine isn't actually capturing snapshots."""
    return {
        "ok": repo is not None and init_error is None,
        "init_error": init_error,
        "commit_interval_seconds": COMMIT_INTERVAL,
    }


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
