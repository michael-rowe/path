---
tags: meta/template/page
description: New credential — award, badge, certification, or fellowship
suggestedName: "credentials/${date.today()}-short-name"
command: "Path: New credential"
---
---
type: credential
title: ""
credential_type: open-badge
issuer: ""
award_date: ${date.today()}
badge_url: ""
badge_image: ""
verification_url: ""
expires: ""
paths:
  - uol-professor
standards:
  - ""
evidence:
  - "[[]]"
---

# Credential: |^|

## What this credential recognises

What does the issuer say it represents? One short paragraph in their words or yours. Avoid puffery — describe the criteria, not the achievement.

## How I earned it

The work behind the credential. Link to the CPD activities, claims, or projects that produced the evidence the issuer assessed (or that you assessed yourself). For self-issued or experience-based credentials, this is the part that gives the badge its meaning.

## Why it matters for this Path

Which criterion does it speak to, and how convincingly? Open Badges are useful precisely because they carry their criteria with them — the verification URL above lets an assessor confirm what the badge actually attests to. Use that to your advantage rather than treating the badge as a decoration.

## Verification

If this is an Open Badge, the **verification URL** in the right-hand panel should resolve to the issuer's verification record (often a JSON-LD document or a public profile page). Drag the badge image into Path and set **Badge image** to the saved path.
