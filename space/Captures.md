---
readonly: true
---

# All captures

Quick thoughts you have made, both processed and unprocessed.

## Unprocessed (still to triage)

${some(query[[
  from p = tags.page
  where p.type == "capture" and p.status == "unprocessed"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_All captures have been processed._"}

## Processed

${some(query[[
  from p = tags.page
  where p.type == "capture" and p.status == "processed"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_None yet._"}
