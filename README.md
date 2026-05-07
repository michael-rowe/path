# Path

A local-first portfolio system for regulated professionals — built on top of [SilverBullet](https://silverbullet.md). Logs activities, holds reflections, lets you argue claims against framework criteria, and exports a submission. Runs in Docker on your own machine.

---

## ⚠️ Warning

This is not for everyone. Plausible reasons not to use Path include:

- You don't have a portfolio to build.
- You already have a portfolio system that works for you.
- You believe contemplating your professional development this much is bad for you.
- You are a regulator. We will figure out where you live.
- You are hoping for a polished, finished product.
- You are sensitive to indigo.
- The heat death of the universe occurs before you finish your portfolio. (Conditional on Path's bug rate, this is non-trivial.)
- You distrust software written by one person on weekends. *(You are correct to do this.)*

---

## What it does

Path is mostly a set of opinions about how a portfolio should be structured, expressed as templates, queries, and a small SilverBullet plug:

- Activities, reflections, claims, evidence, contacts, credentials, and tasks as page types.
- A coverage heatmap per framework (UoL TSPP, AdvanceHE D4, HCPC CPD; more via the registry).
- Path-scoped queries — open tasks by Path, evidence by criterion, etc.
- An editable Inspector panel with checkbox lists for the multi-value fields.
- PDF/Word export via a Pandoc/XeLaTeX sidecar (optional; adds ~350 MB).
- A "View only" badge on system pages so you don't break them. Mostly.

A few things are pretty. Most things work. Some things shift on click for reasons too tedious to explain.

---

## Prerequisites

- [Docker](https://www.docker.com/)
- A browser

No Node, Python, or LaTeX installation needed — Docker handles all of it.

---

## Setup

```bash
git clone https://github.com/michael-rowe/path.git
cd path
cp .env.example .env
# Edit .env and set SB_USER to something like admin:your-password
```

Then either:

```bash
docker compose up -d                          # ~150 MB, no PDF export
docker compose --profile export up -d         # ~500 MB, PDF/Word export included
```

Open http://localhost:3000, log in with whatever you put in `.env`, and follow the **Getting started** page.

---

## Updating

```bash
git pull
docker compose pull silverbullet
docker compose up -d
```

Your content (`space/claims/`, `space/cpd/`, etc.) is gitignored so updates don't touch it.

---

## Backing up

`cp -r space/ /somewhere/safe/`. It's all plain markdown.

---

## Frameworks

Frameworks are installed at runtime from a separate registry — see [github.com/michael-rowe/path-frameworks](https://github.com/michael-rowe/path-frameworks). Inside Path, run **Path: Add framework** from the command palette.

If your framework isn't there, open an issue or PR on the registry repo.

---

## Manual

Inside Path, open the command palette and navigate to `manual/index`. Or click the book icon in the toolbar. The manual is the same markdown as everything else, so you can read it on disk if Docker won't start.

---

## Contributing

Issues and PRs welcome. The bus factor is one, so be patient with response times.

---

## Licence

MIT. Use it, fork it, sell it, throw it in a fire.
