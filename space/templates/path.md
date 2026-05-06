---
tags: meta/template/page
description: New Path — a goal with a framework you are working towards
suggestedName: "paths/"
command: "Path: New Path"
---
---
type: path
slug: ""
title: ""
framework: ""
pathway: ""
status: planned
target_date: ""
---

# Path: |^|

A short paragraph: what is this Path, what framework does it use, why are you working towards it?

## Coverage

${query[[
  from p = tags.page
  where p.type == "criterion" and p.path == ""
  order by p.code
  select pageItem(p)
]]}

## Active claims

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.path == ""
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claims yet for this path._"}

## Notes

Framework details, weighting, emphasis period, anything specific to this Path.
