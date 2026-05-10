"""
Path MCP Server

Exposes portfolio data from a SilverBullet space directory via the Model Context
Protocol. Designed to run as a Docker service alongside the SilverBullet and
Pandoc containers in the Path stack.

Transport: SSE (Server-Sent Events) on 0.0.0.0:MCP_PORT (default 3001).
Configure your AI client to connect at http://localhost:3001/sse.
"""

import os

from mcp.server.fastmcp import FastMCP

from tools import claims, context, cpd, evidence, framework, inbox, portfolio, profile, reflections, search, write

mcp = FastMCP(
    "path-portfolio",
    instructions="""
You are connected to a professional portfolio built with Path, a CPD and credentialing
system for regulated professionals.

You have access to the user's claims, CPD entries, reflections, evidence, and the
frameworks they are working towards. Use these tools to help with gap analysis, claim
review and drafting, logging CPD activities, and identifying portfolio-relevant content.

Important principles:
- When reading source documents (inbox files, pasted text), only report what is
  explicitly stated. Do not infer roles, hours, or outcomes.
- Quote the source text when suggesting a portfolio connection.
- Flag ambiguity rather than resolve it — if the user's role at an event is unclear,
  ask rather than assume.
- Before calling any write tool (create_capture, create_cpd_entry, update_claim_status),
  summarise what you are about to write and confirm with the user.
- Writes go to the Inbox for user review — they are drafts, not finished records.
- Before drafting any claim text, reflection, or CPD narrative, call
  get_user_context() to read the user's preferred writing voice and style.
""".strip(),
)

# Register all tool modules
context.register_tools(mcp)
portfolio.register_tools(mcp)
framework.register_tools(mcp)
claims.register_tools(mcp)
cpd.register_tools(mcp)
reflections.register_tools(mcp)
evidence.register_tools(mcp)
search.register_tools(mcp)
profile.register_tools(mcp)
inbox.register_tools(mcp)
write.register_tools(mcp)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("MCP_PORT", "3001"))
    uvicorn.run(mcp.sse_app(), host="0.0.0.0", port=port)
