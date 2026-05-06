---
type: criterion
code: "3.1"
pillar: "3"
pillar_name: "Successful Educational and/or Professional Practice Leadership"
title: "Demonstrably impactful educational/professional practice leadership"
criterion_type: evidence
framework: UoL-TSPP-Professor
---

# 3.1 — Demonstrably impactful educational/professional practice leadership

> Pillar 3: Successful Educational and/or Professional Practice Leadership

## Indicators

- Significant and sustained contribution to management/leadership of School/College/University (resource management, policy development, etc.) with evidence of material benefits
- Successfully undertaking a significant College/University teaching, scholarship, or professional practice role with demonstrable impact (e.g. College Director of Education, leading educational contract/consultancy, employability initiatives, cross-university review)
- Leading and instigating a high-impact innovative course
- Sustained leadership of new and significant international educational links and/or improvements to international student education
- Leadership of national/international professional bodies or committees significantly enhancing links between industry/professions and HE
- Leadership of significant professional accreditation processes
- Wider engagement at College/University level
- Leading consultancies, knowledge exchange centres, or other initiatives that boost the profile and impact of professional practice

## Claims for this criterion

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "UoL-TSPP-Professor" and p.standard == "3.1"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claim yet for 3.1._"}
