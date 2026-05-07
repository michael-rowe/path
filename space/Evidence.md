---
readonly: true
---

# Evidence

Artefacts (PDFs, images, certificates, feedback letters, published articles) that support claims and CPD entries. Most CPD entries don't need a separate evidence page — but when an actual artefact exists, log it here so it's queryable, taggable, and surfaces on Path landing pages.

> **note** **CPD entries are themselves evidence.** Create an evidence page only when there is a tangible artefact distinct from the activity record (a signed reference, a publication, a certificate of attendance). The activity record alone usually suffices.

## Recent

${some(query[[
  from p = tags.page
  where p.type == "evidence"
  order by p.lastModified desc
  limit 20
  select pageItem(p)
]]) or "_No evidence pages yet. Use **+ Capture → Evidence** to add one._"}

## By Path

### UoL Promotion to Professor

${some(query[[
  from p = tags.page
  where p.type == "evidence" and table.includes(p.paths or {}, "uol-professor")
  order by p.date desc
  select pageItem(p)
]]) or "_None linked to this Path._"}

### AdvanceHE Principal Fellowship (PFHEA, D4)

${some(query[[
  from p = tags.page
  where p.type == "evidence" and table.includes(p.paths or {}, "advance-he-d4")
  order by p.date desc
  select pageItem(p)
]]) or "_None linked to this Path._"}

### AdvanceHE Senior Fellowship (SFHEA, D3)

${some(query[[
  from p = tags.page
  where p.type == "evidence" and table.includes(p.paths or {}, "sfhea")
  order by p.date desc
  select pageItem(p)
]]) or "_None linked to this Path._"}

### HCPC CPD audit

${some(query[[
  from p = tags.page
  where p.type == "evidence" and table.includes(p.paths or {}, "hcpc-cpd")
  order by p.date desc
  select pageItem(p)
]]) or "_None linked to this Path._"}

## By artefact type

### PDFs

${some(query[[
  from p = tags.page
  where p.type == "evidence" and p.file_type == "pdf"
  order by p.date desc
  select pageItem(p)
]]) or "_None._"}

### Images

${some(query[[
  from p = tags.page
  where p.type == "evidence" and p.file_type == "image"
  order by p.date desc
  select pageItem(p)
]]) or "_None._"}

### Emails

${some(query[[
  from p = tags.page
  where p.type == "evidence" and p.file_type == "email"
  order by p.date desc
  select pageItem(p)
]]) or "_None._"}

### Web links

${some(query[[
  from p = tags.page
  where p.type == "evidence" and p.file_type == "web"
  order by p.date desc
  select pageItem(p)
]]) or "_None._"}

### Other

${some(query[[
  from p = tags.page
  where p.type == "evidence" and (p.file_type == "other" or p.file_type == "video")
  order by p.date desc
  select pageItem(p)
]]) or "_None._"}
