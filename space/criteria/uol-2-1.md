---
type: criterion
code: "2.1"
pillar: "2"
pillar_name: "Excellent Scholarship and/or Professional Practice (Engagement and Recognition)"
title: "Excellent and sustained external professional engagement"
criterion_type: evidence
framework: UoL-TSPP-Professor
---

# 2.1 — Excellent and sustained external professional engagement

> Pillar 2: Excellent Scholarship and/or Professional Practice (Engagement and Recognition)

## Indicators

- Leading consultancy and knowledge exchange activities, or spearheading industrial partnership working in relevant industries (including utilising clinical skills) to increase value to the University
- Sustained, substantial income generation through bids, tenders, and contracts (educational, charitable, corporate, third sector)
- Regular winning of funding for, and the organisation and delivery of, professionally-rated and external-facing conferences, colloquia, symposia, exhibitions, performances, films, etc.
- Leading the development of new approaches to practice in a relevant industry, sector, or service, with significant outcomes
- Winning high-profile and influential advisory roles for industry by invitation, commission, or election, with significant demonstrable outcomes
- Winning and leading commissions for professional evaluation activities
- Winning and leading commissioned contributions to regional, national, or international policy
- Proactive creation of collaborations with T&R colleagues that generate funding, engage publics, and achieve research impact
- Sustained writing and editing of high-profile resources (online, books, etc.) used to support practice in the discipline

## Claims for this criterion

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "UoL-TSPP-Professor" and p.standard == "2.1"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claim yet for 2.1._"}
