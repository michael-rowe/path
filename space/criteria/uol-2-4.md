---
type: criterion
code: "2.4"
pillar: "2"
pillar_name: "Excellent Scholarship and/or Professional Practice (Engagement and Recognition)"
title: "Future contributions"
criterion_type: forward-looking
framework: UoL-TSPP-Professor
---

# 2.4 — Future contributions

> Pillar 2: Excellent Scholarship and/or Professional Practice (Engagement and Recognition)

## Prompt

A short, evidence-based account of how past experience and current
skill-set in scholarship and/or professional practice will support the
school's and university's ambitions in these areas. Should include
credible plans (commensurate with career stage and discipline) for
further generating impactful outputs and external income.

## Claims for this criterion

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "UoL-TSPP-Professor" and p.standard == "2.4"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claim yet for 2.4._"}
