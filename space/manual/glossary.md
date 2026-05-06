---
readonly: true
---

# Glossary

Plain-language definitions for the terms Path uses.

## Editor

The main writing area in the centre of the window. All records are plain markdown files. See [[manual/interface]].

## Focus mode

A view where the Navigator and Inspector are both hidden, leaving only the Editor and the Toolbar. Toggle with `Ctrl-Alt-z` or the focus mode button in the Toolbar. See [[manual/interface]].

## Inspector

The right-hand panel. Shows three sections for the current page: a table of contents (*On this page*), an editable form for page metadata (*Page attributes*), and a list of pages that link here (*Linked mentions*). See [[manual/interface]].

## Navigator

The left-hand panel. Contains shortcuts for creating new records (Create section), links to browse pages (Browse section), and links to system pages (Workspace section). See [[manual/interface]].

## Toolbar

The row of icon buttons at the top of the window. Contains: Home, Profile, Open, Run command, Focus mode, Search, and Light/dark toggle. Always visible, including in focus mode. See [[manual/interface]].

## Capture

The act of making any new record in Path — a CPD entry, reflection, claim, or quick thought. The **Capture** menu (button on the home page, or `Ctrl-Alt-c`) is where every new record starts.

## CPD entry

A record of a single professional activity — a course, conference, project, piece of teaching, supervision session. The atomic unit of evidence. Stored in the `cpd/` folder.

## Claim

An argued statement, written for an assessor, that you meet a particular standard or criterion. A claim is built from several CPD entries that, taken together, make a case. Stored in the `claims/` folder.

## Criterion

A single standard within a framework. For example, *"1.1 Demonstrably effective individual teaching excellence"* is one of fourteen criteria in the UoL Professor framework. Stored in the `criteria/` folder, one note per criterion.

## Evidence

The supporting material — files, documents, certificates, photos — that backs up a CPD entry. Stored in the `evidence/` folder.

## Forward-looking claim

A specific kind of claim covering aspirations and future contributions, rather than past evidence. Some frameworks (including UoL Professor) require these. They use a different template — pick **Future-claim** in the Capture menu.

## Framework

The set of standards or criteria a goal is judged against. The UoL Professor framework has four pillars and fourteen criteria; the AdvanceHE PSF has descriptors at four levels; HCPC has five CPD standards. Each Path uses one framework.

## Path

A goal you are working towards — a promotion, a fellowship, a professional registration. Each Path uses one framework. You can have several Paths active at once. Stored in the `paths/` folder.

## Pillar

A grouping of related criteria within a framework. The UoL Professor framework has four: Teaching Excellence, Scholarship, Leadership, Citizenship. Not every framework uses pillars.

## Quick capture

A short, structured note recording a passing thought you want to come back to. Stored in the `captures/` folder. Has a `status` field (`unprocessed` / `processed`) to track whether you have done something with it.

## Reflection

A structured account of what you took from an experience. Path supports four reflection frameworks (Gibbs, ERA, Driscoll, Rolfe). Reflections are stored in the `reflections/` folder, separate from CPD entries.

## Tags

Words prefixed with `#`, used to group records loosely. For example, `#mentoring` or `#uol-professor`. Tasks tagged with a Path slug (e.g. `#uol-professor`) appear on that Path's landing page automatically.

## Task

A single action item, written as `- [ ] Do this thing`. Path indexes all tasks across your records and surfaces open ones on the home page and on Path landing pages.

## Wikilink

A clickable link to another record, written as `[[page-name]]`. Wikilinks build the network of connections that turns a collection of records into a portfolio. Following a wikilink takes you to the target; the target page shows you all the records that link to it.

## Page attributes

The structured fields at the top of every record (date, type, path, status, and so on). Path uses these to power queries and dashboards. The recommended way to edit them is via the **Inspector** (right-hand panel), which renders them as a form. The underlying YAML block in the editor is hidden by default.

> **note** Also called *YAML frontmatter*
> If you have used other tools or seen technical documentation, you may have heard this called "YAML frontmatter" or "frontmatter". They are the same thing.
