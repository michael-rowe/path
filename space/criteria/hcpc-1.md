---
type: criterion
code: "1"
pillar: "CPD"
pillar_name: "HCPC CPD Standards"
title: "Maintain a continuous, up-to-date and accurate record of CPD activities"
criterion_type: evidence
framework: HCPC-CPD
---

# 1 — Maintain a continuous, up-to-date and accurate record of CPD activities

> HCPC CPD Standard 1

This standard is satisfied by the CPD record itself. If you are using Path with regular CPD entries, you are evidencing this standard by definition. A claim against Standard 1 is a meta-claim describing your record-keeping practice — when you log activities, what triggers a reflection, how the record is preserved across employer changes.

## Indicators

- Continuous record across the audit cycle — not retrospective compilation
- Activities dated, scoped, and contextualised
- Record preserved independently of any single employer or regulator portal
- Mixture of activity types reflected (see Standard 2)
- Audit trail of edits (Path provides this via git automatically)

## Claims for this standard

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "HCPC-CPD" and p.standard == "1"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claim yet for HCPC Standard 1._"}
