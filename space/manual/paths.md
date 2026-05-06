---
readonly: true
---

# Working towards more than one goal

Most professionals are working towards several things at once: a promotion, a fellowship, professional registration, a contract renewal. Path calls each of these a **Path**.

## What a Path is

A Path is:

- A **goal** (e.g. promotion to Professor; AdvanceHE Senior Fellowship; HCPC renewal)
- Aligned with a **framework** — the set of standards or criteria you must address
- With a **target date** and a **status** (active, planned, completed)

You can have several Paths active at once.

## How activities and claims relate to Paths

| | Belongs to | Why |
|---|---|---|
| **CPD entry** | Multiple Paths | A single activity might count as evidence under several frameworks at once |
| **Reflection** | Multiple Paths | A reflection may speak to standards across goals |
| **Claim** | One Path | A claim addresses a *specific* criterion in a *specific* framework |

> **note** This is the crucial distinction. You log an activity once, and tag it for every Path it serves. You write a claim per Path, because each Path's framework has its own language and structure.

## Setting up a new Path

1. Click **Capture something** (or `Ctrl-Alt-c`)
2. Pick **Path**
3. Replace the suggested page name with a short slug for the Path (e.g. `paths/sfhea` or `paths/hcpc-renewal-2027`)
4. Fill in the page attributes (the block at the top, between the `---` lines): framework name, status, target date
5. Build out the standards or criteria as separate notes in `criteria/` (one per criterion). The pre-installed UoL Professor path is a worked example.

> **tip** Your first Path is the one with the nearest deadline. Build that out fully before adding more.

## Linking a CPD entry to multiple Paths

When you create a CPD entry, the template includes a `paths:` field that is a list:

```yaml
paths:
  - uol-professor
  - hcpc
```

This single activity will now appear in the "Recent CPD" section on both Paths' landing pages.

> **warning** Only link to a Path where the activity genuinely contributes evidence. Tagging promiscuously dilutes the signal.

## Switching focus between Paths

The Path landing page (e.g. [[paths/uol-professor]]) shows everything for that goal — open tasks, active claims, drafts, recent CPD, coverage by criterion. Bookmark the landing page for whichever goal you are most focused on.

The [[paths/index]] page lists all your Paths grouped by status.

## What to do next

- [[manual/naming]] — keeping records findable across multiple Paths
