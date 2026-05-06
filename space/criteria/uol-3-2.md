---
type: criterion
code: "3.2"
pillar: "3"
pillar_name: "Successful Educational and/or Professional Practice Leadership"
title: "Impact on the strategic vision for teaching and learning / scholarship / professional practice within the College / University"
criterion_type: evidence
framework: UoL-TSPP-Professor
---

# 3.2 — Impact on the strategic vision for teaching and learning / scholarship / professional practice within the College / University

> Pillar 3: Successful Educational and/or Professional Practice Leadership

## Indicators

- Sustained leadership of new and significant work contributing to the institutional teaching and learning agenda (e.g. TEF, WP/APP agenda, internationalisation, graduate outcomes, employability, completions, differential attainment, student satisfaction)
- Leading the national scholarship and/or professional practice agenda through disciplinary and industry links and KTPs
- Chairing of University committees and active membership of College/institutional/industry committees and working groups
- Mentoring and development of others with evidence of advancing the strategic vision of the University

## Claims for this criterion

${some(query[[
  from p = tags.page
  where p.type == "cpd-claim" and p.framework == "UoL-TSPP-Professor" and p.standard == "3.2"
  order by p.lastModified desc
  select pageItem(p)
]]) or "_No claim yet for 3.2._"}
