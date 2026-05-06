---
type: criterion
code: "3"
pillar: "CPD"
pillar_name: "HCPC CPD Standards"
title: "Seek to ensure CPD has contributed to the quality of practice and service delivery"
criterion_type: evidence
framework: HCPC-CPD
---

# 3 — Seek to ensure CPD has contributed to the quality of practice and service delivery

> HCPC CPD Standard 3

This is where claims must show **activity → change in practice → quality outcome**. A workshop attended is not evidence; a workshop attended and then applied with measurable change is. Reflections that connect what was learned to what was changed are the strongest evidence.

## Indicators

- Explicit before/after of practice change attributable to CPD
- Quality measure named (audit results, error rates, time-to-decision, peer feedback, service metrics)
- Distinction between *attendance* and *application*
- Reflection that closes the loop on the learning, not just narrates the activity

## Claims for this standard

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "HCPC-CPD" and p.standard == "3"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claim yet for HCPC Standard 3._"}
