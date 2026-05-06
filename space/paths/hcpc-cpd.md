---
type: path
slug: hcpc-cpd
title: "HCPC CPD audit"
framework: HCPC-CPD
pathway: "HCPC CPD Standards"
status: planned
target_date: ""
emphasis_period: "two-year audit cycle"
---

# HCPC CPD audit

A Path for the HCPC continuing professional development standards. Every two years HCPC randomly audits 2.5% of registrants in each profession; this Path organises the evidence so an audit submission can be assembled in hours, not weeks.

> **tip** Use [[paths/hcpc-cpd-coverage]] for the live evidence coverage dashboard across the five HCPC CPD standards.

## Open tasks for this Path

${some(query[[
  from t = tags.task
  where not t.done
  order by t.pageLastModified desc
  limit 10
  select templates.taskItem(t)
]]) or "_No open tasks._"}

## Active claims

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.path == "hcpc-cpd" and p.status == "ready"
  order by p.standard
  select pageItem(p)
]]) or "_No claims marked ready yet._"}

## Drafts in progress

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.path == "hcpc-cpd" and p.status == "draft"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No drafts._"}

## Recent CPD for this Path

${some(query[[
  from p = tags.page
  where p.type == "cpd" and table.includes(p.paths, "hcpc-cpd")
  order by p.lastModified desc
  limit 8
  select pageItem(p)
]]) or "_No CPD entries linked to this Path yet._"}

## HCPC CPD standards

${query[[
  from p = tags.page
  where p.type == "criterion" and p.path == "hcpc-cpd"
  order by p.code
  select pageItem(p)
]]}

## Notes

- HCPC requires a **continuous, up-to-date and accurate record** of CPD activities.
- A CPD profile, if selected for audit, must show a **mixture of activities relevant to current and future practice** and demonstrate that CPD has **contributed to the quality of practice and service delivery** and **benefited the service user**.
- The standards do not specify hours, but a sustained record across the two-year cycle is expected.
- **Patient confidentiality**: redact all identifiable patient details from reflections before recording. The CPD profile is shared with HCPC if audited.

Source: <https://www.hcpc-uk.org/standards/standards-of-continuing-professional-development/>
