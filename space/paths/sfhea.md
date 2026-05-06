---
type: path
slug: sfhea
title: "AdvanceHE Senior Fellowship (SFHEA, D3)"
framework: AdvanceHE-PSF-D3
pathway: "Senior Fellow (D3)"
status: planned
target_date: ""
emphasis_period: "sustained record across a breadth of contexts and colleagues"
---

# AdvanceHE Senior Fellowship (SFHEA)

A Path for recognition against the **UK Professional Standards Framework (PSF 2023)** at **Descriptor 3 (Senior Fellow)**. Three D3-specific criteria, underpinned by sustained coverage of all 15 PSF dimensions (V1–V5, K1–K5, A1–A5).

> **tip** Use [[paths/sfhea-coverage]] for the live evidence coverage dashboard across the three D3 criteria. The dimension checklist further down this page tracks V/K/A coverage as cross-cutting evidence.

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
  where p.type == "cpd-claim" and p.path == "sfhea" and p.status == "ready"
  order by p.standard
  select pageItem(p)
]]) or "_No claims marked ready yet._"}

## Drafts in progress

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.path == "sfhea" and p.status == "draft"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No drafts._"}

## Recent CPD for this Path

${some(query[[
  from p = tags.page
  where p.type == "cpd" and table.includes(p.paths, "sfhea")
  order by p.lastModified desc
  limit 8
  select pageItem(p)
]]) or "_No CPD entries linked to this Path yet._"}

## D3 criteria

${query[[
  from p = tags.page
  where p.type == "criterion" and p.framework == "AdvanceHE-PSF-D3"
  order by p.code
  select pageItem(p)
]]}

## Dimensions checklist (V / K / A)

D3 requires sustained coverage of all 15 PSF dimensions, demonstrated through your D3.1 and D3.2 activities and their D3.3 outcomes. Tag claims, CPD, and reflections with the relevant codes via a `dimensions:` list field if you want individual coverage queries.

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

- D3 is fundamentally about **co-ordinating and developing others** — evidence of your own excellent teaching alone is not sufficient. Show breadth across colleagues and contexts.
- **D3.3 is the outcome criterion** — it closes the chain opened by D3.1 and D3.2. The link between your activities and student-facing outcomes must be explicit.
- A typical SFHEA application involves a **reflective account** and **two case studies**, with two referees who can attest to the breadth and impact of your co-ordinating and developmental role.
- D3 ≠ a long D2: the evaluative frame shifts from "how I teach well" to "how I help others teach well and what that produces for students".
- Coverage of V/K/A should be **evidenced** through D3.1/D3.2 activities and their D3.3 outcomes — not listed separately.

Source: `standards/advance-he-d3.yaml`. Verify wording against the official AdvanceHE PSF 2023 descriptor.
