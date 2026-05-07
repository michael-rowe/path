# Path

A local-first portfolio system for regulated professionals — built on top of [SilverBullet](https://silverbullet.md). Path turns SilverBullet into a structured workspace for logging activities, writing reflections, arguing claims against professional standards, and exporting a submission-ready document. Runs in Docker on your own machine; no accounts, no cloud sync, no subscription.

It's aimed at:

- Allied Health Professionals preparing HCPC revalidation
- Academics and educators applying for AdvanceHE Fellowship (Senior or Principal)
- Anyone working toward a structured professional recognition that requires evidence, reflection, and argued claims against published criteria

---

## ⚠️ Warning

A few honest reasons this might not be the system for you:

- You don't have a portfolio to build, or your existing one already works.
- You'd rather a polished, finished product than something a clinician maintains on weekends.
- You distrust software with a bus factor of one. *(You are correct to do this.)*
- Indigo gives you migraines. Path uses a lot of indigo.
- You are a regulator. We will figure out where you live.

---

## What it does

### Page types

Every piece of content is a structured markdown page with YAML frontmatter:

- **Path** — a goal you're working towards (a promotion, fellowship, registration cycle). Each Path uses a framework.
- **Framework + Criteria** — installed from a registry. Currently HCPC CPD, AdvanceHE D4 (Principal Fellow), AdvanceHE D3 (Senior Fellow stub), UoL TSPP. Frameworks ship as bundles of criterion pages plus a Path scaffold.
- **CPD activity** — a logged activity (course, conference, project, teaching). Tagged with one or more Paths and the criteria it addresses.
- **Reflection** — a structured reflection using Driscoll, ERA, Gibbs, or Rolfe. Linked back to the activity it came from.
- **Claim** — a written argument that one criterion has been met, supported by CPD entries and reflections. Includes a Quantified Impact table for measurable outcomes.
- **Evidence** — a separate page for an artefact (PDF, certificate, feedback letter) when the activity record alone doesn't capture it. Most activities don't need one.
- **Contact** and **Credential** — first-class network and award records, queryable across Paths.
- **Task** — a checkbox item scoped to a Path, surfaced on the dashboard and the Path landing page.
- **Personal statement** — narrative introduction for a Path; embedded into the export.

### Workflow

A single **Capture** button (Ctrl-Alt-c) opens a picker that routes you to the right template. Active Path is detected automatically; with two or more, you're asked which Path the new entry belongs to. Frameworks then drive the rest — for example, a new claim's `framework` field auto-fills based on the chosen Path, and the Inspector's `standards` field becomes a checkbox list of that framework's criteria rather than free-text.

When a goal is achieved (or abandoned), `Path: Archive this Path` flips its status without removing any links from your historical CPD or claims.

### Dashboards and queries

- A coverage **heatmap** per Path shows claims, CPD, reflections, and evidence per criterion at a glance.
- A **gap list** highlights criteria without a claim, CPD entry, or reflection.
- A **CPD activity grid** (current month on the dashboard, full year on each Path) tracks cadence.
- An **Active Paths** table summarises every running Path with its framework, criteria-covered ratio, claims-ready count, and target date.
- **Open tasks** roll up across all Paths with a chip showing scope.

All queries are written in SilverBullet's Lua-based query language and re-evaluate live as you add content.

### Export

Optional Pandoc + XeLaTeX sidecar runs as a separate Docker container. Compiles a chosen subset of pages — personal statement, claims, supporting evidence — into a PDF or Word document with a cover page populated from your profile. Excluded by default to keep the install small (~150 MB without, ~500 MB with).

### Editor surface

Path is a SilverBullet plug, not a fork. The editor is SilverBullet — wikilinks, transclusion, full-text search, daily auto-commits to git if you set one up. Path adds:

- A branded left-hand **Navigator** with browse links per page type.
- A right-hand **Inspector** for editable YAML frontmatter (dropdowns where there are enums, multi-select checkboxes for `paths` and `standards`, a Linked Mentions section, a Delete-page button).
- A "View only" badge on system pages so you don't accidentally edit the dashboard.
- Light/dark themes that persist.
- **Focus mode** (Ctrl-Alt-z) hides both panels.

### Data ownership

Everything lives in `space/` as plain markdown files. If you stop using Path, the files are still readable in any text editor. Nothing is ever sent off your machine.

---

## Known rough edges

- Clicking on a heading on a "View only" page reveals the markdown `#` prefix and shifts the heading by a few pixels. Cosmetic. CSS can't reach the SilverBullet internals that cause this without breaking other things.
- Same shift happens when you click inside a `${...}` query block on a view-only page (the live query briefly shows its source). Don't click on the heatmap.
- The `_assets/` convention is intermittently honoured — files dropped onto an evidence page land alongside the page itself rather than in `_assets/`. This is actually probably fine.

---

## Prerequisites

- [Docker](https://www.docker.com/)
- A modern browser

No Node, Python, or LaTeX installation needed — Docker handles all of it.

---

## Setup

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

To contribute a new framework or update an existing one, open an issue or PR on the registry repo. A framework bundle is just a YAML file describing the criteria, plus a small set of templates and a Path scaffold.

---

## Manual

The full manual is inside Path itself. Open the command palette and navigate to `manual/index`, or click the book icon in the toolbar. It's plain markdown so you can also read it on disk if Docker isn't running.

---

## Contributing

Issues and PRs welcome. The bus factor is one and the maintainer is also a full-time academic, so response times vary. Bug reports with reproduction steps and SilverBullet/Docker version info are particularly appreciated.

---

## Licence

MIT.
