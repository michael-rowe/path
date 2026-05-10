import os
import re
from pathlib import Path

import frontmatter
import yaml

SPACE_DIR = os.environ.get("SPACE_DIR", "/space")

# Directories excluded from general searches and listings
EXCLUDE_DIRS = {"Library", "_system", "_assets", "templates", "evidence-inventory"}

# Page types that should never be returned from list operations
EXCLUDE_TYPES = {"profile"}


def space_path(*parts) -> Path:
    return Path(SPACE_DIR).joinpath(*parts)


def read_page(relative_path: str) -> dict | None:
    """Read a markdown page from the space. Returns {meta, content, slug} or None."""
    path = space_path(relative_path)
    if not path.exists() or path.suffix != ".md":
        return None
    try:
        post = frontmatter.load(str(path))
        return {
            "meta": dict(post.metadata),
            "content": post.content,
            "slug": path.stem,
            "page": str(path.relative_to(SPACE_DIR)).replace("\\", "/"),
        }
    except Exception:
        return None


def list_pages(directory: str, type_filter: str = None) -> list[dict]:
    """List markdown pages in a space subdirectory, optionally filtered by type field."""
    dir_path = space_path(directory)
    if not dir_path.exists():
        return []
    results = []
    for md_file in sorted(dir_path.glob("*.md")):
        try:
            post = frontmatter.load(str(md_file))
            meta = dict(post.metadata)
            if type_filter and meta.get("type") != type_filter:
                continue
            if meta.get("type") in EXCLUDE_TYPES:
                continue
            results.append({
                "meta": meta,
                "slug": md_file.stem,
                "page": str(md_file.relative_to(SPACE_DIR)).replace("\\", "/"),
            })
        except Exception:
            continue
    return results


def write_page(relative_path: str, meta: dict, content: str) -> str:
    """Write a markdown page to the space. Returns the page path."""
    path = space_path(relative_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    post = frontmatter.Post(content, **meta)
    with open(str(path), "w", encoding="utf-8") as f:
        f.write(frontmatter.dumps(post))
    return str(path.relative_to(SPACE_DIR)).replace("\\", "/")


def load_framework_yaml(framework_short: str) -> dict | None:
    """
    Load a framework YAML file from space/standards/.
    Matches by framework.short field (case-insensitive).
    """
    standards_dir = space_path("standards")
    if not standards_dir.exists():
        return None
    needle = framework_short.lower().replace("-", "").replace("_", "")
    for yaml_file in standards_dir.glob("*.yaml"):
        try:
            with open(yaml_file, encoding="utf-8") as f:
                data = yaml.safe_load(f)
            short = data.get("framework", {}).get("short", "")
            if short.lower().replace("-", "").replace("_", "") == needle:
                return data
        except Exception:
            continue
    return None


def all_framework_yamls() -> list[dict]:
    """Load all framework YAML files from space/standards/."""
    standards_dir = space_path("standards")
    if not standards_dir.exists():
        return []
    results = []
    for yaml_file in sorted(standards_dir.glob("*.yaml")):
        try:
            with open(yaml_file, encoding="utf-8") as f:
                data = yaml.safe_load(f)
            if "framework" in data:
                results.append(data)
        except Exception:
            continue
    return results


def slugify(text: str) -> str:
    """Convert text to a URL-safe slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")[:60]


def strip_wikilinks(text: str) -> str:
    """Replace [[Page|Label]] or [[Page]] with Label or Page."""
    text = re.sub(r"\[\[([^\]|]+)\|([^\]]+)\]\]", r"\2", text)
    text = re.sub(r"\[\[([^\]]+)\]\]", r"\1", text)
    return text


def ensure_list(value) -> list:
    """Normalise a YAML field that may be a string, list, or None."""
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]
