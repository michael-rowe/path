---
readonly: true
type: about
---

# About Path

Path is a self-contained portfolio system for regulated professionals — physiotherapists, allied health professionals, university teachers — to keep a serious record of their CPD and assemble it into a submission for promotion, fellowship, or registration.

It runs locally on your machine. Your records are plain markdown files on disk, and there is no central server holding your portfolio. You can read, back up, and move them with any tool that handles text.

## Version

Path v0.1 (pre-release). The version number ticks forward when bundled frameworks, the plug, or the export pipeline change in a way that affects users.

## Built on

Path stands on three open-source projects without which it wouldn't exist:

- **[SilverBullet](https://silverbullet.md)** — the markdown-first knowledge management editor that provides Path's core editor, indexing, query language, plug system, and panel API. SilverBullet is licensed under the MIT licence.
- **[Pandoc](https://pandoc.org)** — the universal document converter that turns your portfolio pages into a Word file when you run **Path: Export to Word**. For PDF, use your browser's print function (Ctrl-P). Pandoc is licensed under the GPL v2+.

The dashboard also uses **[Inter](https://rsms.me/inter/)** for UI typography (SIL Open Font Licence), and a small set of icons derived from **[Feather Icons](https://feathericons.com)** (MIT).

## Frameworks

The bundled frameworks are encoded by hand against the published criteria of each issuing body. They are read-only references, not endorsements:

- **HCPC CPD** — based on the Health and Care Professions Council's published standards for continuing professional development.
- **AdvanceHE Descriptor 4 (Principal Fellowship)** — based on the Professional Standards Framework (PSF) 2023.
- **AdvanceHE Descriptor 3 (Senior Fellowship)** — same source, currently a stub.
- **University of Lincoln TSPP — Promotion to Professor** — encoded from the institution's published criteria.

Frameworks are versioned. Run **Path: Add framework** to install a new one or **Announcements** to see when an updated version ships.

## Data and privacy

- Your portfolio lives in `space/` on your machine. Path doesn't transmit your records anywhere.
- The announcements feed and the framework registry are static JSON files fetched over HTTPS from a public GitHub repository (`github.com/michael-rowe/path-frameworks`). These are one-way reads — Path doesn't post anything back, doesn't carry cookies, and doesn't see who is reading.
- You can disable the announcements fetch entirely with `config.set("path.news_url", "")`, or change the registry with `config.set("path.framework_registry", "...")`.

## Source and contributions

Path is open source on GitHub: **[github.com/michael-rowe/path](https://github.com/michael-rowe/path)**. Frameworks are at **[github.com/michael-rowe/path-frameworks](https://github.com/michael-rowe/path-frameworks)**.

Contributions are welcome — particularly new framework bundles. The README explains the schema.

## Made by

Built and maintained by [[Michael Rowe]] — physiotherapist, academic, and Director of Teaching and Learning at the University of Lincoln.

## Licence

Path's source code is released under the [PolyForm Noncommercial 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0) licence. Individuals, charities, educational institutions, public research organisations, and government bodies can use, copy, modify, and distribute Path freely for any noncommercial purpose. Commercial use — selling Path, offering it as a paid service, or building a commercial product around it — is not permitted under this licence; contact the maintainer for commercial licensing.

The bundled framework definitions are made available for personal use; their underlying criteria remain the intellectual property of their respective issuers (HCPC, Advance HE, the University of Lincoln, etc.). Path's dependencies (SilverBullet, Pandoc, Inter, Feather Icons) retain their own original licences as listed above.

## What to do next

- [[manual/cheatsheet]] — keyboard shortcuts and the full manual table of contents
- [[Setup]] — your onboarding checklist, with progress markers
