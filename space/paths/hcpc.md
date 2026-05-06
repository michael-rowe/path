---
type: path
slug: hcpc
title: "HCPC CPD audit (Physiotherapist)"
framework: HCPC-CPD
pathway: "CPD standards for renewal"
status: planned
target_date: ""
---

# HCPC CPD audit

A path for the **Health and Care Professions Council** CPD standards audit cycle. Physiotherapy registrants must meet five CPD standards and may be selected for audit at renewal.

> *Stub. Add the five HCPC CPD standards and audit requirements when this path becomes active.*

## Coverage

${query[[
  from p = tags.page
  where p.type == "criterion" and p.path == "hcpc"
  order by p.code
  select pageItem(p)
]]}

## Active claims for this path

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "HCPC-CPD"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claims yet for this path._"}
