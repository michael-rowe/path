---
tags: meta/template/page
description: New evidence — an artefact (PDF, image, certificate, link) that supports a claim or CPD entry
suggestedName: "evidence/${date.today()}-short-name"
command: "Path: New evidence"
---
---
type: evidence
title: ""
date: ${date.today()}
file_type: pdf
paths:
  - ${selectActivePath()}
standards:
  - ""
related_cpd:
  - "[[cpd/]]"
related_claims:
  - "[[claims/]]"
---

# |^|Type evidence title here

## What this evidences

A short note on the argument or activity this artefact supports. Avoid duplicating the artefact's own content — describe its *role* in your portfolio.

## Provenance

Who created the artefact, when, and under what circumstances. Useful when an assessor wants to verify authenticity. Include the chain — who sent it to you, where you received it, any context that matters.

## Attached file

Drag a file (PDF, image, etc.) into this section. SilverBullet uploads it to `_assets/` and inserts a markdown link below. The link is the canonical reference — the dashboard browse view filters on `file_type` (set in the panel), so make sure that field matches what you uploaded.

> *Most CPD activities are evidenced by the CPD entry itself — you don't need a separate evidence page for every conference. Create an evidence page when there is an actual artefact (a certificate, a feedback letter, a published article, a screenshot) that materially strengthens the claim or activity it supports.*
