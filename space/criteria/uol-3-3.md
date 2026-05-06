---
type: criterion
code: "3.3"
pillar: "3"
pillar_name: "Successful Educational and/or Professional Practice Leadership"
title: "Quantifiable impact internally on the teaching and learning / professional practice agenda"
criterion_type: evidence
framework: UoL-TSPP-Professor
---

# 3.3 — Quantifiable impact internally on the teaching and learning / professional practice agenda

> Pillar 3: Successful Educational and/or Professional Practice Leadership

## Indicators

- Income generation: successful leadership of educational contracts and/or consultancy work
- Major contribution to the School or College strategic/annual plan (e.g. initiatives led)
- Leading ESLC/TSEGO standing group or other University education/professional practice working groups
- Leadership of educational contracts and/or consultancy work with major strategic industrial or community partners

## Claims for this criterion

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "UoL-TSPP-Professor" and p.standard == "3.3"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claim yet for 3.3._"}
