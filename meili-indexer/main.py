import os
import time
import logging
import hashlib
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

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

client = meilisearch.Client(MEILI_URL, MEILI_MASTER_KEY)
index = client.index(INDEX_NAME)

# Set search settings
index.update_settings({
    'searchableAttributes': ['title', 'content', 'path', 'tags'],
    'filterableAttributes': ['note_type', 'status', 'domain', 'area', 'tags', 'framework'],
    'sortableAttributes': ['lastModified']
})

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
    def on_modified(self, event):
        if not event.is_directory:
            index_file(event.src_path)

    def on_created(self, event):
        if not event.is_directory:
            index_file(event.src_path)

    def on_deleted(self, event):
        if not event.is_directory:
            delete_file(event.src_path)

    def on_moved(self, event):
        if not event.is_directory:
            delete_file(event.src_path)
            index_file(event.dest_path)

def full_reindex():
    logger.info("Starting full reindex...")
    for root, dirs, files in os.walk(SPACE_PATH):
        for file in files:
            if file.endswith(".md"):
                index_file(os.path.join(root, file))
    logger.info("Full reindex complete.")

if __name__ == "__main__":
    # Wait for Meilisearch to be ready
    for _ in range(30):
        try:
            client.health()
            break
        except:
            logger.info("Waiting for Meilisearch...")
            time.sleep(2)
    else:
        logger.error("Meilisearch not reachable. Exiting.")
        exit(1)

    full_reindex()

    event_handler = SpaceHandler()
    observer = Observer()
    observer.schedule(event_handler, SPACE_PATH, recursive=True)
    observer.start()
    logger.info(f"Watching {SPACE_PATH} for changes...")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
