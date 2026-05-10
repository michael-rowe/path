from pathlib import Path

import frontmatter

from space_utils import SPACE_DIR, list_pages, load_framework_yaml, ensure_list


def register_tools(mcp):

    @mcp.tool()
    def scan_inbox() -> dict:
        """
        Read files from the portfolio Inbox folder and return their content alongside
        the current coverage gaps across all active paths.

        Use this to help the user identify which inbox items might be relevant to
        their portfolio. When making suggestions:

        - Only suggest a portfolio connection if the source text explicitly states
          the relevant activity, role, or outcome. Do not infer.
        - Quote the exact words from the source that support each suggestion.
        - If the user's role at an event is ambiguous (e.g. a programme lists their
          name but does not state whether they presented or attended), flag the
          ambiguity and ask rather than assuming.
        - Suggest CPD entries or captures only — never claims directly from inbox
          content. Claims require the user's own argued narrative.

        Returns inbox files with their content, and gaps from the active paths so
        you can assess relevance.
        """
        inbox_dir = Path(SPACE_DIR) / "Inbox"
        files = []

        if inbox_dir.exists():
            for f in sorted(inbox_dir.iterdir()):
                if f.suffix in {".md", ".txt"} and f.is_file():
                    try:
                        if f.suffix == ".md":
                            post = frontmatter.load(str(f))
                            content = post.content
                            meta = dict(post.metadata)
                        else:
                            content = f.read_text(encoding="utf-8")
                            meta = {}
                        files.append({
                            "filename": f.name,
                            "meta": meta,
                            "content": content,
                        })
                    except Exception:
                        continue

        # Collect current gaps across active paths
        path_pages = list_pages("paths", type_filter="path")
        active_paths = [
            p for p in path_pages
            if p["meta"].get("status") == "active"
            and not p["slug"].endswith("-coverage")
            and p["slug"] != "index"
        ]

        claim_pages = list_pages("claims", type_filter="cpd-claim")
        cpd_pages = list_pages("cpd", type_filter="cpd")

        gaps_by_path = {}
        for path_record in active_paths:
            path_slug = path_record["meta"].get("slug", path_record["slug"])
            framework_short = path_record["meta"].get("framework", "")
            fw = load_framework_yaml(framework_short)
            if not fw:
                continue

            criteria_codes = [str(c.get("code", "")) for c in fw.get("criteria", [])]
            covered = set()

            for c in claim_pages:
                if c["meta"].get("path") == path_slug and c["slug"] != "criterion-code-short-name":
                    covered.add(str(c["meta"].get("standard", "")))
            for p in cpd_pages:
                if path_slug in ensure_list(p["meta"].get("paths")):
                    for s in ensure_list(p["meta"].get("standards")):
                        covered.add(str(s))

            gaps = [code for code in criteria_codes if code not in covered]
            gaps_by_path[path_slug] = {
                "framework": framework_short,
                "gaps": gaps,
            }

        return {
            "inbox_files": files,
            "inbox_count": len(files),
            "coverage_gaps": gaps_by_path,
        }
