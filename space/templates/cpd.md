---
tags: meta/template/page
description: New CPD activity note (logs an event, course, or piece of work as evidence)
suggestedName: "cpd/${date.today()}-short-description"
command: "Path: New CPD activity"
---
---
type: cpd
title: ""
date: ${date.today()}
activity_type: conference
hours: 0
paths:
  - ${selectActivePath()}
standards:
  - ""
evidence:
  - "[[]]"
reflection_brief: ""
---

# |^|Type CPD activity title here

## Context

What was the activity? Where, with whom, why this one?

## What I did

Concrete role and contribution. First person. Avoid passive voice.

## What changed

Outcomes — quantitative where possible (numbers, dates, names), qualitative where not. Distinguish your contribution from collective work.

## Reflection

### ${date.today()}

Initial reflection — the immediate sense of what mattered and why.

<!--
  Append-only convention: when returning to this note later, add a new dated
  section below rather than editing the one above. The accumulating timeline
  is part of the evidence.
-->
