---
type: criterion
code: "5"
pillar: "CPD"
pillar_name: "HCPC CPD Standards"
title: "On request, present a written profile (CPD evidence) for audit"
criterion_type: evidence
framework: HCPC-CPD
---

# 5 — On request, present a written profile (CPD evidence) for audit

> HCPC CPD Standard 5

Procedural. Once Path is set up and you can run **Path: Export to PDF** for this Path, this standard is satisfied — you can produce a profile on request. A claim against Standard 5 is unusual; if you are creating one, it is to document a successful audit submission.

## Indicators

- Ability to produce a written profile on demand
- Profile structured to address each standard with evidence
- Evidence chain navigable (claims linked to CPD entries linked to reflections)
- Profile generation has been tested at least once outside an actual audit

## Claims for this standard

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "HCPC-CPD" and p.standard == "5"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claim yet for HCPC Standard 5._"}
