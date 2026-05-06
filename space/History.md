---
readonly: true
---

# History

Recently modified pages, newest first.

${query[[
  from p = index.contentPages()
  where not string.find(p.name, "^_")
    and not string.find(p.name, "^Library/")
    and not string.find(p.name, "^manual/")
    and not string.find(p.name, "^templates/")
    and not string.find(p.name, "^standards/")
    and p.name != "CONFIG"
    and p.name != "STYLE"
    and p.name != "PLUG"
  order by p.lastModified desc
  limit 10
  select pageItem(p)
]]}
