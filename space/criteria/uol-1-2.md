---
type: criterion
code: "1.2"
pillar: "1"
pillar_name: "Teaching Excellence"
title: "Reflective practice, continuous improvement and professional development"
criterion_type: evidence
framework: UoL-TSPP-Professor
---

# 1.2 — Reflective practice, continuous improvement and professional development

> Pillar 1: Teaching Excellence

## Indicators

- AdvHE Principal or Senior Fellowship, and/or other teaching qualification (EdD, PGCHE, APA, etc.)
- Sustained active engagement with the LALT community, including leadership of activities and mentoring (e.g. HEAR, APA mentor)
- Leading the development of initiatives based on student/colleague/practice feedback (e.g. Prof Practice advisory panels), with evidenced impact
- Leading the development and implementation of school/University-wide initiatives that influence the practice of colleagues

## Claims for this criterion

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "UoL-TSPP-Professor" and p.standard == "1.2"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claim yet for 1.2._"}
