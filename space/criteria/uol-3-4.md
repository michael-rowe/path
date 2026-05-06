---
type: criterion
code: "3.4"
pillar: "3"
pillar_name: "Successful Educational and/or Professional Practice Leadership"
title: "Future contributions"
criterion_type: forward-looking
framework: UoL-TSPP-Professor
---

# 3.4 — Future contributions

> Pillar 3: Successful Educational and/or Professional Practice Leadership

## Prompt

A short account of leadership aspirations. Based on past experience and
current skill-set, what leadership can the applicant provide to the
delivery of school priorities and university strategy?

## Claims for this criterion

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "UoL-TSPP-Professor" and p.standard == "3.4"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claim yet for 3.4._"}
