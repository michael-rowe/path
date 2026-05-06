---
readonly: true
---

# All tasks

Open tasks across the whole portfolio, then completed tasks.

## Open

${some(query[[
  from t = tags.task
  where not t.done
  order by t.pageLastModified desc
  select templates.taskItem(t)
]]) or "_All tasks done._"}

## Recently completed

${query[[
  from t = tags.task
  where t.done
  order by t.pageLastModified desc
  limit 20
  select templates.taskItem(t)
]]}
