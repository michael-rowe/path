---
readonly: true
---

# History

Recently modified pages, newest first.

${query[[
  from p = index.contentPages()
  order by p.lastModified desc
  limit 10
  select pageItem(p)
]]}
