---
readonly: true
---

# Getting started with Path

> **tip** You can return to this page at any time using the **Getting started** link in the Navigator panel on the left.

Work through these steps in order. Each one builds on the last — profile first, framework second, then evidence.

${onboardingStatus()}

${onboardingLaunchToggle()}

---

## Step 1: Fill in your profile

Open [[profile]] and update the fields in the right-hand **Inspector** panel. At minimum, fill in:

- **Full name** and **post-nominals** (if any)
- **Job title** and **employer**

These fields appear on the cover page of every document you export. You only need to fill them in once.

To edit the long-form sections — Bio, Qualifications, Registrations — click anywhere in the body of the profile page and type directly. The Bio paragraph appears on the export cover page; the others are for your reference and your assessors'.

---

## Step 2: Install a framework

Open the command palette (**Ctrl-/** on Windows/Linux, **Cmd-/** on Mac) and run **Path: Add framework**. A list of available frameworks appears — choose the one that matches your goal:

- **HCPC CPD** — for HCPC-regulated Allied Health Professionals (physiotherapists, OTs, speech and language therapists, etc.)
- **AdvanceHE D4** — for Principal Fellowship (PFHEA) applicants
- **AdvanceHE D3** — for Senior Fellowship (SFHEA) applicants *(coming soon)*

More frameworks appear as the community contributes them. If yours isn't listed, see the [[manual/paths|paths manual page]] for how to request or author one.

Installing a framework creates:
- **Criterion pages** for each standard (in `criteria/`) — these are your working pages, one per criterion
- **A Path scaffold** — your personal instance of working toward that recognition
- **A coverage dashboard** — a heatmap showing which criteria have evidence and which are gaps

After installing, open [[paths/index]] to see your active Paths.

---

## Step 3: Log a CPD activity

Press **Ctrl-Alt-c** (Cmd-Alt-c on Mac), choose **CPD activity**, and fill in the form. A CPD entry records one learning event: a course, conference, presentation, project, reading session, or any other professional development activity.

Key fields:

- **Date** and **activity type** — what kind of learning this was
- **Standards** — which criteria this activity is relevant to (you can link to multiple)
- **Hours** — time invested (used in revalidation hour counts for HCPC)

CPD entries are raw evidence. They don't make claims on their own — you use them to support claims in Step 5.

---

## Step 4: Write a reflection

Press **Ctrl-Alt-c**, choose **Reflection**, then pick a framework. Four are available:

| Framework | Structure | Best for |
|---|---|---|
| **Driscoll** | What? / So what? / Now what? | Quick reflections on events |
| **ERA** | Experience / Reflection / Action | Short structured write-ups |
| **Gibbs** | Six stages | Significant incidents needing depth |
| **Rolfe** | What? / So what? / Now what? (extended) | Broader scope than a single event |

Start with Driscoll or ERA — they are the fastest to complete. Link a reflection to the CPD entry it came from using a wikilink in the body: `[[cpd/2026-05-01-event-name]]`.

---

## Step 5: Write a claim

Press **Ctrl-Alt-c**, choose **Claim**, and select a criterion to argue. A claim makes an explicit case that a standard has been met — it is not a list of activities but a reasoned argument.

The claim template has three main sections:

- **Evidence** — the CPD entries, outputs, and reflections that support this claim (as wikilinks)
- **Quantified impact** — measurable outcomes where possible; numbers are stronger than adjectives
- **The claim** — a narrative argument connecting your evidence to the criterion

Status flows from `draft` → `ready` → `submitted`. Only claims with `status: ready` are included in exports. Start with a criterion where you already have strong evidence — it's easier to write a claim when you can see the evidence in front of you.

---

Once all steps are done, open [[paths/index]] to track coverage across your criteria. The coverage dashboard shows which criteria have claims, CPD, and reflections — and clicking any gap takes you directly to that criterion's page.

The [[manual/index|manual]] has plain-language guidance on every feature.
