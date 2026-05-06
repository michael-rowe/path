---
readonly: true
---

# Adding files and evidence

A CPD record without supporting evidence is just a story. Path lets you attach the certificates, programmes, photos, and documents that back up what you say.

## Three ways to add a file

### Drag and drop

Drag a file from your computer onto any open page. Path will:

1. Ask you what to call it
2. Save it into your Path workspace
3. Add either a link or an embed at the cursor position

### Copy and paste

Copy a file (or take a screenshot, or copy a photo from your phone gallery) and paste it onto a page. Same flow.

> **tip** This is the easiest way to add a CPD certificate from a course confirmation email — just paste the screenshot.

### Use the Upload command

Press `Ctrl-/` to open the command palette, then type **Upload**. Path will open a file picker. Useful on phones and tablets where drag-and-drop is awkward.

## Where files live

By default, files go into your workspace's root or alongside the page you uploaded them on. We recommend a single `evidence/` folder for everything:

```
evidence/
  2026-spinal-injury-conference-programme.pdf
  2026-pgcert-completion-certificate.pdf
  2026-module-evaluation-results.pdf
  2026-vc-teaching-award-letter.pdf
```

> **note** Naming files the same way you name pages (date + short description) keeps them findable.

## Linking to a file from a CPD entry

Inside a CPD entry, link the evidence:

```
[[evidence/2026-spinal-injury-conference-programme.pdf]]
```

Or embed it inline (PDFs render as a viewer, images as the image):

```
![[evidence/2026-conference-poster.jpg]]
```

## What to attach

Use this rough guide. Do not over-attach.

| Activity | Useful evidence |
|---|---|
| Course or workshop | Completion certificate; programme; your notes |
| Conference attendance | Programme; abstract of any talk you gave; photo of poster |
| Teaching | Module handbook; sample feedback (anonymised); peer observation report |
| Project | Project plan; final report; impact metric |
| Peer review | Confirmation of review; the editor's thank-you letter |
| Award or recognition | The award notification or certificate |
| Publication | DOI link is enough; you do not need to attach the PDF |

> **warning** Do not attach evidence containing identifiable patient or student data unless it is anonymised. This is a professional and legal requirement, not a Path convention.

## Mobile workflow

Path runs in a phone browser. Workflow for capturing evidence on the move:

1. Open Path in your phone browser
2. Open the relevant CPD entry (or create a new one)
3. Take a photo or take a screenshot
4. Paste the photo into the page

This is genuinely useful at conferences, in clinical settings, or wherever evidence appears in a moment.

## What to do next

- [[manual/glossary]] — quick reference for terms used across Path
