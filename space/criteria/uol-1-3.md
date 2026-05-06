---
type: criterion
code: "1.3"
pillar: "1"
pillar_name: "Teaching Excellence"
title: "Leading teaching innovation"
criterion_type: evidence
framework: UoL-TSPP-Professor
---

# 1.3 — Leading teaching innovation

> Pillar 1: Teaching Excellence

## Indicators

- Sustained record of leading the development and delivery of innovative and creative teaching/learning interventions with impact beyond the home discipline and ideally beyond the University
- Leading externally funded initiatives that have made a demonstrable and sustainable impact on student education
- Creation and dissemination of teaching and learning case studies with evidenced impact
- Leading innovative student entrepreneurship and enterprise activities
- Leadership of innovative examples of research/professional practice and teaching working synergistically to enhance either or both agendas

## Claims for this criterion

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "UoL-TSPP-Professor" and p.standard == "1.3"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claim yet for 1.3._"}
