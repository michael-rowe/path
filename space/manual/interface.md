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
| **Search** | `Ctrl-Shift-F` | Full-text search across all records |
| **Light / dark** | — | Toggle between light and dark mode |

## Navigator

The Navigator is the left-hand panel. It stays open unless you're in focus mode.

It has three sections:

**Capture** — a single **+ Capture** button at the top. Click it (or press `Ctrl-Alt-c`) to open the Capture menu, which routes you to the right template for whatever you want to record. See [[manual/capturing]] for the full list of options.

**Browse** — links to the main browse pages: All Paths, Claims, CPD activities, Reflections, Evidence, Network, Credentials, Captures, Tasks, All pages.

**Workspace** — system pages: Setup, Announcements (with an unread badge when there's news), History, Manual, Add framework. Framework updates are now surfaced as announcements when a new version ships.

## Inspector

The Inspector is the right-hand panel. It shows three collapsible sections for the page you are currently viewing:

**On this page** — a table of contents built from the headings in the current page. Click any heading to jump directly to it.

**Page attributes** — the structured fields from the page's YAML frontmatter, rendered as an editable form. Change a value and click **Save** to write it back to the file. Fields with a fixed set of valid options (status, claim type, activity type, file type, framework, and others) appear as dropdowns. Multi-value fields like `paths` and `standards` appear as checkbox lists driven by your installed Paths and the relevant framework's criteria.

**Linked mentions** — every page in Path that links to the current one. Click any result to navigate there. This is how you trace the connections between a CPD entry, its reflections, and the claims that cite it.

At the bottom of the Inspector, a **Delete this page** button removes the current page (after a typed "DELETE" confirmation). The button is hidden on view-only pages.

> **note** The YAML block in the editor body is hidden by default. The Inspector is the intended editing surface for page metadata.

## Focus mode

Focus mode hides both the Navigator and Inspector so the Editor fills the full window. Toggle it with `Ctrl-Alt-z` or the focus mode button in the Toolbar. The Toolbar itself stays visible so you can still navigate away or restore the panels.

## What to do next

- [[manual/cheatsheet]] — the full keyboard-shortcut and command reference
