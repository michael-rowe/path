# All CPD entries

Every activity you have logged. Most recent first.

${query[[
  from p = tags.page
  where p.type == "cpd"
  order by p.lastModified desc
  select pageItem(p)
]]}
