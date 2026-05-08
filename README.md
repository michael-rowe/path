# Path

A local-first portfolio system for regulated professionals — built on top of [SilverBullet](https://silverbullet.md). Path turns SilverBullet into a structured workspace for logging activities, writing reflections, arguing claims against professional standards, and exporting a submission-ready document. Runs in Docker on your own machine; no accounts, no cloud sync, no subscription.

It's aimed at:

- Allied Health Professionals preparing HCPC revalidation
- Academics and educators applying for AdvanceHE Fellowship (Senior or Principal)
- Anyone working toward a structured professional recognition that requires evidence, reflection, and argued claims against published criteria

---

## ⚠️ Heads up

I'm not a developer. I'm a clinician/academic who built this because nothing else fit how I wanted to work, and I'm sharing it in case someone else finds it useful. A few things that follow from that:

- **It is not a product.** It is a personal project, made public.
- **There is no support.** I cannot answer "why does this not work on my machine" with any authority — I will probably just shrug and ask Claude.
- **There is no roadmap.** Things change when I'm working on my own portfolio and notice they're annoying.
- **There may be bugs I haven't seen.** I use exactly one configuration; yours will inevitably differ.
- **The bus factor is one.** And the one is not a software engineer. *(You are correct to be cautious.)*

If you're after something polished, supported, and feature-complete, this isn't it. If you're happy to tinker, read markdown, and accept that the maintainer is figuring it out alongside you, you're in the right place.

---

## Some context

Two terms appear all over Path; here's what they mean.

**A Path** is a goal you're working towards: a promotion, a fellowship, a professional registration cycle. Each Path is an instance of pursuing recognition under one **framework**. You can have several Paths active at once — for example, an AdvanceHE Principal Fellowship alongside an HCPC revalidation cycle — and the same activity can count towards more than one of them.

**A framework** is the externally-defined set of standards a Path is judged against. The HCPC publishes five CPD standards; AdvanceHE publishes four descriptors with criteria; the University of Lincoln publishes its TSPP criteria. Path doesn't author these — it ships a small registry of frameworks encoded as YAML and markdown templates, and you install whichever ones apply to you.

Everything else in Path — activities, reflections, claims, evidence — is connected to one or more Paths and tagged against the criteria of those Paths' frameworks.

---

## Features

### Page types

Every piece of content is a structured markdown page with YAML frontmatter:

- **Path** — a goal you're working towards. Has a status (active / planned / paused / completed / abandoned), a target date, and a framework.
- **Framework + Criteria** — installed from a registry. Currently HCPC CPD, AdvanceHE D4 (Principal Fellow), AdvanceHE D3 (Senior Fellow stub), UoL TSPP.
- **CPD activity** — a logged activity (course, conference, project, teaching). Tagged with one or more Paths and the criteria it addresses.
- **Reflection** — a structured reflection using Driscoll, ERA, Gibbs, or Rolfe. Linked back to the activity.
- **Claim** — a written argument that one criterion has been met, supported by CPD entries and reflections. Includes a Quantified Impact table for measurable outcomes.
- **Evidence** — a separate page for an artefact (PDF, certificate, feedback letter) when the activity record alone doesn't capture it.
- **Contact** and **Credential** — network and award records, queryable across Paths.
- **Task** — a checkbox item scoped to a Path, surfaced on the dashboard and the Path landing page.
- **Personal statement** — narrative introduction for a Path; embedded into the export.

### Workflow

A single **Capture** button opens a picker that routes to the right template. Active Path is detected automatically; with two or more, you're asked which Path the new entry is for. Frameworks then drive the rest — for example, a new claim's `framework` field auto-fills based on the chosen Path, and the Inspector's `standards` field becomes a checkbox list of that framework's criteria rather than free-text.

When a goal is achieved (or abandoned), `Path: Archive this Path` flips its status without removing any links from your historical CPD or claims.

### Dashboards and queries

- A coverage **heatmap** per Path shows claims, CPD, reflections, and evidence per criterion at a glance.
- A **gap list** highlights criteria without a claim, CPD entry, or reflection.
- A **CPD activity grid** (current month on the dashboard, full year on each Path).
- An **Active Paths** table summarises every running Path with its framework, criteria-covered ratio, claims-ready count, and target date.
- **Open tasks** roll up across all Paths with a chip showing scope.

Queries use SilverBullet's Lua-based query language and re-evaluate live as you add content.

### Export

Optional Pandoc + XeLaTeX sidecar runs as a separate Docker container. Compiles a chosen subset of pages — personal statement, claims, supporting evidence — into a PDF or Word document with a cover page populated from your profile. Excluded by default to keep the install small (~150 MB without, ~500 MB with).

### Editor surface

Path is a SilverBullet plug, not a fork. The editor is SilverBullet — wikilinks, transclusion, full-text search. Path adds:

- A branded left-hand **Navigator** with browse links per page type.
- A right-hand **Inspector** for editable YAML frontmatter (dropdowns where there are enums, multi-select checkboxes for `paths` and `standards`, a Linked Mentions section, a Delete-page button).
- A "View only" badge on system pages so you don't accidentally edit the dashboard.
- Light/dark themes that persist.
- A **Focus mode** that hides both panels.

### Data ownership

Everything lives in `space/` as plain markdown. If you stop using Path, the files are still readable in any text editor. Nothing is sent off your machine.

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

The full manual is inside Path itself. Open the command palette and navigate to `manual/index`, or click the book icon in the toolbar. It's plain markdown, so you can also read it on disk if Docker isn't running.

---

## Contributing

Contributions would genuinely be cool. Fair warning though: I've never reviewed a pull request in my life, and the words "rebase" and "squash" mean roughly nothing to me. I'll figure it out — slowly, badly, possibly with help — but expect turnaround to be measured in days, not minutes.

Issues are easier and very welcome. Bug reports with reproduction steps and your SilverBullet / Docker versions are particularly useful. Feature requests are also welcome but unlikely to be acted on quickly unless they overlap with what I happen to need next.

---

## Licence

MIT — same as [SilverBullet](https://silverbullet.md), which Path is built on.

In practical terms, MIT means: anyone can use, copy, modify, distribute, or sell Path, as long as they keep the copyright notice. There's no warranty, and I'm not liable if it breaks anything for you. For me, it means I retain copyright on what I've written but I've explicitly given everyone permission to use it however they like — including forking it, taking the parts they want, and never speaking of me again. That's the deal: take it as-is, do what you want with it, don't expect me to fix it.
