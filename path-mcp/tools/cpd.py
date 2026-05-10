from space_utils import list_pages, read_page, ensure_list


def register_tools(mcp):

    @mcp.tool()
    def list_cpd(
        path_slug: str = None,
        criterion_code: str = None,
        limit: int = 20,
    ) -> list[dict]:
        """
        List CPD (continuing professional development) entries, optionally filtered
        by path and/or criterion code. Returns summary fields only — not full text.
        Use get_cpd_entry() to read a specific entry in full.

        Args:
            path_slug: Filter to one path (e.g. 'uol-professor'). Omit for all paths.
            criterion_code: Filter to entries tagged to a specific criterion
                (e.g. '1.3', '2.1').
            limit: Maximum number of entries to return, most recent first. Default 20.
        """
        pages = list_pages("cpd", type_filter="cpd")
        # Sort most recent first
        pages.sort(key=lambda p: p["meta"].get("date", "") or "", reverse=True)

        results = []
        for p in pages:
            meta = p["meta"]
            paths = ensure_list(meta.get("paths"))
            standards = [str(s) for s in ensure_list(meta.get("standards"))]

            if path_slug and path_slug not in paths:
                continue
            if criterion_code and str(criterion_code) not in standards:
                continue

            results.append({
                "page": p["page"],
                "slug": p["slug"],
                "title": meta.get("title"),
                "date": str(meta.get("date", "")),
                "activity_type": meta.get("activity_type"),
                "hours": meta.get("hours"),
                "standards": standards,
                "paths": paths,
                "status": meta.get("status"),
            })
            if len(results) >= limit:
                break

        return results

    @mcp.tool()
    def get_cpd_entry(page_name: str) -> dict:
        """
        Return the full text and metadata for a specific CPD entry.

        Use this when reviewing what an activity involved, checking which criteria
        it supports, or assessing whether it provides sufficient evidence for a claim.

        Args:
            page_name: The page path as returned by list_cpd
                (e.g. 'cpd/2026-04-15-rcn-education-keynote').
        """
        page = read_page(page_name)
        if not page:
            return {"error": f"CPD page '{page_name}' not found."}
        meta = page["meta"]
        return {
            "page": page["page"],
            "slug": page["slug"],
            "title": meta.get("title"),
            "date": str(meta.get("date", "")),
            "activity_type": meta.get("activity_type"),
            "hours": meta.get("hours"),
            "standards": [str(s) for s in ensure_list(meta.get("standards"))],
            "paths": ensure_list(meta.get("paths")),
            "status": meta.get("status"),
            "evidence": ensure_list(meta.get("evidence")),
            "reflection_brief": meta.get("reflection_brief"),
            "content": page["content"],
        }
