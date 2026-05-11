from space_utils import list_pages, read_page, write_page, ensure_list

VALID_STATUSES = {"draft", "ready", "submitted"}

# Template file that ships with Path — skip it in listings
TEMPLATE_SLUG = "criterion-code-short-name"


def register_tools(mcp):

    @mcp.tool()
    def list_claims(
        path_slug: str = None,
        status: str = None,
        criterion_code: str = None,
    ) -> list[dict]:
        """
        List claims, optionally filtered by path, status, and/or criterion code.
        Returns title, status, criterion, and path for each claim — not full text.
        Use get_claim() to read a specific claim in full.

        Args:
            path_slug: Filter to one path (e.g. 'uol-professor'). Omit for all paths.
            status: Filter by status: 'draft', 'ready', or 'submitted'.
            criterion_code: Filter to one criterion (e.g. '1.3', 'D4.2').
        """
        pages = list_pages("claims", type_filter="cpd-claim")
        results = []
        for p in pages:
            if p["slug"] == TEMPLATE_SLUG:
                continue
            meta = p["meta"]
            if path_slug and meta.get("path") != path_slug:
                continue
            if status and meta.get("status") != status:
                continue
            if criterion_code and str(meta.get("standard", "")) != str(criterion_code):
                continue
            results.append({
                "page": p["page"],
                "slug": p["slug"],
                "title": meta.get("title"),
                "path": meta.get("path"),
                "framework": meta.get("framework"),
                "standard": str(meta.get("standard", "")),
                "status": meta.get("status"),
                "claim_type": meta.get("claim_type"),
                "last_updated": str(meta.get("last_updated", "")),
                "evidence_count": len(ensure_list(meta.get("evidence"))),
            })
        return results

    @mcp.tool()
    def get_claim(page_name: str) -> dict:
        """
        Return the full text and metadata for a specific claim.

        Use this when reviewing a claim's argument, checking whether evidence
        citations are complete, or assessing readiness for submission.

        Args:
            page_name: The page path as returned by list_claims
                (e.g. 'claims/uol-1-3-leading-teaching-innovation').
        """
        page = read_page(page_name)
        if not page:
            return {"error": f"Claim page '{page_name}' not found."}
        meta = page["meta"]
        return {
            "page": page["page"],
            "slug": page["slug"],
            "title": meta.get("title"),
            "path": meta.get("path"),
            "framework": meta.get("framework"),
            "standard": str(meta.get("standard", "")),
            "status": meta.get("status"),
            "claim_type": meta.get("claim_type"),
            "evidence": ensure_list(meta.get("evidence")),
            "last_updated": str(meta.get("last_updated", "")),
            "content": page["content"],
        }

    @mcp.tool()
    def update_claim_status(page_name: str, status: str) -> dict:
        """
        Update the status field of a claim. Only call this after explicitly
        confirming the new status with the user.

        Valid statuses: 'draft' → 'ready' → 'submitted'.

        Args:
            page_name: Page path (e.g. 'claims/uol-1-3-leading-teaching-innovation').
            status: New status — must be 'draft', 'ready', or 'submitted'.
        """
        if status not in VALID_STATUSES:
            return {"error": f"Invalid status '{status}'. Must be one of: {sorted(VALID_STATUSES)}"}

        page = read_page(page_name)
        if not page:
            return {"error": f"Claim page '{page_name}' not found."}

        meta = page["meta"]
        old_status = meta.get("status", "unknown")
        meta["status"] = status

        written = write_page(page_name, meta, page["content"], allow_update=True)
        return {
            "page": written,
            "title": meta.get("title"),
            "old_status": old_status,
            "new_status": status,
        }
