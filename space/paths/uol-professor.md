---
type: path
slug: uol-professor
title: "UoL Promotion to Professor"
framework: UoL-TSPP-Professor
pathway: "Teaching, Scholarship, Professional Practice"
status: active
target_date: "2027"
emphasis_period: "last 5 years"
---

# UoL Promotion to Professor (TSPP)

The University of Lincoln promotion route via the Teaching, Scholarship, and Professional Practice pathway. 14 criteria across 4 pillars; emphasis on the last 5 years.

> **tip** Use [[paths/uol-professor-coverage]] for the live evidence coverage dashboard across all criteria.

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
  where p.type == "cpd-claim" and p.path == "uol-professor" and p.status == "ready"
  order by p.standard
  select pageItem(p)
]]) or "_No claims marked ready yet._"}

## Drafts in progress

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.path == "uol-professor" and p.status == "draft"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No drafts._"}

## Recent CPD for this Path

${some(query[[
  from p = tags.page
  where p.type == "cpd" and table.includes(p.paths, "uol-professor")
  order by p.lastModified desc
  limit 8
  select pageItem(p)
]]) or "_No CPD entries linked to this Path yet._"}

## Coverage by pillar

### Pillar 1 — Teaching Excellence

${query[[
  from p = tags.page
  where p.type == "criterion" and p.framework == "UoL-TSPP-Professor" and p.pillar == "1"
  order by p.code
  select pageItem(p)
]]}

### Pillar 2 — Scholarship and/or Professional Practice

${query[[
  from p = tags.page
  where p.type == "criterion" and p.framework == "UoL-TSPP-Professor" and p.pillar == "2"
  order by p.code
  select pageItem(p)
]]}

### Pillar 3 — Educational/Professional Practice Leadership

${query[[
  from p = tags.page
  where p.type == "criterion" and p.framework == "UoL-TSPP-Professor" and p.pillar == "3"
  order by p.code
  select pageItem(p)
]]}

### Pillar 4 — Citizenship *(lower weight)*

${query[[
  from p = tags.page
  where p.type == "criterion" and p.framework == "UoL-TSPP-Professor" and p.pillar == "4"
  order by p.code
  select pageItem(p)
]]}

## Notes

- Applications must address all 14 criteria, judged in the round.
- Likely focus is **scholarship** (disciplinary and/or T&L) **OR professional practice**; some applicants demonstrate both.
- **Citizenship is weighted less heavily** than the other three pillars.
- Demonstrate **scale and longevity**, with a profile of national and international standing.
- Dates and date-ranges should be clear, with emphasis on the **last 5 years**.
- "Industry" here encompasses all aspects of professional practice, including professions and the third sector.

Source: `standards/uol-tspp-professor.yaml`.
