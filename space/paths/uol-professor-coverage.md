---
type: path-dashboard
path: uol-professor
framework: UoL-TSPP-Professor
title: "UoL Professor coverage dashboard"
status: draft
last_updated: 2026-05-04
---

# UoL Professor coverage dashboard

Live coverage across the UoL TSPP criteria. Numbers come from the `path` and `standard` fields on claims, and the `paths` and `standards` lists on CPD entries and reflections — so the picture changes as soon as you tag a new piece of evidence.

## Heatmap

${pathHeatmap("uol-professor", {"1.1","1.2","1.3","1.4","2.1","2.2","2.3","2.4","3.1","3.2","3.3","3.4","4.1","4.2"})}

## Auto-derived gaps

Criteria where one or more of *claim / CPD / reflection* is empty:

${pathGaps("uol-professor", {"1.1","1.2","1.3","1.4","2.1","2.2","2.3","2.4","3.1","3.2","3.3","3.4","4.1","4.2"})}

## Narrative — why the gaps matter

The auto list above is structural — it tells you what is missing, not what to do about it. Notes below are the interpretive layer: which gaps are urgent, which are deferred by design, and which need a different *kind* of evidence rather than more of it.

- **1.4**, **2.4**, **3.4** are forward-looking by design and should be written *after* the evidence-based claims for each pillar are clearer. Don't write them yet.
- **3.3** needs *quantified* internal impact, not more entries. The gap is about depth, not coverage.
- **4.2** has draft material but needs completed community/policy impact — slow to accumulate; track it actively.

## Detail per criterion

Below: the claims, CPD entries, and reflections mapped to each criterion. If a section reads *"No claims mapped"*, that's the same signal the heatmap and gap list above are flagging.

### 1.1 — Demonstrably effective individual teaching excellence

${pathCriterionDetail("uol-professor", "1.1")}

### 1.2 — Reflective practice, continuous improvement and professional development

${pathCriterionDetail("uol-professor", "1.2")}

### 1.3 — Leading teaching innovation

${pathCriterionDetail("uol-professor", "1.3")}

### 1.4 — Future contributions

${pathCriterionDetail("uol-professor", "1.4")}

### 2.1 — Excellent and sustained external professional engagement

${pathCriterionDetail("uol-professor", "2.1")}

### 2.2 — Excellent scholarship of teaching and learning and/or discipline

${pathCriterionDetail("uol-professor", "2.2")}

### 2.3 — External profile / indicators of esteem / impact

${pathCriterionDetail("uol-professor", "2.3")}

### 2.4 — Future contributions

${pathCriterionDetail("uol-professor", "2.4")}

### 3.1 — Demonstrably impactful educational/professional practice leadership

${pathCriterionDetail("uol-professor", "3.1")}

### 3.2 — Impact on strategic vision

${pathCriterionDetail("uol-professor", "3.2")}

### 3.3 — Quantifiable impact internally

${pathCriterionDetail("uol-professor", "3.3")}

### 3.4 — Future contributions

${pathCriterionDetail("uol-professor", "3.4")}

### 4.1 — University service

${pathCriterionDetail("uol-professor", "4.1")}

### 4.2 — Civic mission

${pathCriterionDetail("uol-professor", "4.2")}
