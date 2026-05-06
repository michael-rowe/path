---
type: criterion
code: "1.4"
pillar: "1"
pillar_name: "Teaching Excellence"
title: "Future contributions"
criterion_type: forward-looking
framework: UoL-TSPP-Professor
---

# 1.4 — Future contributions

> Pillar 1: Teaching Excellence

## Prompt

A short, evidence-based account of how past experience and current
skill-set will support the school's and university's ambitions for
teaching, learning, and the student experience.

## Claims for this criterion

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "UoL-TSPP-Professor" and p.standard == "1.4"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claim yet for 1.4._"}
