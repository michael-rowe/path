---
readonly: true
---

# All reflections

Every structured reflection you have written, across all frameworks and Paths.

${query[[
  from p = tags.page
  where p.type == "reflection"
  order by p.lastModified desc
  select pageItem(p)
]]}
