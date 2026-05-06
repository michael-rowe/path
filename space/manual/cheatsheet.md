---
readonly: true
---

# Quick reference

The most useful commands and shortcuts. Bookmark this page or click the **?** icon in the top bar to come back to it.

## Most useful commands

| Action | How |
|---|---|
| **Capture something new** | Click the *Capture* button on the home page, or press `Ctrl-Alt-c` |
| **Open the command palette** | `Ctrl-/` (then start typing) |
| **Open another page** | `Ctrl-K` (then start typing — fuzzy match) |
| **Go home** | Click the Home icon in the Toolbar |
| **Your profile** | Click the Profile icon in the Toolbar |
| **Full-text search** | Click the Search icon in the Toolbar, or `Ctrl-Shift-F` |
| **Toggle focus mode** | `Ctrl-Alt-z`, or click the Focus mode icon in the Toolbar |
| **Toggle light / dark** | Click the moon/sun icon in the Toolbar |
| **Open this page** | Click the **?** icon in the Toolbar |
| **Reload the system** | `Ctrl-Alt-r` (after changing styles or scripts) |

## Allowed `status` values

Each page type has its own set of valid `status` values. Anything else will be flagged as an error in the editor.

| Page type | Allowed `status` | Meaning |
|---|---|---|
| **Claim** | `draft` | Work in progress |
| **Claim** | `ready` | Finished and ready for export to a submission |
| **Claim** | `published` | Already submitted / shared with an assessor |
| **CPD entry** | `draft` | Captured but not fully written up |
| **CPD entry** | `complete` | Written up; evidence linked |
| **Capture** | `unprocessed` | Still to triage |
| **Capture** | `processed` | Turned into a CPD / claim / linked elsewhere |
| **Path** | `active` | Currently working towards |
| **Path** | `planned` | A goal you are not yet building towards |
| **Path** | `paused` | On hold |
| **Path** | `completed` | Already submitted, archived |
| **Personal statement** | `draft` | Not yet finished |
| **Personal statement** | `ready` | Finished — will be included in PDF exports for its Path |

> **tip** Use only these exact words
> Anything else (`done`, `complete` on a claim, `Done`, `DONE`, etc.) will not be recognised by Path's queries and dashboards. The editor will flag invalid values.

## Capture menu options

| Pick | When |
|---|---|
| **CPD activity** | You did a thing (course, conference, project, teaching) |
| **Reflection** | You want to think structurally about an experience |
| **Claim** | You are arguing you meet a particular criterion |
| **Future-claim** | Forward-looking aspirations for a pillar |
| **Quick capture** | A passing thought to come back to |
| **Path** | You are setting up a new goal |

## Formatting cheatsheet

```
**bold**           *italic*           ~~strikethrough~~
[[wikilink]]       #hashtag           - [ ] task

> **note** Title      > **tip** Title       > **warning** Title
> Body text.          > Body text.          > Body text.

> **danger** Title    > **success** Title
> Body text.          > Body text.

| Column 1 | Column 2 |
|---|---|
| value | value |

![[evidence/file.pdf]]    ← embed a PDF or image
[[evidence/file.pdf]]     ← link to a file
```

See [[manual/formatting]] for the full guide.

## Manual — full table of contents

### Read in order
- [[manual/index]] — entry point
- [[manual/getting-started]] — your first ten minutes
- [[manual/interface]] — the Navigator, Inspector, Editor, and Toolbar
- [[manual/capturing]] — what to record, what kind of record
- [[manual/reflecting]] — choosing a reflection framework
- [[manual/claims]] — turning evidence into an argument
- [[manual/paths]] — working towards more than one goal
- [[manual/naming]] — keeping records findable

### Look up when needed
- [[manual/formatting]] — admonitions, tables, tasks, wikilinks
- [[manual/files-and-evidence]] — adding PDFs, certificates, photos
- [[manual/glossary]] — plain-language definitions
- [[manual/cheatsheet]] — this page

## When something goes wrong

> **tip** Reload first
> If a command does not appear, or styles look off, run `Ctrl-Alt-r` (System: Reload). This rebuilds the index and re-runs all your scripts.

> **note** Where do my files live?
> Everything is markdown files inside the `space/` folder on disk. You can open them in any text editor. Path is just a nicer way to read and edit them.

> **warning** Page names cannot contain certain characters
> Use hyphens between words, not spaces. Lowercase. No special characters except hyphens and forward slashes (which create folders).
