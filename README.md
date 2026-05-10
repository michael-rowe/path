# Path

A local-first portfolio system for regulated professionals, built on top of [SilverBullet](https://silverbullet.md) (a browser-based markdown editor). Path turns SilverBullet into a structured workspace for capturing professional development activities, writing reflections, arguing claims against professional standards, and exporting a submission-ready document. Runs in Docker on your own machine; no accounts, no cloud sync, no subscription.

It's aimed at:

- Allied Health Professionals capturing CPD activity for HCPC recognition
- Academics and educators applying for AdvanceHE Fellowship (currently, only Senior or Principal frameworks available)
- Anyone working toward a structured professional recognition that requires evidence, reflection, and argued claims against published criteria

---

## ⚠️ Heads up

I'm not a developer. I'm an academic working in health professions education who built this because nothing else fit how I wanted to work, and I'm sharing it in case someone else finds it useful. A few things that follow from that:

- **It is not a product.** It is a personal project, made public.
- **There is no support.** I cannot answer "why does this not work on my machine" with any authority; I will probably just shrug and ask Claude.
- **There is no roadmap.** Things change when I'm working on my own portfolio and notice they're annoying.
- **There may be bugs I haven't seen.** I use exactly one configuration; yours will inevitably differ.
- **The bus factor is one.** And the one is not a software engineer *(You should be cautious.)*

If you're after something polished, supported, and feature-complete, this isn't it. If you're happy to tinker, explore markdown, and accept that the maintainer is figuring it out alongside you, you're in the right place.

---

## Some context

Two terms appear all over Path; here's what they mean.

**A Path** is a goal you're working towards: a promotion, a fellowship, a professional registration cycle. Each Path is an instance of pursuing recognition under one **framework**. You can have several Paths active at once — for example, an AdvanceHE Principal Fellowship alongside an institutional promotion application — and the same activity can count towards more than one of them.

**A framework** is the externally-defined set of standards a Path is judged against. The HCPC publishes five CPD standards; AdvanceHE publishes four descriptors with criteria; universities publish their promotion criteria. Path doesn't author these — it currently ships a small registry of professional development frameworks encoded as YAML and markdown templates, and you install whichever ones apply to you. If there's more interest in this project, it's trivial to add more.

Everything else in Path — activities, reflections, claims, evidence — is connected to one or more Paths and tagged against the criteria of those Paths' frameworks.

---

## Features

### Page types

Every piece of content is a structured markdown page with YAML frontmatter (you can think of YAML as file attributes):

- **Path**: a goal you're working towards. Has a status (active / planned / paused / completed / abandoned), a target date, and a framework.
- **Framework + Criteria**: installed from a registry on GitHub. Currently HCPC CPD, AdvanceHE D4 (Principal Fellow), AdvanceHE D3 (Senior Fellow stub).
- **CPD activity**: a logged activity (course, conference, project, teaching). Tagged with one or more Paths and the criteria it addresses.
- **Reflection**: a structured reflection using Driscoll, ERA, Gibbs, or Rolfe. Linked back to the activity.
- **Claim**: a written argument that one criterion has been met, supported by CPD entries and reflections. Includes a Quantified Impact table for measurable outcomes.
- **Evidence**: a separate page for an artefact (PDF, certificate, feedback letter) when the activity record alone doesn't capture it.
- **Credential**: verifiable records of awards, typically cryptographically validated by an external provider or institution.
- **Contact**: a network of contacts who can help support your professional development.
- **Task**: a checkbox item scoped to a Path, surfaced on the dashboard and the Path landing page.
- **Personal statement**: narrative introduction for a Path; embedded into the export.

---

### Editor surface

Path is a SilverBullet plug, not a fork. The editor is SilverBullet — wikilinks, transclusion, full-text search. Path adds:

- A branded left-hand **Navigator** with browse links per page type.
- A right-hand **Inspector** for editable YAML frontmatter (dropdowns where there are enums, multi-select checkboxes for `paths` and `standards`, a Linked Mentions section, a Delete-page button).
- A "View only" badge on system pages so you don't accidentally edit the dashboard.
- Light/dark themes that persist.
- A **Focus mode** that hides both panels.

---

### Screenshots

A few screenshots to give you a sense of what it looks like.

<img width="2836" height="1433" alt="path_interface" src="https://github.com/user-attachments/assets/1833f012-1978-49d6-948a-8514b7758e7c" /><br />

<img width="1309" height="1163" alt="path_heatmap" src="https://github.com/user-attachments/assets/f8d9b3ce-1bfc-4175-bb03-3b5486ee05c8" /><br />

<img width="1431" height="739" alt="path_frameworks" src="https://github.com/user-attachments/assets/b1ff2ba0-b652-4b5d-9a4b-4af0df52e9ef" /><br />

<img width="1308" height="504" alt="path_task_dashboard" src="https://github.com/user-attachments/assets/206a8cff-a39e-49ff-8ed1-87087d8aca99" /><br />

<img width="2843" height="1461" alt="path_dark_mode" src="https://github.com/user-attachments/assets/7487ced9-20ed-433e-ae70-0f4db6b7cd4f" /><br />


---

### Workflow

A single **Capture** button opens a picker that routes to the right template. Active Path is detected automatically; with two or more, you're asked which Path the new entry is for. Frameworks then drive the rest — for example, a new claim's `framework` field auto-fills based on the chosen Path, and the Inspector's `standards` field becomes a checkbox list of that framework's criteria rather than free-text.

When a goal is achieved (or abandoned), `Path: Archive this Path` flips its status without removing any links from your historical CPD or claims.

### Dashboards and queries

- A coverage **heatmap** per Path shows claims, CPD, reflections, and evidence per criterion at a glance.
- A **gap list** highlights criteria without a claim, CPD entry, or reflection.
- A **Path activity grid** (current month on the dashboard, full year on each Path).
- An **Active Paths** table summarises every running Path with its framework, criteria-covered ratio, claims-ready count, and target date.
- **Open tasks** roll up across all Paths with a chip showing scope.

Queries use SilverBullet's Lua-based query language and re-evaluate live as you add content.

### Export

Optional Pandoc sidecar runs as a separate Docker container. Compiles a chosen subset of pages — personal statement, claims, supporting evidence — into a Word document ready for editing and submission. For PDF, use your browser's print function. Excluded by default to keep the install small (~150 MB without, ~250 MB with).

---

### AI assistant (MCP server)

Optional MCP server runs as a third Docker container and connects your portfolio to an AI client (Claude, Cursor, or any MCP-compatible tool). Once connected, the AI can read your portfolio structure and help you work with it directly.

**What it exposes (read):**

| Tool | What it does |
|---|---|
| `get_portfolio_summary` | Overview of all active Paths, total claims/CPD/reflections |
| `list_active_paths` | Active Paths with framework, status, target date |
| `get_path_coverage` | Criterion-by-criterion coverage — claims, CPD, reflections per standard |
| `get_framework` / `get_criterion` | Framework structure and individual criterion detail |
| `list_claims` / `get_claim` | All claims or a single claim with full narrative |
| `list_cpd` / `get_cpd_entry` | CPD activity log |
| `list_reflections` / `get_reflection` | Reflections with full text |
| `list_evidence` | Evidence pages linked to criteria |
| `get_profile` | Your identity and professional context |
| `get_user_context` | Writing voice and style preferences for drafting |
| `search_portfolio` | Full-text search across all portfolio pages |
| `scan_inbox` | Unprocessed captures waiting for review |

**What it enables (write — all writes go to Inbox for review before saving):**

| Tool | What it does |
|---|---|
| `create_capture` | Draft a quick capture from a document or pasted text |
| `create_cpd_entry` | Draft a CPD activity record |
| `update_claim_status` | Move a claim from draft to ready |

**What this makes possible:**

- Ask "what's the biggest gap in my portfolio?" and get a criterion-by-criterion answer
- Paste in a conference programme or meeting notes and ask "does anything here count as CPD?"
- Ask the AI to draft a reflection or claim narrative in your own voice, grounded in your existing records
- Get a gap analysis before a submission deadline without opening the portfolio at all

**Starting the MCP server:**

```bash
docker compose --profile ai up -d
```

The server runs on `http://localhost:3001/sse`. Configure your AI client to connect there. For Claude Code, add to `~/.claude.json`:

```json
"path": {
  "type": "sse",
  "url": "http://localhost:3001/sse"
}
```

The server is read-only by default for browsing. Write tools create drafts in your Inbox — nothing is committed to your portfolio without your review.

---

### Data ownership

Everything lives in `space/` as plain markdown. If you stop using Path, the files are still readable in any text editor. Nothing is sent off your machine.

---

## Prerequisites

- [Docker](https://www.docker.com/)
- A modern browser

No Node, Python, or LaTeX installation needed — Docker handles all of it.

---

## Setup

This is untested outside of my specific working environment. If anyone gets it to work on Mac or Windows, please let me know.

```bash
git clone https://github.com/michael-rowe/path.git
cd path
cp .env.example .env
# Edit .env: SB_USER=admin:your-password
```

Then either:

```bash
docker compose up -d                          # ~150 MB, no PDF export
docker compose --profile export up -d         # ~500 MB, includes Pandoc + XeLaTeX
```

Open http://localhost:3000, log in with whatever you put in `.env`, and follow the **Getting started** page. It walks you through filling in your profile, installing a framework, and creating your first activity.

---

## Updating

The app provides notifications when udpates are available, with instructions on how to follow through.

```bash
git pull
docker compose pull silverbullet
docker compose up -d
```

Your content (`space/claims/`, `space/cpd/`, etc.) is gitignored so updates don't touch it. If you're running the export profile and Pandoc has been rebuilt:

```bash
docker compose --profile export up -d --build pandoc-svc
```

---

## Backing up

```bash
cp -r space/ /somewhere/safe/
```

That's it — everything is plain markdown plus a few image attachments.

---

## Frameworks

Frameworks are installed at runtime from a separate registry: [github.com/michael-rowe/path-frameworks](https://github.com/michael-rowe/path-frameworks). Inside Path, run **Path: Add framework** from the command palette.

To contribute a new framework or update an existing one, open an issue or PR on the registry repo. A framework bundle is just a YAML file describing the criteria, plus a small set of templates and a Path scaffold. Or, let me know what framework you're working against and I'll create a draft that you can work with.

---

## Manual

The full manual is inside Path itself. Open the command palette and navigate to `manual/index`, or click the book icon in the toolbar. It's plain markdown, so you can also read it on disk if Docker isn't running.

---

## Contributing

Contributions would genuinely be cool. Fair warning though: I've never reviewed a pull request in my life, and the words "rebase" and "squash" mean roughly nothing to me. I'll figure it out — slowly, badly, possibly with help — but expect turnaround to be measured in days, not minutes.

Issues are easier and very welcome. Bug reports with reproduction steps and your SilverBullet / Docker versions are particularly useful (but bear in mind, I'm not a developer). Feature requests are also welcome but unlikely to be acted on quickly unless they overlap with what I happen to need next.

---

## Licence

MIT — same as [SilverBullet](https://silverbullet.md), which Path is built on.

In practical terms, MIT means: anyone can use, copy, modify, distribute, or sell Path, as long as they keep the copyright notice. There's no warranty, and I'm not liable if it breaks anything for you. For me, it means I retain copyright on what I've written but I've explicitly given everyone permission to use it however they like — including forking it, taking the parts they want, and never speaking of me again. That's the deal: take it as-is, do what you want with it, don't expect me to fix it.
