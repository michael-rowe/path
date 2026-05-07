---
readonly: true
---

# Paths

A **Path** is a goal you are working towards: a promotion, a fellowship, a professional renewal. Each Path uses a framework with criteria. CPD entries can support multiple Paths; claims are scoped to one.

## Active

${some(query[[
  from p = tags.page
  where p.type == "path" and p.status == "active"
  order by p.target_date
  select pageItem(p)
]]) or "_No active paths._"}

## Planned

${some(query[[
  from p = tags.page
  where p.type == "path" and p.status == "planned"
  order by p.title
  select pageItem(p)
]]) or "_No planned paths._"}

## Paused

${some(query[[
  from p = tags.page
  where p.type == "path" and p.status == "paused"
  order by p.title
  select pageItem(p)
]]) or "_No paused paths._"}

## Archived

_Paths you have completed (goal achieved) or abandoned. Content links from claims, CPD, reflections, and credentials remain intact — archived Paths are still browsable for record._

${some(query[[
  from p = tags.page
  where p.type == "path" and (p.status == "completed" or p.status == "abandoned")
  order by p.title
  select pageItem(p)
]]) or "_No archived paths yet._"}
