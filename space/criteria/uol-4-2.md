---
type: criterion
code: "4.2"
pillar: "4"
pillar_name: "Citizenship"
title: "Leadership of the university's civic mission"
criterion_type: evidence
framework: UoL-TSPP-Professor
---

# 4.2 — Leadership of the university's civic mission

> Pillar 4: Citizenship

## Indicators

- Leadership of external partnerships contributing to the University's civic mission
- External activities such as volunteering, school governorship, employment committees, third-sector governance, cultural activities, other relevant community work
- Leadership and promotion of the university's civic mission through publications, talks, outreach
- Other activities that actively role-model the University's civic mission

## Claims for this criterion

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "UoL-TSPP-Professor" and p.standard == "4.2"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claim yet for 4.2._"}
