from space_utils import read_page


def register_tools(mcp):

    @mcp.tool()
    def get_profile() -> dict:
        """
        Return the user's professional identity: name, job title, employer,
        qualifications, and bio.

        Call this when drafting claims or personal statements so that the voice
        and context match the user's actual role and background.
        """
        page = read_page("profile.md")
        if not page:
            return {"error": "Profile page not found."}

        meta = page["meta"]

        # Extract bio from body (## Bio section) as a fallback if not in YAML
        bio = meta.get("bio") or ""
        if not bio:
            content = page.get("content", "")
            in_bio = False
            bio_lines = []
            for line in content.splitlines():
                if line.strip() == "## Bio":
                    in_bio = True
                    continue
                if in_bio:
                    if line.startswith("## "):
                        break
                    bio_lines.append(line)
            bio = "\n".join(bio_lines).strip()

        return {
            "full_name": meta.get("full_name"),
            "preferred_name": meta.get("preferred_name"),
            "pronouns": meta.get("pronouns"),
            "job_title": meta.get("job_title"),
            "employer": meta.get("employer"),
            "department": meta.get("department"),
            "orcid": meta.get("orcid"),
            "qualifications": meta.get("qualifications", []),
            "registrations": meta.get("registrations", []),
            "bio": bio,
        }
