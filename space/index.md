---
readonly: true
---

# Dashboard

# Quick thoughts to process

${some(query[[
  from p = tags.page
  where p.type == "capture" and p.status == "unprocessed"
  order by p.lastModified desc
  limit 10
  select pageItem(p)
]]) or "_No quick thoughts to process. When you make a quick note, it will appear here until you turn it into a CPD entry, link it to a claim, or mark it `status: processed` in the page._"}

# Open tasks by Path

${allOpenTasksByPath(20)}

# Active Paths

${activePathsOverview()}

# Path activity this month

${activityCalendarMonth()}

# Claims by status

| Draft | Ready | Published |
| --- | --- | --- |
| ${#query[[from p = tags.page where p.type == "cpd-claim" and (p.status == nil or p.status == "draft") select p]]} | ${#query[[from p = tags.page where p.type == "cpd-claim" and p.status == "ready" select p]]} | ${#query[[from p = tags.page where p.type == "cpd-claim" and p.status == "published" select p]]} |

## Drafts needing attention

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and (p.status == nil or p.status == "draft")
  order by p.lastModified desc
  limit 10
  select pageItem(p)
]]) or "_No draft claims._"}

# Recent CPD activity

${some(query[[
  from p = tags.page
  where p.type == "cpd"
  order by p.lastModified desc
  limit 10
  select cpdItem(p)
]]) or "_No CPD logged yet._"}

# Recent reflections

${some(query[[
  from p = tags.page
  where p.type == "reflection"
  order by p.lastModified desc
  limit 5
  select pageItem(p)
]]) or "_No reflections yet._"}
