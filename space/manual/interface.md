---
readonly: true
---

# The Path interface

Path has four areas: the **Navigator** on the left, the **Editor** in the centre, the **Inspector** on the right, and the **Toolbar** across the top.

## Navigator

The Navigator is the left-hand panel. It stays open unless you are in focus mode.

It has three sections:

**Create** — shortcuts for starting a new record:

| Link | What it makes |
|---|---|
| New CPD activity | A record of a professional activity |
| New claim | An argued statement that you meet a criterion |
| New future-claim | Forward-looking aspirations for a pillar |
| New reflection | A structured reflection on an experience |
| New contact | A person in your professional network |
| New credential | An award, badge, or fellowship |
| Quick capture | A passing thought to come back to |

**Browse** — links to the main browse pages: All Paths, Claims, CPD activities, Reflections, Network, Credentials, Captures, Tasks, All pages.

**Workspace** — system pages: Getting started, History, Manual, Add framework, Check updates, Export to PDF, Export to Word.

## Inspector

The Inspector is the right-hand panel. It shows three collapsible sections for the page you are currently viewing:

**On this page** — a table of contents built from the headings in the current page. Click any heading to jump directly to it.

**Page attributes** — the structured fields from the page's YAML frontmatter, rendered as an editable form. Change a value and click **Save** to write it back to the file. Fields with a fixed set of valid options (status, claim type, activity type, and others) are shown as dropdowns.

**Linked mentions** — every page in Path that links to the current one. Click any result to navigate there. This is how you trace the connections between a CPD entry, its reflections, and the claims that cite it.

> **note** The YAML block in the editor body is hidden by default. The Inspector is the intended editing surface for page metadata.

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

## Editor

The Editor is the main writing area in the centre of the window. All records are plain markdown. The YAML frontmatter block at the top of each file is hidden in the editor view — use the Inspector to edit it.

> **tip** Keyboard shortcut summary
> See [[manual/cheatsheet]] for the full list of shortcuts and commands.

## Focus mode

Focus mode hides both the Navigator and Inspector so the Editor fills the full window. Toggle it with `Ctrl-Alt-z` or the focus mode button in the Toolbar. The Toolbar itself stays visible so you can still navigate away or restore the panels.
