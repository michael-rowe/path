---
type: criterion
code: "2.3"
pillar: "2"
pillar_name: "Excellent Scholarship and/or Professional Practice (Engagement and Recognition)"
title: "External profile / indicators of esteem / impact"
criterion_type: evidence
framework: UoL-TSPP-Professor
---

# 2.3 — External profile / indicators of esteem / impact

> Pillar 2: Excellent Scholarship and/or Professional Practice (Engagement and Recognition)

## Indicators

- Leadership of professional bodies or disciplinary organisations
- Leadership at local and regional level in HEI/industry/community link forums
- Demonstrable and quantifiable national/international professional presence
- Achievement of external, high-profile teaching, professional practice, or disciplinary awards
- Invitations to present at national and international conferences, workshops, and events; giving plenary lectures
- Acting as a high-profile industry advisor, member of an industry judging panel, journal/book series editor, or similar

## Claims for this criterion

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "UoL-TSPP-Professor" and p.standard == "2.3"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claim yet for 2.3._"}
