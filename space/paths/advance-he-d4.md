---
type: path
slug: advance-he-d4
title: AdvanceHE Principal Fellowship (PFHEA, D4)
framework: AdvanceHE-PSF-D4
pathway: Principal Fellow (D4)
status: active
target_date: ""
emphasis_period: sustained record (3–5+ years)
---

# AdvanceHE Principal Fellowship (PFHEA)

A Path for recognition against the **UK Professional Standards Framework (PSF 2023)** at **Descriptor 4 (Principal Fellow)**. Four D4-specific criteria, underpinned by sustained coverage of all 15 PSF dimensions (V1–V5, K1–K5, A1–A5).

> **tip** Use [[paths/advance-he-d4-coverage]] for the live evidence coverage dashboard across the four D4 criteria. The dimension checklist further down this page tracks V/K/A coverage as cross-cutting evidence.

## Open tasks for this Path

${some(query[[
  from t = tags.task
  where not t.done
  order by t.pageLastModified desc
  limit 10
  select templates.taskItem(t)
]]) or "_No open tasks._"}

## Active claims

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.path == "advance-he-d4" and p.status == "ready"
  order by p.standard
  select templates.fullPageItem(p)
]]) or "_No claims marked ready yet._"}

## Drafts in progress

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.path == "advance-he-d4" and p.status == "draft"
  order by p.lastModified desc
  select templates.fullPageItem(p)
]]) or "_No drafts._"}

## Recent CPD for this Path

${some(query[[
  from p = tags.page
  where p.type == "cpd" and table.includes(p.paths, "advance-he-d4")
  order by p.lastModified desc
  limit 8
  select templates.fullPageItem(p)
]]) or "_No CPD entries linked to this Path yet._"}

## D4 criteria

${query[[
  from p = tags.page
  where p.type == "criterion" and p.path == "advance-he-d4"
  order by p.code
  select templates.fullPageItem(p)
]]}

## Dimensions checklist (V / K / A)

D4 requires sustained coverage of all 15 PSF dimensions across the four D4 criteria. This is a reference list — tag claims, CPD, and reflections with the relevant codes via a `dimensions:` list field if you want individual coverage queries.

### Professional Values

- **V1** — Respect individual learners and diverse learning communities
- **V2** — Promote engagement in learning and equity of opportunity for all
- **V3** — Use scholarship, reflection, and evidence-informed approaches
- **V4** — Respond to the wider context in which HE operates
- **V5** — Collaborate with others to enhance practice

### Core Knowledge

- **K1** — How learners learn, generally and within specific subjects
- **K2** — Approaches to teaching and/or supporting learning
- **K3** — Critical evaluation as a basis for effective practice
- **K4** — Appropriate use of digital and other technologies and resources
- **K5** — Requirements for quality assurance and enhancement

### Areas of Activity

- **A1** — Design and plan learning activities and/or programmes
- **A2** — Teach and/or support learning
- **A3** — Assess and give feedback for learning
- **A4** — Support and guide learners
- **A5** — Enhance practice through own CPD

## Notes

- D4 is fundamentally about **strategic leadership** — evidence of *position* is not evidence of *impact*. Indicators emphasise outcomes, not roles.
- A typical application requires a **reflective account**, **two case studies of strategic impact**, and **two referee statements** — one of which must be a senior peer who can attest to your strategic leadership.
- Coverage of V/K/A should be **evidenced**, not just claimed — show where dimensions appear within your case studies rather than listing them separately.
- Demonstrate impact **beyond your immediate role** for D4.2 and **beyond your home institution** for D4.4 — the most common reason D4 applications struggle is insufficient evidence at the wider scale.

Source: `standards/advance-he-d4.yaml`. Verify wording against the official AdvanceHE PSF 2023 descriptor.
