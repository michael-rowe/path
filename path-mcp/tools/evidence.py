from space_utils import list_pages, ensure_list


def register_tools(mcp):

    @mcp.tool()
    def list_evidence(path_slug: str = None) -> list[dict]:
        """
        List evidence pages — formal artefacts such as certificates, published
        articles, feedback letters, and presentations. Most CPD activities do not
        have a separate evidence page; this tool returns only pages with
        type: evidence.

        Args:
            path_slug: Filter to one path (e.g. 'uol-professor'). Omit for all paths.
        """
        pages = list_pages("evidence", type_filter="evidence")
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
                "file_type": meta.get("file_type"),
                "paths": ensure_list(meta.get("paths")),
                "standards": [str(s) for s in ensure_list(meta.get("standards"))],
                "related_cpd": ensure_list(meta.get("related_cpd")),
                "related_claims": ensure_list(meta.get("related_claims")),
            })

        return results
