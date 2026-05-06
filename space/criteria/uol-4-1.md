---
type: criterion
code: "4.1"
pillar: "4"
pillar_name: "Citizenship"
title: "University service"
criterion_type: evidence
framework: UoL-TSPP-Professor
---

# 4.1 — University service

> Pillar 4: Citizenship

## Indicators

- Leadership of activities contributing to general university life (open days, student activities, alumni events, mentoring schemes, professional services support, HEAR scheme, LALT contributions)
- Leadership/membership of committees/groups contributing to university life (health and safety, EDI, sustainability, working groups)
- Delivering outreach activities (school visits, local community activities)
- Personal tutoring and engagement with student support, link tutor work, and supporting international students
- Initiation and leadership of activities promoting the One Community ethos and values

## Claims for this criterion

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "UoL-TSPP-Professor" and p.standard == "4.1"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claim yet for 4.1._"}
