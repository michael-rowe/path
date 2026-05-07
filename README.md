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

### Evidence logging
Log CPD activities as structured records — date, type, hours, standards addressed. Every activity is linked to the criteria it supports, so evidence is never lost in a folder.

### Guided reflection
Write structured reflections using established frameworks: Driscoll, ERA, Gibbs, or Rolfe. Reflections link back to the CPD entry they came from, building a coherent evidence chain.

### Claim writing
Write claims that argue, criterion by criterion, that a standard has been met. A claim is not a list of activities — it is a reasoned argument for an assessor, supported by your CPD and reflections. Each claim includes a structured **Quantified Impact** table (measure / before / after / source) so impact is concrete, not vague.

### Framework support
Install professional frameworks from the built-in registry. Frameworks install criteria pages, templates, and a coverage dashboard automatically. Currently available:

- **HCPC CPD** — for all HCPC-regulated Allied Health Professionals
- **AdvanceHE D4** — for Principal Fellowship (PFHEA) applicants
- More via the framework registry at [github.com/michael-rowe/path-frameworks](https://github.com/michael-rowe/path-frameworks)

### Coverage dashboards and gap analysis
Visual heatmaps show which criteria have claims, CPD, and reflections — and which are gaps. Clicking any gap takes you directly to that criterion's page. A 52-week activity calendar on the dashboard shows your CPD cadence at a glance.

### Network and credentials
Contacts (collaborators, mentors, peers) and credentials (Open Badges, fellowships, awards) are first-class pages. Wikilink to a person from any claim or reflection and they'll surface that link automatically on the contact's page — your network grows with your work, without separate CRM data entry.

### A focused writing surface
- **One Capture command** (Ctrl-Alt-c) routes you to the right template — CPD, reflection, claim, contact, credential, or quick capture.
- **Inspector panel** holds page metadata as form fields, so structured fields (status, claim type, framework) are dropdowns, not freeform text. Linked mentions surface backlinks live.
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
