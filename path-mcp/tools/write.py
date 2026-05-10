from datetime import date as date_type
from pathlib import Path

from space_utils import write_page, slugify, ensure_list

VALID_CPD_STATUSES = {"draft", "unprocessed"}
VALID_ACTIVITY_TYPES = {
    "conference", "workshop", "course", "reading", "presentation",
    "peer-review", "committee", "mentoring", "supervision", "other",
}


def register_tools(mcp):

    @mcp.tool()
    def create_capture(content: str, path_slug: str = None) -> dict:
        """
        Save a piece of text to the portfolio Inbox as a draft capture for the
        user to review and promote in Path.

        Use this to preserve anything useful produced during the conversation —
        a drafted reflection, a claim outline, a note about an activity — before
        ending the session. Always confirm with the user before calling this.

        The capture will appear in Path's Inbox within a few seconds of being written.

        Args:
            content: The text to save. Include a heading so the user can identify
                it at a glance.
            path_slug: Optional path to associate the capture with
                (e.g. 'uol-professor').
        """
        today = date_type.today().isoformat()

        # Derive a filename from the first heading in content, or today's date
        first_line = content.strip().splitlines()[0] if content.strip() else ""
        heading = first_line.lstrip("#").strip() if first_line.startswith("#") else ""
        slug = slugify(heading) if heading else "capture"
        filename = f"Inbox/{today}-{slug}.md"

        meta: dict = {
            "type": "capture",
            "date": today,
            "status": "unprocessed",
            "tags": ["capture"],
        }
        if path_slug:
            meta["paths"] = [path_slug]

        written = write_page(filename, meta, content)
        return {
            "page": written,
            "message": "Saved to Inbox. Open Path to review and promote this capture.",
        }

    @mcp.tool()
    def create_cpd_entry(
        title: str,
        activity_date: str,
        activity_type: str,
        hours: float,
        standards: list[str],
        narrative: str,
        path_slug: str = None,
    ) -> dict:
        """
        Create a draft CPD entry in the portfolio Inbox for the user to review.

        Only call this after the user has explicitly confirmed the details. Record
        only what the user has stated — do not add assumed hours, inferred standards,
        or activities not mentioned.

        The entry will appear in Path's Inbox within a few seconds. The user can
        open it in Path, review it in the Inspector panel, and move it to the cpd/
        folder once satisfied.

        Always confirm these details with the user before calling:
        - Title and date
        - Activity type and hours (must be stated, not estimated)
        - Which standards it supports (user should confirm, not AI)
        - The narrative (what happened and what changed)

        Args:
            title: Short descriptive title for the CPD activity.
            activity_date: Date in YYYY-MM-DD format.
            activity_type: One of: conference, workshop, course, reading,
                presentation, peer-review, committee, mentoring, supervision, other.
            hours: Time spent in hours (e.g. 2.0, 0.5). Must be stated by the user.
            standards: List of criterion codes this supports (e.g. ['1.3', '2.1']).
                Confirm with the user — do not infer from activity description.
            narrative: What the user did and what changed as a result. Use the
                user's own words where possible.
            path_slug: Path to associate this CPD with (e.g. 'uol-professor').
        """
        if activity_type not in VALID_ACTIVITY_TYPES:
            activity_type = "other"

        slug = slugify(title)
        filename = f"Inbox/{activity_date}-{slug}.md"

        meta: dict = {
            "type": "cpd",
            "title": title,
            "date": activity_date,
            "activity_type": activity_type,
            "hours": hours,
            "standards": standards,
            "status": "draft",
        }
        if path_slug:
            meta["paths"] = [path_slug]

        body = f"# CPD activity: {title}\n\n{narrative.strip()}\n"

        written = write_page(filename, meta, body)
        return {
            "page": written,
            "message": (
                "Draft CPD entry saved to Inbox. Open Path to review it and move "
                "it to cpd/ when you're happy with the details."
            ),
        }
