# Path

**A local-first portfolio system for regulated professionals.**

Path helps you log evidence, write reflections, argue claims against professional standards, and export a submission-ready document — all from a private web app that runs on your own machine. No accounts. No cloud. No subscription.

---

## Who it's for

- **Allied Health Professionals** preparing HCPC revalidation (physiotherapists, occupational therapists, speech and language therapists, and other regulated professions)
- **Academics and educators** applying for AdvanceHE Fellowship (Principal Fellow PFHEA, Senior Fellow SFHEA)
- **Anyone** working toward a structured professional recognition that requires evidence, reflection, and argued claims

---

## What it does

### Activity logging
Log CPD activities as structured records — date, type, hours, standards addressed. Every activity is linked to the criteria it supports, so evidence is never lost in a folder.

### Guided reflection
Write structured reflections using established frameworks: Driscoll, ERA, Gibbs, or Rolfe. Reflections link back to the CPD entry they came from, building a coherent evidence chain.

### Claim writing
Write claims that argue, criterion by criterion, that a standard has been met. A claim is not a list of activities — it is a reasoned argument for an assessor, supported by your CPD and reflections. Each claim includes a structured **Quantified Impact** table (measure / before / after / source) so impact is concrete, not vague.

### Evidence as a first-class page type
Drag a PDF, certificate, or screenshot onto an evidence page and it's stored next to the page on disk. Evidence pages link back to the CPD entries and claims they support; the dashboard's coverage heatmap shows which criteria have evidence at a glance. Most CPD activities don't need a separate evidence page — the activity record is itself the evidence — but when a tangible artefact (feedback letter, published article, certificate of attendance) materially strengthens a claim, log it here.

### Framework support
Install professional frameworks from the built-in registry. Frameworks install criteria pages, templates, and a coverage dashboard automatically. Currently available:

- **HCPC CPD** — for all HCPC-regulated Allied Health Professionals
- **AdvanceHE D4** — for Principal Fellowship (PFHEA) applicants
- More via the framework registry at [github.com/michael-rowe/path-frameworks](https://github.com/michael-rowe/path-frameworks)

### Multi-Path workflow
Pursue multiple recognition routes in parallel — UoL promotion alongside an AdvanceHE Fellowship, or HCPC revalidation alongside a new Senior Fellowship application. Activities, reflections, and evidence can be tagged to several Paths at once (the same conference attendance may legitimately count for both). Claims stay singular per Path because each is an argument written for one framework's language. When you achieve a goal — or step away from one — **Path: Archive this Path** flips the Path's status while preserving every link from your historical work.

### Coverage dashboards and gap analysis
Visual heatmaps show which criteria have claims, CPD, reflections, and evidence — and which are gaps. Clicking any gap takes you directly to that criterion's page. A current-month CPD activity grid on the dashboard, plus a 52-week year view on each Path landing page, shows your CPD cadence at a glance.

### Tasks scoped to Paths
Tasks aren't generic to-dos — they belong to a specific Path. **+ Capture → Task** prompts for a description, picks a Path, and the task lives on that Path's landing page. The dashboard rolls up open tasks across every Path with a chip showing where each one belongs. **Path: Clean up done tasks** archives completed items to a system page so the working list stays sharp.

### Network and credentials
Contacts (collaborators, mentors, peers) and credentials (Open Badges, fellowships, awards) are first-class pages. Wikilink to a person from any claim or reflection and they'll surface that link automatically on the contact's page — your network grows with your work, without separate CRM data entry.

### A focused writing surface
- **One Capture button** in the navigator opens a picker (Ctrl-Alt-c) that routes you to the right template — activity, reflection, claim, evidence, task, contact, credential, quick thought, or a new Path.
- **Inspector panel** holds page metadata as form fields. Structured fields (status, claim type, framework) are dropdowns; multi-value fields (paths, standards) are checkbox lists driven by your installed Paths and the relevant framework's criteria. Linked mentions surface backlinks live.
- **Focus mode** (Ctrl-Alt-z) hides both side panels for distraction-free reading.
- **System pages are view-only** — the dashboard, browse pages, and manual carry a "View only" badge so they can't be edited by accident.
- **Light and dark themes** persist across sessions.

### Export
Compile your portfolio to a submission-ready PDF or Word document with a single command. The export includes a cover page, your claims, and supporting evidence — formatted for assessors.

> Export is optional. The base install (~150 MB) runs without it. Add `--profile export` to include the PDF/Word sidecar (~500 MB total).

### Your data stays yours
Everything lives in the `space/` folder on your machine as plain markdown files with YAML frontmatter. If you stop using Path, your data is still readable in any text editor. Nothing is sent anywhere.

---

## Screenshots

*Coming soon.*

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Mac, Windows, or Linux)
- A modern browser

No other dependencies. You do not need Node, Python, or LaTeX installed on your machine.

---

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/michael-rowe/path.git
cd path

# 2. Set your login credentials
cp .env.example .env
# Open .env and change SB_USER to something like: admin:your-strong-password
```

---

## First run

**Base install** (portfolio + framework support, no PDF export, ~150 MB download):

```bash
docker compose up -d
```

**With PDF and Word export** (~500 MB download — includes XeLaTeX via TinyTeX):

```bash
docker compose --profile export up -d
```

Open [http://localhost:3000](http://localhost:3000) and log in. The username and password are whatever you put in the `.env` file — if you set `SB_USER=admin:mypassword`, the username is `admin` and the password is `mypassword`.

Path will open to the **Getting started** page. Work through the steps there: fill in your profile, install a framework, and start logging evidence.

---

## Updating Path

To pull the latest system files (templates, plug, config) without touching your content:

```bash
git pull
docker compose pull silverbullet
docker compose up -d
```

If you are running the export profile:

```bash
docker compose --profile export up -d --build pandoc-svc
```

Your portfolio content in `space/claims/`, `space/cpd/`, etc. is never affected by updates — it is excluded from git and not managed by Docker.

---

## Backing up your portfolio

Copy the `space/` folder somewhere safe. That's it — all your evidence, reflections, claims, and profile are plain text files in that folder.

---

## Frameworks

Frameworks are installed from inside Path. After first run, open the command palette (**Ctrl-/** on Windows/Linux, **Cmd-/** on Mac) and run **Path: Add framework**.

The framework registry lives at [github.com/michael-rowe/path-frameworks](https://github.com/michael-rowe/path-frameworks). To contribute a framework, open an issue or pull request there.

---

## Export

PDF and Word export is handled by a sidecar container (`pandoc-svc`) that runs Pandoc with XeLaTeX. Start with `--profile export` to enable it. Exported files land in the `exports/` folder next to `docker-compose.yml`.

---

## Manual

The full manual is inside Path. Open the command palette and navigate to **manual/index**, or click the book icon in the toolbar.

---

## Licence

MIT
