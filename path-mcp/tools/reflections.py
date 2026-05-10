from space_utils import list_pages, read_page, ensure_list


def register_tools(mcp):

    @mcp.tool()
    def list_reflections(path_slug: str = None, limit: int = 10) -> list[dict]:
        """
        List reflections, optionally filtered by path, most recent first.
        Returns summary fields only. Use get_reflection() for full text.

        Args:
            path_slug: Filter to one path (e.g. 'uol-professor'). Omit for all paths.
            limit: Maximum number of reflections to return. Default 10.
        """
        pages = list_pages("reflections", type_filter="reflection")
        pages.sort(key=lambda p: p["meta"].get("date", "") or "", reverse=True)

        results = []
        for p in pages:
            meta = p["meta"]
            if path_slug and path_slug not in ensure_list(meta.get("paths")):
                continue
            results.append({
                "page": p["page"],
                "slug": p["slug"],
                "title": meta.get("title"),
                "date": str(meta.get("date", "")),
                "reflection_model": meta.get("framework"),
                "paths": ensure_list(meta.get("paths")),
                "related_cpd": ensure_list(meta.get("related_cpd")),
            })
            if len(results) >= limit:
                break

        return results

    @mcp.tool()
    def get_reflection(page_name: str) -> dict:
        """
        Return the full text and metadata for a specific reflection.

        Use this when reviewing reflective practice, assessing whether a reflection
        demonstrates the depth required by a framework, or helping the user
        strengthen a piece of reflective writing.

        Args:
            page_name: The page path as returned by list_reflections
                (e.g. 'reflections/2026-04-06-era-open-scholarship-workflow').
        """
        page = read_page(page_name)
        if not page:
            return {"error": f"Reflection page '{page_name}' not found."}
        meta = page["meta"]
        return {
            "page": page["page"],
            "slug": page["slug"],
            "title": meta.get("title"),
            "date": str(meta.get("date", "")),
            "reflection_model": meta.get("framework"),
            "paths": ensure_list(meta.get("paths")),
            "related_cpd": ensure_list(meta.get("related_cpd")),
            "content": page["content"],
        }
