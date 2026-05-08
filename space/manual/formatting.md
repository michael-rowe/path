---
readonly: true
---

# Adding visual structure to your records

Path supports a set of formatting features that make your records easier to read — and easier for an assessor to scan. Use them. Most are a single line of typing.

## Admonitions — for flagging tips, warnings, and notes

Type a blockquote (`>`) followed by `**type**` and your text on the same line:

```
> **note** Think of this as something to keep in mind, but not urgent.
> **tip** A small piece of practical advice.
> **warning** Something to be careful about.
> **danger** A serious caution. Use sparingly.
> **success** Something done right, worth noting.
```

The result, rendered:

> **note** Think of this as something to keep in mind, but not urgent.

> **tip** A small piece of practical advice.

> **warning** Something to be careful about.

> **danger** A serious caution. Use sparingly.

> **success** Something done right, worth noting.

> **tip** Use admonitions sparingly. One or two per page lifts the reading experience. Six per page becomes noise.

## Headings — to break up long records

Use `#`, `##`, `###` for nested headings. The Path templates already include the right headings; you can add sub-headings inside any section.

```
## What changed
### Quantitative outcomes
### Qualitative observations
```

## Tables — for compact comparisons

```
| Activity | Hours | Standard |
|---|---|---|
| HEA workshop | 6 | 1.2 |
| Conference talk | 3 | 2.3 |
```

Renders as:

| Activity | Hours | Standard |
|---|---|---|
| HEA workshop | 6 | 1.2 |
| Conference talk | 3 | 2.3 |

## Task lists — for action items

```
- [ ] Email mentor to schedule debrief
- [ ] Revise claim 1.1 with fresh figures
- [x] Submit ethics application
```

Renders with clickable checkboxes. Open tasks across your portfolio appear on the home page automatically.

> **tip** Tasks live on Path landing pages. Use **+ Capture → Task** and pick the Path; the task is appended to that Path's page and rolls up to the dashboard automatically.

## Wikilinks — to connect records

Wrap any page name in double square brackets:

```
This builds on [[cpd/2026-04-12-curriculum-review]] and supports [[criteria/uol-1.1]].
```

The link becomes clickable. Following the link from the *target* page back to where it was mentioned is automatic — the target page shows you everything that links to it.

> **success** This is the single most powerful feature in Path. Use wikilinks generously. The web of connections is what turns a folder of records into a portfolio.

## Embedding files and images

Drag a file from your computer onto an open page. Path will save it and ask if you want a link or an embed.

To embed manually:

```
![[evidence/manual-handling-cert.pdf]]
![[photos/2026-conference-poster.jpg]]
```

PDFs render as inline viewers; images render at full width unless sized:

```
![[photos/2026-conference-poster.jpg|300]]
```

## Hashtags — for quick grouping

```
#mentoring #uol-professor
```

Hashtags are queryable; you can list everything tagged `#mentoring` on a single page. They are lighter than wikilinks but coarser.

## Bold, italic, strikethrough

```
**bold** *italic* ~~strikethrough~~ ==highlight==
```

## Horizontal rules — for section breaks

Three hyphens on a line of their own:

```
---
```

## What to do next

- [[manual/files-and-evidence]] — adding PDFs, certificates, and evidence files
- [[manual/glossary]] — the words Path uses
