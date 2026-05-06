---
type: criterion
code: "1.1"
pillar: "1"
pillar_name: "Teaching Excellence"
title: "Demonstrably effective individual teaching excellence"
criterion_type: evidence
framework: UoL-TSPP-Professor
---

# 1.1 — Demonstrably effective individual teaching excellence

> Pillar 1: Teaching Excellence

## Indicators

- Excellent (individual) sustained student feedback (e.g. module evaluations, other student feedback, NSS, nominations for an SU teaching award)
- Excellent sustained (individual) staff and peer feedback (e.g. external examiners, PRoP, nominations for VC teaching awards)
- Curriculum development (or other teaching/assessment practice) that delivers a sustained positive impact on students (e.g. attainment, attainment-gap reduction, graduate outcomes, continuation, completion)

## Claims for this criterion

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "UoL-TSPP-Professor" and p.standard == "1.1"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claim yet for 1.1._"}
