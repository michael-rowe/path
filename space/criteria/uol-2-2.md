---
type: criterion
code: "2.2"
pillar: "2"
pillar_name: "Excellent Scholarship and/or Professional Practice (Engagement and Recognition)"
title: "Excellent scholarship of teaching and learning and/or discipline"
criterion_type: evidence
framework: UoL-TSPP-Professor
---

# 2.2 — Excellent scholarship of teaching and learning and/or discipline

> Pillar 2: Excellent Scholarship and/or Professional Practice (Engagement and Recognition)

## Indicators

- Authorship of an influential textbook adopted in a course or area of practice external to the University
- Innovations in a relevant industry's practice or demonstrable transformation in industry/sector behaviour
- Creation and maintenance of influential peer-reviewable learning materials used widely beyond the University
- Keynotes/talks at international conferences and/or internationally leading institutions or professional groups/industry
- Multiple publications (journal articles, books, blogs, scholarly works, reports, other creative outputs) demonstrating significant impact and reach
- Recipient of innovation/scholarship/teaching and learning funding with demonstrable impact

## Claims for this criterion

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "UoL-TSPP-Professor" and p.standard == "2.2"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claim yet for 2.2._"}
