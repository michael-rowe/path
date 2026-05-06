---
type: criterion
code: "2"
pillar: "CPD"
pillar_name: "HCPC CPD Standards"
title: "Demonstrate a mixture of learning activities relevant to current and future practice"
criterion_type: evidence
framework: HCPC-CPD
---

# 2 — Demonstrate a mixture of learning activities relevant to current and future practice

> HCPC CPD Standard 2

The operative word is **mixture**. A profile of only conferences, only formal courses, or only self-directed reading is weak. HCPC publishes lists of recognised activity types ranging from formal (courses, qualifications) through professional (committee work, supervision, mentoring) to self-directed (reading, reflection, online learning). A balanced profile draws from across the categories.

## Indicators

- Multiple activity types across the cycle
- Both work-based and self-directed learning represented
- Activities relevant to current scope of practice
- Activities anticipating future practice (regulatory changes, technology adoption, role development)

## Claims for this standard

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "HCPC-CPD" and p.standard == "2"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claim yet for HCPC Standard 2._"}
