---
readonly: true
---

# Credentials

Awards, certifications, fellowships, and **Open Badges** — the *Credentials* pillar of career capital. The point of holding them in Path is so an assessor can verify them in one click, and so the work that earned them is linked rather than implied.

> **tip** **Open Badges carry their criteria with them.** Unlike a CV line that says *"Senior Fellow, AdvanceHE"*, an Open Badge resolves to a verifiable record of *what the badge attests to* and *what evidence the issuer reviewed*. Include the verification URL on every credential page; this is the single most useful thing about the format.

# Recent

${some(query[[
  from p = tags.page
  where p.type == "credential"
  order by p.award_date desc
  limit 10
  select pageItem(p)
]]) or "_No credentials yet. Use **Capture → Credential** to add one._"}

# By type

## Open Badges

${some(query[[
  from p = tags.page
  where p.type == "credential" and p.credential_type == "open-badge"
  order by p.award_date desc
  select pageItem(p)
]]) or "_None._"}

## Fellowships

${some(query[[
  from p = tags.page
  where p.type == "credential" and p.credential_type == "fellowship"
  order by p.award_date desc
  select pageItem(p)
]]) or "_None._"}

## Certifications

${some(query[[
  from p = tags.page
  where p.type == "credential" and p.credential_type == "certification"
  order by p.award_date desc
  select pageItem(p)
]]) or "_None._"}

## Degrees

${some(query[[
  from p = tags.page
  where p.type == "credential" and p.credential_type == "degree"
  order by p.award_date desc
  select pageItem(p)
]]) or "_None._"}

# Expiring

Credentials with an `expires` date set, ordered by what expires next. Useful for renewals and recertifications.

${some(query[[
  from p = tags.page
  where p.type == "credential" and p.expires ~= nil and p.expires ~= ""
  order by p.expires
  select pageItem(p)
]]) or "_None expiring._"}
