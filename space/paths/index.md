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

## Other

${some(query[[
  from p = tags.page
  where p.type == "path" and p.status != "active" and p.status != "planned"
  order by p.title
  select pageItem(p)
]]) or "_None._"}
