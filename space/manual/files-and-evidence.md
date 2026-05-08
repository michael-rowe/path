---
readonly: true
---

# Adding files and evidence

A CPD record without supporting evidence is just a story. Path lets you attach the certificates, programmes, photos, and documents that back up what you say.

## Two ways to record evidence

### The CPD entry is itself the evidence

Most of the time, the activity record is enough. A logged conference attendance with date, scope, and what you took from it is an evidence record. You don't need a separate file to say *"yes, this happened"*. Don't over-attach.

### A separate Evidence page (when there's a tangible artefact)

When there *is* an artefact — a certificate of attendance, a feedback letter, a published article PDF, a screenshot of impact data — create an **Evidence** page (Capture → Evidence). The page holds the metadata (date, source, file type, what it evidences) and the file lives next to the page on disk.

Evidence pages link back to the CPD entries and claims they support. The dashboard heatmap shows an Evidence column counting evidence per criterion.

## Three ways to add a file

### Drag and drop

Drag a file from your computer onto any open page. Path will save the file alongside the page on disk and insert a markdown link at the cursor position.

### Copy and paste

Copy a file (or take a screenshot, or copy a photo from your phone gallery) and paste it onto a page. Same flow.

> **tip** This is the easiest way to add a CPD certificate from a course confirmation email — just paste the screenshot.

### Use the Upload command

Press `Ctrl-/` to open the command palette, then type **Upload**. Path will open a file picker. Useful on phones and tablets where drag-and-drop is awkward.

## Where files live

Files dropped onto a page are saved next to that page. So a file dropped onto an evidence page in `evidence/2026-foo` lands in `space/evidence/` alongside `2026-foo.md`. This co-locates the artefact with the metadata page that describes it — easy to back up, move, or delete as a unit.

> **note** Naming files the same way you name pages (date + short description) keeps them findable.

## Linking to a file from a CPD entry

Inside a CPD entry, link the evidence page (preferred) or the file directly:

```
[[evidence/2026-spinal-injury-conference-programme]]
```

Or embed inline (PDFs render as a viewer, images as the image):

```
![[evidence/2026-conference-poster.jpg]]
```

## What to attach

Use this rough guide. Don't over-attach.

| Activity | Useful evidence |
|---|---|
| Course or workshop | Completion certificate; programme; your notes |
| Conference attendance | Programme; abstract of any talk you gave; photo of poster |
| Teaching | Module handbook; sample feedback (anonymised); peer observation report |
| Project | Project plan; final report; impact metric |
| Peer review | Confirmation of review; the editor's thank-you letter |
| Award or recognition | The award notification or certificate |
| Publication | DOI link is enough; you don't need to attach the PDF |

> **warning** Don't attach evidence containing identifiable patient or student data unless it is anonymised. This is a professional and legal requirement, not a Path convention.

## Mobile workflow

Path runs in a phone browser. Workflow for capturing evidence on the move:

1. Open Path in your phone browser
2. Open the relevant CPD entry (or create a new one)
3. Take a photo or take a screenshot
4. Paste the photo into the page

This is genuinely useful at conferences, in clinical settings, or wherever evidence appears in a moment.

## What to do next

- [[manual/glossary]] — quick reference for terms used across Path
