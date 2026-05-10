from space_utils import (
    list_pages, load_framework_yaml, all_framework_yamls, ensure_list
)


def register_tools(mcp):

    @mcp.tool()
    def get_portfolio_summary() -> dict:
        """
        Return a high-level overview of the portfolio: active paths, coverage counts
        per path, claims by status, and the five most recent CPD entries.

        Call this first in any portfolio conversation to orient yourself before
        asking more specific questions.
        """
        # Active paths
        path_pages = list_pages("paths", type_filter="path")
        active_paths = [
            {
                "slug": p["meta"].get("slug", p["slug"]),
                "title": p["meta"].get("title", p["slug"]),
                "framework": p["meta"].get("framework"),
                "status": p["meta"].get("status"),
                "target_date": p["meta"].get("target_date"),
            }
            for p in path_pages
            if p["meta"].get("status") == "active"
            and not p["slug"].endswith("-coverage")
            and p["slug"] != "index"
        ]

        # Claims inventory
        claim_pages = list_pages("claims", type_filter="cpd-claim")
        claims_by_status: dict[str, int] = {}
        claims_by_path: dict[str, dict] = {}
        for c in claim_pages:
            if c["slug"] == "criterion-code-short-name":
                continue
            status = c["meta"].get("status", "unknown")
            claims_by_status[status] = claims_by_status.get(status, 0) + 1
            path_slug = c["meta"].get("path", "unknown")
            if path_slug not in claims_by_path:
                claims_by_path[path_slug] = {}
            claims_by_path[path_slug][status] = (
                claims_by_path[path_slug].get(status, 0) + 1
            )

        # CPD — five most recent
        cpd_pages = list_pages("cpd", type_filter="cpd")
        cpd_sorted = sorted(
            cpd_pages,
            key=lambda p: p["meta"].get("date", "") or "",
            reverse=True,
        )
        recent_cpd = [
            {
                "page": p["page"],
                "title": p["meta"].get("title"),
                "date": str(p["meta"].get("date", "")),
                "activity_type": p["meta"].get("activity_type"),
                "hours": p["meta"].get("hours"),
                "standards": ensure_list(p["meta"].get("standards")),
                "paths": ensure_list(p["meta"].get("paths")),
            }
            for p in cpd_sorted[:5]
        ]

        # Per-path criterion coverage
        coverage: dict[str, dict] = {}
        for path_info in active_paths:
            path_slug = path_info["slug"]
            fw = load_framework_yaml(path_info.get("framework", ""))
            total_criteria = len(fw.get("criteria", [])) if fw else 0

            path_claims = [
                c for c in claim_pages
                if c["meta"].get("path") == path_slug
                and c["slug"] != "criterion-code-short-name"
            ]
            path_cpd = [
                p for p in cpd_pages
                if path_slug in ensure_list(p["meta"].get("paths"))
            ]

            coverage[path_slug] = {
                "total_criteria": total_criteria,
                "claims_total": len(path_claims),
                "claims_by_status": claims_by_path.get(path_slug, {}),
                "cpd_entries": len(path_cpd),
            }

        return {
            "active_paths": active_paths,
            "claims_overall": claims_by_status,
            "coverage_per_path": coverage,
            "recent_cpd": recent_cpd,
        }

    @mcp.tool()
    def list_active_paths() -> list[dict]:
        """
        Return all active paths with their framework, status, and target date.

        A path is the user's instance of working towards a specific credential or
        recognition (e.g. HCPC revalidation, AdvanceHE Fellowship). Each path
        targets one framework.
        """
        path_pages = list_pages("paths", type_filter="path")
        return [
            {
                "slug": p["meta"].get("slug", p["slug"]),
                "title": p["meta"].get("title"),
                "framework": p["meta"].get("framework"),
                "pathway": p["meta"].get("pathway"),
                "status": p["meta"].get("status"),
                "target_date": str(p["meta"].get("target_date", "")),
                "page": p["page"],
            }
            for p in path_pages
            if not p["slug"].endswith("-coverage") and p["slug"] != "index"
        ]

    @mcp.tool()
    def get_path_coverage(path_slug: str) -> dict:
        """
        Return criterion-by-criterion coverage for a path: how many claims, CPD
        entries, and reflections exist for each criterion code.

        Use this to identify gaps — criteria with no claims or thin CPD — before
        suggesting what the user should work on next.

        Args:
            path_slug: The path identifier (e.g. 'uol-professor', 'hcpc-cpd').
        """
        # Load path to get framework
        path_pages = list_pages("paths", type_filter="path")
        path_record = next(
            (p for p in path_pages if p["meta"].get("slug", p["slug"]) == path_slug),
            None,
        )
        framework_short = path_record["meta"].get("framework", "") if path_record else ""
        fw = load_framework_yaml(framework_short)
        criteria_list = fw.get("criteria", []) if fw else []

        # Claims per criterion
        claim_pages = list_pages("claims", type_filter="cpd-claim")
        path_claims = [
            c for c in claim_pages
            if c["meta"].get("path") == path_slug
            and c["slug"] != "criterion-code-short-name"
        ]

        # CPD per criterion
        cpd_pages = list_pages("cpd", type_filter="cpd")
        path_cpd = [
            p for p in cpd_pages
            if path_slug in ensure_list(p["meta"].get("paths"))
        ]

        # Reflections per path (not per criterion — reflections aren't criterion-scoped)
        reflection_pages = list_pages("reflections", type_filter="reflection")
        path_reflections = [
            r for r in reflection_pages
            if path_slug in ensure_list(r["meta"].get("paths"))
        ]

        # Build coverage map
        coverage = {}
        for criterion in criteria_list:
            code = criterion.get("code", "")
            code_str = str(code)

            criterion_claims = [
                c for c in path_claims
                if str(c["meta"].get("standard", "")) == code_str
            ]
            criterion_cpd = [
                p for p in path_cpd
                if code_str in [str(s) for s in ensure_list(p["meta"].get("standards"))]
            ]

            coverage[code_str] = {
                "title": criterion.get("title", ""),
                "pillar": str(criterion.get("pillar", "")),
                "claims": len(criterion_claims),
                "claims_ready": sum(
                    1 for c in criterion_claims
                    if c["meta"].get("status") == "ready"
                ),
                "claims_draft": sum(
                    1 for c in criterion_claims
                    if c["meta"].get("status") == "draft"
                ),
                "cpd_entries": len(criterion_cpd),
                "gap": len(criterion_claims) == 0 and len(criterion_cpd) == 0,
            }

        gaps = [code for code, data in coverage.items() if data["gap"]]

        return {
            "path_slug": path_slug,
            "framework": framework_short,
            "total_criteria": len(criteria_list),
            "total_reflections": len(path_reflections),
            "gaps": gaps,
            "criteria": coverage,
        }
