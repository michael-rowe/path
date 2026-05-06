---
type: criterion
code: "4"
pillar: "CPD"
pillar_name: "HCPC CPD Standards"
title: "Seek to ensure CPD benefits the service user"
criterion_type: evidence
framework: HCPC-CPD
---

# 4 — Seek to ensure CPD benefits the service user

> HCPC CPD Standard 4

The standard most often under-evidenced. Practitioners frequently document personal practice change (Standard 3) without explicitly naming the **service-user benefit**. Reflections need to make the connection explicit: *because I learned X, I changed Y, which meant the service user experienced Z.*

> **note** **Confidentiality.** Service-user benefit must be evidenced without identifying any individual user. Use anonymised vignettes, aggregate measures (waiting times, satisfaction scores), or service-level descriptions — never names, dates, or details that could identify a user.

## Indicators

- Service-user benefit named explicitly, not implied
- Benefit grounded in observable outcome, not assumed
- Anonymised vignettes or aggregate measures used appropriately
- Distinction between *practitioner* benefit (Standard 3) and *user* benefit (Standard 4)

## Claims for this standard

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "HCPC-CPD" and p.standard == "4"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claim yet for HCPC Standard 4._"}
