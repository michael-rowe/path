---
readonly: true
---

# The Path interface

Path has four areas: the **Editor** in the centre where you write, the **Navigator** on the left, the **Inspector** on the right, and the **Toolbar** across the top. Pressing `Ctrl-Alt-z` toggles **focus mode**, which hides both side panels.

## Editor

The Editor is the main writing area in the centre of the window. All records are plain markdown. The YAML frontmatter block at the top of each file is hidden in the editor view — use the Inspector to edit those fields.

> **tip** Most of your time in Path is spent in the Editor. Everything else is in service of the writing.

## Toolbar

The Toolbar runs across the top of the window. It stays visible even in focus mode.

From left to right:

| Button | Keyboard | What it does |
|---|---|---|
| **Home** | — | Go to the home page (dashboard) |
| **Profile** | — | Go to your profile page |
| **Open** | `Ctrl-K` | Open any page by name (fuzzy search) |
| **Run command** | `Ctrl-/` | Open the command palette |
| **Focus mode** | `Ctrl-Alt-z` | Hide or restore the Navigator and Inspector |
| **Light / dark** | — | Toggle between light and dark mode |

## Navigator

The Navigator is the left-hand panel. It stays open unless you're in focus mode.

It has three sections:

**Capture** — a single **+ Capture** button at the top. Click it (or press `Ctrl-Alt-c`) to open the Capture menu, which routes you to the right template for whatever you want to record. See [[manual/capturing]] for the full list of options.

**Browse** — links to the main browse pages: All Paths, Claims, CPD activities, Reflections, Evidence, Network, Credentials, Captures, Tasks, All pages.

**Workspace** — system pages: **Setup** (shown until you've completed onboarding, then hidden), **Announcements** (with an unread badge when there's news), and **Recent** (your recently edited pages).

## Adding and updating frameworks

Installing and updating frameworks is done from the command palette rather than a panel button — it's something you do once when you start a new goal, not day to day. Open the command palette (`Ctrl-/`, or `Cmd-/` on Mac) and run:

- **Path: Add framework** — fetches the list of available frameworks (HCPC CPD, AdvanceHE D4, and others as they're published) and installs the one you choose. This is also Step 2 of [[Setup]].
- **Path: Check framework updates** — checks your installed frameworks against the registry and pulls down any newer versions.

When a new version of a framework you've installed ships, it's also flagged in **Announcements**, which links you to the update command.

## Inspector

The Inspector is the right-hand panel. It features a pinned **search bar** at the top and three functional tabs:

### Pinned Search
A high-performance, full-text search powered by Meilisearch. Press `Ctrl-Shift-f` from anywhere to focus the search box. Results appear as you type; click any result to navigate there. The search indexes your content and all YAML attributes (tags, status, framework), making it the fastest way to find records.

### Page Tab
Contains the structural and metadata elements for the current page:

**On this page** — a table of contents built from the headings in the current page. Click any heading to jump directly to it.

**Page attributes** — the structured fields from the page's YAML frontmatter, rendered as an editable form. Change a value and click **Save** to write it back to the file. Fields with a fixed set of valid options appear as dropdowns. Multi-value fields like `paths` and `standards` appear as checkbox lists driven by your installed Paths.

**Linked mentions** — every page in Path that links to the current one. This is how you trace the connections between a CPD entry, its reflections, and the claims that cite it.

### Tools Tab
Utility features for the current page:

**Writing quality** — an integrated grammar and style checker powered by LanguageTool. Click **Check grammar & style** to analyze the current page. Issues are highlighted with context and suggested fixes.

**Link checker** — a high-performance broken link checker powered by Lychee. Click **Check broken links** to verify all internal and external references in the page.

**Delete this page** — permanently remove the current record (requires typing DELETE to confirm). The button is hidden on view-only pages.

### History Tab
The Path **Time Machine**. Shows a list of automated snapshots taken every 30 minutes. Click any snapshot to preview the previous version, and use the **Restore** button to roll back changes.

> **note** The YAML block in the editor body is hidden by default. The Inspector is the intended editing surface for page metadata.

## Focus mode

Focus mode hides both the Navigator and Inspector so the Editor fills the full window. Toggle it with `Ctrl-Alt-z` or the focus mode button in the Toolbar. The Toolbar itself stays visible so you can still navigate away or restore the panels.

## What to do next

- [[manual/cheatsheet]] — the full keyboard-shortcut and command reference
