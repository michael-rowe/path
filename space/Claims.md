# All claims

Every claim across every Path. Most recent first.

## Active claims (status: ready)

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.status == "ready"
  order by p.path, p.standard
  select pageItem(p)
]]) or "_No claims marked ready yet._"}

## Drafts (status: draft)

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.status == "draft"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No drafts._"}

## All claims, most recently edited first

${query[[
  from p = tags.page
  where p.type == "cpd-claim"
  order by p.lastModified desc
  select pageItem(p)
]]}
