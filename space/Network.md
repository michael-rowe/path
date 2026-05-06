---
readonly: true
---

# Network

People in your professional network. The point of holding this here — rather than in a sales-style CRM — is to make the relationship navigable: every contact's page accumulates a history, and any claim, CPD entry, or reflection that wikilinks to the person shows up on their page automatically (right-hand panel → Linked mentions).

> **note** **Contacts are cross-Path by design.** A contact is not bound to any single Path; a person is part of your network whether they help with a UoL submission, an HCPC reflection, or a Path you have not started yet. Use `expertise` and `shared_interests` (panel fields) to make those connections queryable, and wikilink to people freely from claims, CPD, and reflections — Linked Mentions surfaces those backwards on the contact's page.

> **tip** **Lead with generosity.** Use the *Collaboration opportunities* section of each contact page to track what *you can offer them*. The five-minute favour, the well-timed introduction, the piece of writing they would find useful — these are what keep a network from becoming transactional. The point of the system is not to *track* people; it is to remember the things you would otherwise forget about people you already care about.

# Due for contact

People whose `next_contact` date has passed.

${some(query[[
  from p = tags.page
  where p.type == "contact" and p.next_contact ~= nil and p.next_contact ~= "" and p.next_contact <= date.today()
  order by p.next_contact
  select pageItem(p)
]]) or "_Nobody is overdue. When you set `next_contact` on a contact page, they'll appear here on or after that date._"}

# Active

People you are in regular contact with.

${some(query[[
  from p = tags.page
  where p.type == "contact" and p.status == "active"
  order by p.full_name
  select pageItem(p)
]]) or "_No active contacts yet. Use **Capture → Contact** to add one._"}

# Recently added

${some(query[[
  from p = tags.page
  where p.type == "contact"
  order by p.lastModified desc
  limit 10
  select pageItem(p)
]]) or "_No contacts yet._"}

# By relationship type

## Mentors

${some(query[[
  from p = tags.page
  where p.type == "contact" and p.relationship_type == "mentor"
  order by p.full_name
  select pageItem(p)
]]) or "_None._"}

## Collaborators

${some(query[[
  from p = tags.page
  where p.type == "contact" and p.relationship_type == "collaborator"
  order by p.full_name
  select pageItem(p)
]]) or "_None._"}

## Mentees

${some(query[[
  from p = tags.page
  where p.type == "contact" and p.relationship_type == "mentee"
  order by p.full_name
  select pageItem(p)
]]) or "_None._"}

## Peers and senior colleagues

${some(query[[
  from p = tags.page
  where p.type == "contact" and (p.relationship_type == "peer" or p.relationship_type == "senior-colleague")
  order by p.full_name
  select pageItem(p)
]]) or "_None._"}

# Dormant

People whose status you have marked dormant. Worth scanning periodically — a single thoughtful email can revive a long-quiet relationship.

${some(query[[
  from p = tags.page
  where p.type == "contact" and p.status == "dormant"
  order by p.full_name
  select pageItem(p)
]]) or "_None._"}
