import os
import time
import signal
import logging
import hashlib
import threading
import frontmatter
from datetime import date, datetime
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import meilisearch

# Configuration
SPACE_PATH = "/space"
MEILI_URL = os.getenv("MEILI_URL", "http://localhost:7700")
MEILI_MASTER_KEY = os.getenv("MEILI_MASTER_KEY", "masterKey")
INDEX_NAME = "pages"
# Watchdog can fire multiple on_modified events per editor save. Coalesce
# events per logical path within this window to avoid re-indexing the
# same file 3–5 times for one save.
DEBOUNCE_SECONDS = float(os.getenv("INDEXER_DEBOUNCE_SECONDS", "1.0"))

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

client = meilisearch.Client(MEILI_URL, MEILI_MASTER_KEY)
index = client.index(INDEX_NAME)
# update_settings is configured later, after the health check, so a slow
# Meilisearch start doesn't crash this process at import time.

def get_id(path):
    """Create a stable, valid Meilisearch ID from the file path."""
    return hashlib.sha256(path.encode()).hexdigest()

def serialize_value(value):
    """Convert non-serializable objects (like dates) to strings."""
    if isinstance(value, (date, datetime)):
        return value.isoformat()
    if isinstance(value, list):
        return [serialize_value(item) for item in value]
    if isinstance(value, dict):
        return {k: serialize_value(v) for k, v in value.items()}
    return value

def index_file(file_path):
    if not file_path.endswith(".md"):
        return
    
    if "_system/" in file_path or ".git/" in file_path or "Library/" in file_path:
        return

    try:
        rel_path = os.path.relpath(file_path, SPACE_PATH)
        # Strip .md for the logical path
        logical_path = rel_path[:-3] if rel_path.endswith(".md") else rel_path
        
        with open(file_path, 'r', encoding='utf-8') as f:
            post = frontmatter.load(f)
            
        doc = {
            "id": get_id(logical_path),
            "path": logical_path,
            "title": post.get("title") or os.path.basename(logical_path),
            "content": post.content,
            "lastModified": int(os.path.getmtime(file_path)),
        }
        
        # Add all frontmatter fields
        for key, value in post.metadata.items():
            doc[key] = serialize_value(value)
            
        index.add_documents([doc])
        logger.info(f"Indexed: {logical_path}")
    except Exception as e:
        logger.error(f"Error indexing {file_path}: {e}")

def delete_file(file_path):
    rel_path = os.path.relpath(file_path, SPACE_PATH)
    logical_path = rel_path[:-3] if rel_path.endswith(".md") else rel_path
    doc_id = get_id(logical_path)
    index.delete_document(doc_id)
    logger.info(f"Deleted: {logical_path}")

class SpaceHandler(FileSystemEventHandler):
    """Watchdog handler with per-path debounce.

    Each (action, path) schedules a Timer; subsequent events for the same
    pair within DEBOUNCE_SECONDS cancel the previous timer. The action
    only runs once when the file stops being touched.
    """

    def __init__(self):
        super().__init__()
        self._timers: dict[tuple[str, str], threading.Timer] = {}
        self._lock = threading.Lock()

    def _schedule(self, action: str, fn, *args):
        key = (action, args[0])
        with self._lock:
            existing = self._timers.pop(key, None)
            if existing:
                existing.cancel()
            timer = threading.Timer(DEBOUNCE_SECONDS, self._run, args=(key, fn, args))
            self._timers[key] = timer
            timer.daemon = True
            timer.start()

    def _run(self, key, fn, args):
        with self._lock:
            self._timers.pop(key, None)
        try:
            fn(*args)
        except Exception as e:
            logger.error(f"Debounced action failed for {key}: {e}")

    def on_modified(self, event):
        if not event.is_directory:
            self._schedule("idx", index_file, event.src_path)

    def on_created(self, event):
        if not event.is_directory:
            self._schedule("idx", index_file, event.src_path)

    def on_deleted(self, event):
        if not event.is_directory:
            self._schedule("del", delete_file, event.src_path)

    def on_moved(self, event):
        if not event.is_directory:
            self._schedule("del", delete_file, event.src_path)
            self._schedule("idx", index_file, event.dest_path)

def full_reindex():
    logger.info("Starting full reindex...")
    for root, dirs, files in os.walk(SPACE_PATH):
        for file in files:
            if file.endswith(".md"):
                index_file(os.path.join(root, file))
    logger.info("Full reindex complete.")

def configure_index():
    """Apply index settings. Called after the Meilisearch health check
    so a slow start doesn't blow up the process at import time."""
    index.update_settings({
        'searchableAttributes': ['title', 'content', 'path', 'tags'],
        'filterableAttributes': ['note_type', 'status', 'domain', 'area', 'tags', 'framework'],
        'sortableAttributes': ['lastModified'],
    })


if __name__ == "__main__":
    # Wait for Meilisearch to be ready
    for _ in range(30):
        try:
            client.health()
            break
        except Exception:
            logger.info("Waiting for Meilisearch...")
            time.sleep(2)
    else:
        logger.error("Meilisearch not reachable. Exiting.")
        exit(1)

    configure_index()
    full_reindex()

    event_handler = SpaceHandler()
    observer = Observer()
    observer.schedule(event_handler, SPACE_PATH, recursive=True)
    observer.start()
    logger.info(f"Watching {SPACE_PATH} for changes (debounce={DEBOUNCE_SECONDS}s)...")

    stop_event = threading.Event()

    def _shutdown(signum, _frame):
        logger.info(f"Received signal {signum}; shutting down.")
        stop_event.set()

    signal.signal(signal.SIGTERM, _shutdown)
    signal.signal(signal.SIGINT, _shutdown)

    try:
        # wait() yields to the signal handler within Docker's 10s grace.
        stop_event.wait()
    finally:
        observer.stop()
        observer.join(timeout=5)
        logger.info("Indexer stopped cleanly.")
