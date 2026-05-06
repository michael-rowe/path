# Path

A self-contained CPD and portfolio system for regulated professionals. Log evidence, write reflections, argue claims against standards, and export a submission-ready PDF or Word document — all from a local web app that runs in Docker.

Built for UK Allied Health Professionals (HCPC revalidation), AdvanceHE Fellowship applicants, and anyone working toward a structured professional recognition.

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

Path will open to the **Getting started** page on first run. Work through the six steps there: fill in your profile, install a framework, and start logging evidence.

---

## Your data

Everything you add to Path lives in the `space/` folder on your machine. Nothing is sent anywhere — no accounts, no cloud sync, no telemetry.

The content folders (`claims/`, `cpd/`, `reflections/`, etc.) are excluded from git, so your portfolio data never ends up in version control. The `exports/` folder (compiled PDFs and Word documents) is also excluded.

If you want to back up your portfolio, copy the `space/` folder somewhere safe.

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

Your content in `space/claims/`, `space/cpd/`, etc. is unaffected by updates — it is gitignored and not managed by docker compose.

---

## Frameworks

Frameworks (HCPC CPD, AdvanceHE D4, etc.) are installed from inside Path, not from this repo. After first run, open the command palette (**Ctrl-/** on Windows/Linux, **Cmd-/** on Mac) and run **Path: Add framework**.

The framework registry lives at [github.com/michael-rowe/path-frameworks](https://github.com/michael-rowe/path-frameworks). To contribute a framework, open an issue or pull request there.

---

## Export

PDF and Word export is handled by a sidecar container (`pandoc-svc`) that runs Pandoc with XeLaTeX. It is optional — start with `--profile export` if you need it.

Exported files land in the `exports/` folder next to `docker-compose.yml`.

---

## Manual

The full manual is inside Path at **manual/index** (click the book icon in the toolbar, or open the command palette and navigate there). It covers every feature in plain language, with no assumed knowledge of Docker, markdown, or SilverBullet.

---

## Licence

MIT
