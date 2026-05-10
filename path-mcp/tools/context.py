from pathlib import Path
from space_utils import SPACE_DIR

CONTEXT_FILE = "_system/mcp-context.md"
CONTEXT_PATH = Path(SPACE_DIR) / "_system" / "mcp-context.md"

DEFAULT_MESSAGE = (
    "No context file found. The portfolio owner can create one at "
    f"{CONTEXT_FILE} in their Path space to provide writing preferences, "
    "voice guidance, and additional background."
)


def register_tools(mcp):

    @mcp.tool()
    def get_user_context() -> str:
        """
        Return the portfolio owner's personal context file: their preferred writing
        voice, terminology, background notes, and any custom instructions for how
        they want AI assistance to work.

        Call this before drafting any claim text, reflection, personal statement,
        or CPD narrative — it ensures the output sounds like the user, not generic
        AI prose. Also call it if the user asks you to write 'in their voice' or
        'as they would write it'.

        The user edits this file directly in Path (look for 'AI context' in the
        Workspace section of the Navigator).
        """
        if not CONTEXT_PATH.exists():
            return DEFAULT_MESSAGE
        try:
            return CONTEXT_PATH.read_text(encoding="utf-8").strip()
        except Exception as e:
            return f"Could not read context file: {e}"
