---
readonly: true
---

# Glossary

Plain-language definitions for the terms Path uses, in alphabetical order.

## Capture

The act of making any new record in Path. The **+ Capture** button in the Navigator (or `Ctrl-Alt-c`) opens a picker covering every record type — CPD activity, reflection, claim, future-claim, evidence, task, quick capture, contact, credential, Path, personal statement.

## Claim

An argued statement, written for an assessor, that you meet a particular standard or criterion. A claim is built from several CPD entries that, taken together, make a case. Stored in the `claims/` folder.

## CPD entry

A record of a single professional activity — a course, conference, project, piece of teaching, supervision session. The atomic unit of evidence. Stored in the `cpd/` folder.

## Criterion

A single standard within a framework. For example, *"1.1 Demonstrably effective individual teaching excellence"* is one of fourteen criteria in the UoL Professor framework. Stored in the `criteria/` folder, one note per criterion.

## Editor

The main writing area in the centre of the window. All records are plain markdown files. See [[manual/interface]].

## Evidence

A tangible artefact (PDF, certificate, feedback letter, screenshot) that supports a CPD entry or claim. Path has an Evidence page type with structured metadata (date, source, file type, related CPD/claims) plus the file itself stored alongside the page on disk in `evidence/`. Most CPD entries don't need a separate Evidence page — the activity record itself is the evidence. Create an Evidence page only when a tangible artefact materially strengthens a claim.

## Focus mode

A view where the Navigator and Inspector are both hidden, leaving only the Editor and the Toolbar. Toggle with `Ctrl-Alt-z` or the focus mode button in the Toolbar. See [[manual/interface]].

## Forward-looking claim

A specific kind of claim covering aspirations and future contributions, rather than past evidence. Some frameworks (including UoL Professor) require these. They use a different template — pick **Future-claim** in the Capture menu.

## Framework

The set of standards or criteria a goal is judged against. The UoL Professor framework has four pillars and fourteen criteria; the AdvanceHE PSF has descriptors at four levels; HCPC has five CPD standards. Each Path uses one framework.

## Inspector

The right-hand panel. Shows three sections for the current page: a table of contents (*On this page*), an editable form for page metadata (*Page attributes*), and a list of pages that link here (*Linked mentions*). See [[manual/interface]].

## Navigator

The left-hand panel. Contains a single **+ Capture** button at the top, links to browse pages (Browse section), and links to system pages (Workspace section). See [[manual/interface]].

## Page attributes

The structured fields at the top of every record (date, type, path, status, and so on). Path uses these to power queries and dashboards. The recommended way to edit them is via the **Inspector** (right-hand panel), which renders them as a form. The underlying YAML block in the editor is hidden by default.

> **note** Also called *YAML frontmatter*. If you've used other tools or seen technical documentation, you may have heard this called "YAML frontmatter" or "frontmatter". They are the same thing.

## Path

A goal you are working towards — a promotion, a fellowship, a professional registration. Each Path uses one framework. You can have several Paths active at once. Stored in the `paths/` folder.

## Pillar

A grouping of related criteria within a framework. The UoL Professor framework has four: Teaching Excellence, Scholarship, Leadership, Citizenship. Not every framework uses pillars.

## Quick capture

A short, structured note recording a passing thought you want to come back to. Stored in the `captures/` folder. Has a `status` field (`unprocessed` / `processed`) to track whether you have done something with it.

## Reflection

A structured account of what you took from an experience. Path supports four reflection frameworks (Gibbs, ERA, Driscoll, Rolfe). Reflections are stored in the `reflections/` folder, separate from CPD entries.

## Tags

Words prefixed with `#`, used to group records loosely. For example, `#mentoring` or `#uol-professor`.

## Task

A to-do item scoped to a Path. Use **+ Capture → Task**: you'll be prompted for the description and (if you have more than one active Path) which Path to attach it to. Tasks live on the Path landing page as native markdown checkboxes; the dashboard rolls open tasks up across every Path with a chip showing scope. **Path: Clean up done tasks** moves completed (`- [x]`) tasks to a system archive page.

## Toolbar

The row of icon buttons at the top of the window. Contains: Home, Profile, Open, Run command, Focus mode, Search, and Light/dark toggle. Always visible, including in focus mode. See [[manual/interface]].

## Wikilink

A clickable link to another record, written as `[[page-name]]`. Wikilinks build the network of connections that turns a collection of records into a portfolio. Following a wikilink takes you to the target; the target page shows you all the records that link to it.
