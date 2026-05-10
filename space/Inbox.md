---
readonly: true
---

# Inbox

Items waiting for your review. These may have been created by an AI assistant,
captured quickly via the **Capture** button, or dropped here manually.

Review each item, update the fields in the **Inspector** panel, then move it to
the right folder (CPD, claims, reflections, captures) when you're satisfied.

${some(query[[
  from p = tags.page
  where p.name:match("^Inbox/") != nil
  order by p.lastModified desc
  select pageItem(p)
]]) or "_Your inbox is empty._"}
