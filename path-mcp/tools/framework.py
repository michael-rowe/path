from space_utils import load_framework_yaml, all_framework_yamls, list_pages


def register_tools(mcp):

    @mcp.tool()
    def get_framework(framework_slug: str) -> dict:
        """
        Return the full structure of a framework: its name, pillars, and all
        criteria with their titles and indicators.

        Call this when you need to understand what a framework requires before
        helping with claim writing, gap analysis, or explaining criteria to the user.

        Args:
            framework_slug: The framework identifier as it appears in path and
                claim frontmatter (e.g. 'UoL-TSPP-Professor', 'AdvanceHE-PSF-D4',
                'HCPC-CPD'). Case-insensitive.
        """
        fw = load_framework_yaml(framework_slug)
        if not fw:
            # Try listing installed frameworks to help the caller
            installed = [
                d.get("framework", {}).get("short", "unknown")
                for d in all_framework_yamls()
            ]
            return {
                "error": f"Framework '{framework_slug}' not found.",
                "installed_frameworks": installed,
            }

        framework_meta = fw.get("framework", {})
        pillars = fw.get("pillars", [])
        criteria = fw.get("criteria", [])

        return {
            "name": framework_meta.get("name"),
            "short": framework_meta.get("short"),
            "version": framework_meta.get("version"),
            "notes": framework_meta.get("notes"),
            "pillars": [
                {
                    "code": str(p.get("code", "")),
                    "name": p.get("name"),
                    "weight": p.get("weight"),
                }
                for p in pillars
            ],
            "criteria": [
                {
                    "code": str(c.get("code", "")),
                    "pillar": str(c.get("pillar", "")),
                    "title": c.get("title"),
                    "type": c.get("type"),
                    "indicators": c.get("indicators", []),
                }
                for c in criteria
            ],
        }

    @mcp.tool()
    def get_criterion(framework_slug: str, criterion_code: str) -> dict:
        """
        Return the full descriptor for a single criterion, including its title,
        indicators, and any extended notes from the criterion page in the portfolio.

        Call this when reviewing or drafting a claim for a specific standard, so
        you have the precise language the assessor uses.

        Args:
            framework_slug: Framework identifier (e.g. 'UoL-TSPP-Professor').
            criterion_code: Criterion code (e.g. '1.3', 'D4.2', 'HCPC-1').
        """
        fw = load_framework_yaml(framework_slug)
        criterion_yaml = None
        if fw:
            for c in fw.get("criteria", []):
                if str(c.get("code", "")) == str(criterion_code):
                    criterion_yaml = c
                    break

        # Also load the criterion page from space/criteria/ if it exists
        criterion_pages = list_pages("criteria", type_filter="criterion")
        criterion_page = next(
            (
                p for p in criterion_pages
                if str(p["meta"].get("code", "")).lower() == str(criterion_code).lower()
                and (
                    not framework_slug
                    or p["meta"].get("framework", "").lower().replace("-", "").replace("_", "")
                    == framework_slug.lower().replace("-", "").replace("_", "")
                )
            ),
            None,
        )

        if not criterion_yaml and not criterion_page:
            return {"error": f"Criterion '{criterion_code}' not found in framework '{framework_slug}'."}

        result: dict = {
            "code": criterion_code,
            "framework": framework_slug,
        }

        if criterion_yaml:
            result["title"] = criterion_yaml.get("title")
            result["pillar"] = str(criterion_yaml.get("pillar", ""))
            result["type"] = criterion_yaml.get("type")
            result["indicators"] = criterion_yaml.get("indicators", [])

        if criterion_page:
            result["title"] = result.get("title") or criterion_page["meta"].get("title")
            result["extended_notes"] = criterion_page.get("content", "").strip()
            result["page"] = criterion_page["page"]

        return result
