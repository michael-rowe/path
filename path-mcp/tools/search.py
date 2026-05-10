import os
from pathlib import Path

import frontmatter

from space_utils import SPACE_DIR, EXCLUDE_DIRS, strip_wikilinks

# Directories to skip during search
_SKIP_DIRS = EXCLUDE_DIRS | {"network", "credentials"}
_SKIP_SLUGS = {"criterion-code-short-name", "index"}
_MAX_SNIPPET_LEN = 200


def _snippet(content: str, query: str) -> str:
    """Return a short excerpt around the first query term match."""
    lower = content.lower()
    terms = query.lower().split()
    pos = -1
    for term in terms:
        idx = lower.find(term)
        if idx != -1:
            pos = idx
            break
    if pos == -1:
        return content[:_MAX_SNIPPET_LEN].strip()
    start = max(0, pos - 60)
    end = min(len(content), pos + 140)
    excerpt = strip_wikilinks(content[start:end]).strip()
    if start > 0:
        excerpt = "…" + excerpt
    if end < len(content):
        excerpt = excerpt + "…"
    return excerpt


def register_tools(mcp):

    @mcp.tool()
    def search_portfolio(query: str, limit: int = 15) -> list[dict]:
        """
        Search across all portfolio pages (claims, CPD, reflections, criteria,
        captures) for the given query. Matches in page titles are ranked first,
        then content matches.

        Use this when the user asks whether they have anything relevant to a topic,
        or when looking for specific evidence or activities by keyword.

        Args:
            query: Search terms (space-separated). All terms are ANDed.
            limit: Maximum number of results to return. Default 15.
        """
        terms = query.lower().split()
        space = Path(SPACE_DIR)
        results = []

        for md_file in sorted(space.rglob("*.md")):
            # Skip excluded directories
            relative = md_file.relative_to(space)
            parts = relative.parts
            if any(part in _SKIP_DIRS for part in parts):
                continue
            if md_file.stem in _SKIP_SLUGS:
                continue
            # Skip top-level browse pages (capitalised, single word)
            if len(parts) == 1 and md_file.stem[0].isupper():
                continue

            try:
                post = frontmatter.load(str(md_file))
                meta = dict(post.metadata)
                page_type = meta.get("type", "")
                if page_type in {"profile"}:
                    continue

                title = str(meta.get("title", md_file.stem))
                content = post.content or ""
                searchable = (title + " " + content).lower()

                if not all(term in searchable for term in terms):
                    continue

                title_match = all(term in title.lower() for term in terms)
                results.append({
                    "page": str(relative).replace("\\", "/"),
                    "slug": md_file.stem,
                    "title": title,
                    "type": page_type,
                    "snippet": _snippet(content, query),
                    "_rank": 0 if title_match else 1,
                })
            except Exception:
                continue

        results.sort(key=lambda r: (r.pop("_rank"), r["page"]))
        return results[:limit]
