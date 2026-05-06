---
readonly: true
---

# Naming your records

Records you cannot find later are records you did not make. Path uses a small set of naming conventions that keep things findable.

> **tip** You will see a suggested page name pre-filled when you create a record. Just replace `short-description` with a few words about what the record is about. Keep it short.

## The shape of a name

Most records have a **date** and a **short description**, joined by hyphens, no spaces, all lowercase:

```
cpd/2026-05-03-spinal-injury-conference-london
reflections/2026-05-03-gibbs-attendance-pattern-AHP12345
captures/2026-05-03-noticed-disengagement-pattern
```

The date goes first because it makes records sort chronologically when you list them.

> **note** You do not need to use the *exact* day. The day you write the record is fine, even if the activity was the week before.

## Different folders, different shapes

| Folder | Shape | Example |
|---|---|---|
| `cpd/` | `YYYY-MM-DD-short-description` | `cpd/2026-05-03-pgcert-module-redesign` |
| `reflections/` | `YYYY-MM-DD-framework-short-description` | `reflections/2026-05-03-rolfe-mentoring-decision` |
| `captures/` | `YYYY-MM-DD-short-description` | `captures/2026-05-03-noticed-cohort-disengagement` |
| `claims/` | `criterion-code-short-name` | `claims/1.1-individual-teaching-excellence` |
| `paths/` | `goal-slug` | `paths/uol-professor`, `paths/sfhea` |
| `criteria/` | `path-slug-criterion-code` | `criteria/uol-1.1` |

## What makes a good short description

- **Specific enough** to remember 18 months later. Not `cpd/2026-05-03-meeting`. Yes `cpd/2026-05-03-iped-strategy-workshop`.
- **Short enough** to read in a sidebar. Five or six hyphenated words.
- **Lowercase, hyphenated**. No spaces, no capitals (except in proper module codes), no special characters.

> **warning** Avoid generic words like *meeting*, *thoughts*, *notes*, *update*. They are useless when you have 200 records and need to find the one about HCPC standards.

## Examples worth copying

| Bad | Better |
|---|---|
| `cpd/2026-05-03-thing.md` | `cpd/2026-05-03-spinal-injury-conference-london` |
| `reflections/2026-05-03-gibbs-stuff.md` | `reflections/2026-05-03-gibbs-difficult-peer-review` |
| `claims/teaching.md` | `claims/1.1-individual-teaching-excellence` |
| `captures/2026-05-03-idea.md` | `captures/2026-05-03-curriculum-mapping-tool-idea` |

## What to do next

- [[manual/formatting]] — making records readable with admonitions, tables, and tasks
