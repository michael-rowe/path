---
title: AI features
readonly: true
---

# AI features

Path can connect to AI assistants that support the Model Context Protocol (MCP).
When connected, the AI can read your portfolio — claims, CPD, reflections,
frameworks — and help you with gap analysis, claim drafting, logging activities,
and reviewing your evidence.

**This is optional.** Path works fully without it. AI connection is for users who
want to have a conversation about their portfolio with an AI assistant.

---

## What the AI can see

When you connect an AI assistant to Path, it can access:

- Your active paths and framework criteria
- Your claims, CPD entries, reflections, and evidence pages
- Your portfolio coverage (which criteria have evidence, which are gaps)
- Content you drop into the **Inbox** folder for review
- Your profile (name, job title, bio)

**What it cannot see:** your contacts and network, your personal statement pages
(excluded in v1), any files outside the Path space folder.

---

## Your data and privacy

When the AI reads your portfolio, that content is sent to the AI provider's servers
for processing. This is how the technology works — the AI cannot read your data
without it leaving your device.

- Your data is not used to train AI models (this is standard policy for API-based
  access from providers such as Anthropic, OpenAI, and others).
- Human review is possible in limited circumstances (safety monitoring), but is
  unlikely for typical portfolio content.
- If your portfolio contains sensitive information — patient details, confidential
  employer matters, or identifiable information about colleagues — use your
  professional judgement about what to include in AI conversations.
- You can always paste specific text into the chat yourself rather than using the
  connected tools. This gives you precise control over what is shared.

Health professionals: HCPC, NMC, and other regulatory bodies already require that
registrants do not include patient-identifiable information in CPD records. The AI
connection reinforces that existing standard, not adds to it.

---

## Setting up

### Step 1 — start the MCP server

In a terminal, from your Path directory:

```
docker compose --profile ai up -d
```

This starts the Path MCP server alongside SilverBullet. It runs on port 3001 and
restarts automatically with your system.

To stop it: `docker compose --profile ai down` or `docker compose stop path-mcp`

### Step 2 — connect your AI client

#### Claude Desktop (Mac or Windows)

1. Open Claude Desktop → Settings → Developer → Edit Config
2. Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "path-portfolio": {
      "url": "http://localhost:3001/sse"
    }
  }
}
```

3. Restart Claude Desktop. You should see **path-portfolio** listed as a connected
   source.

Other MCP-compatible clients use equivalent configuration — refer to their
documentation for where to add a server URL.

### Step 3 — set your AI context (optional but recommended)

Open **AI context** in the Workspace section of the Navigator. Fill in your
writing voice, professional background, and any custom instructions. The AI
reads this file whenever it drafts text on your behalf.

---

## Conversation starters

Once connected, try these prompts to get started:

**Gap analysis**
> "What should I work on next for my [framework] portfolio?"

**Reviewing a claim**
> "Review my claim for standard 1.3 and tell me if the argument is strong enough."

**Logging CPD**
> "I just attended a two-hour workshop on simulation-based learning. Help me log it."

**Checking readiness**
> "Am I ready to submit my HCPC revalidation?"

**Reviewing inbox content**
> "I've dropped a conference programme into my Inbox — can you tell me if anything
> in it is relevant to my portfolio?"

**Drafting a reflection**
> "Help me write a Gibbs reflection on the RCN keynote I delivered last month."

---

## How writes work

The AI never edits your existing portfolio pages. Anything it creates — CPD entries,
captures, drafted reflections — goes into your **Inbox** folder as a draft. You
review it in Path, move it to the right place, and update the status when you're
satisfied.

This means the worst case for an AI error is a draft you delete. It cannot
overwrite a submitted claim or alter your evidence.
