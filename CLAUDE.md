# Path — technical context

This file is for Claude Code sessions working in `~/portfolio/`. It captures the architecture, conventions, and gotchas of the Path system so a fresh session doesn't have to relearn them. Project-level *why* and decisions log live in `~/planning/projects/Personal Learning System/Project - Personal Learning System.md`; this file is the *how*.

## What Path is

A self-contained CPD / portfolio system for regulated professionals. Two Docker services + a SilverBullet plug + a markdown content folder. Local-first, distributable as a Docker stack.

**Personal use case:** building Michael's UoL Promotion to Professor portfolio against the TSPP framework. **Distributable goal:** a v0.1 product for UK physiotherapy practitioners (HCPC) and AdvanceHE Fellowship applicants.

## Repository layout

```
~/portfolio/
├── docker-compose.yml         Two services: silverbullet, pandoc-svc
├── space/                     SilverBullet's data folder (mounted into the container)
│   ├── CONFIG.md              Lua config: page locking, schemas, theme, capture, helpers, favicon/title hook, framework registry
│   ├── STYLE.md               Custom CSS (font, frontmatter hidden, toolbar fixed/centred, theme toggle, heatmap palette)
│   ├── profile.md             User identity (YAML scalars + body sections)
│   ├── index.md               Dashboard (queries, no longer a landing/welcome page)
│   ├── History.md             Recently modified pages (top 100)
│   ├── Network.md             Browse: contacts, with Due-for-contact + relationship-type views
│   ├── Credentials.md         Browse: awards / Open Badges / fellowships / certifications
│   ├── Browse.md, Claims.md, CPD.md, Captures.md, Reflections.md, Tasks.md  Other browse pages
│   ├── claims/, cpd/, captures/, reflections/, paths/, criteria/, network/, credentials/  Content
│   ├── manual/                12 plain-language pages (soft-locked via readonly: true); `_assets/` for screenshots
│   ├── standards/             Framework specs as YAML (uol-tspp-professor.yaml, advance-he-d4.yaml)
│   ├── templates/             SB templates: cpd, claim, claim-future, reflection-*, capture, contact, credential, path, personal-statement, profile
│   └── Library/
│       ├── path/              Path plug: path.plug.js (~30 KB) + PLUG.md
│       └── silverbulletmd/basic-search/   Bundled full-text search plug (Search Space command)
├── path-plug/                 TypeScript source for the SB plug
│   ├── path.ts                All plug functions
│   ├── path.plug.yaml         Manifest (functions, hooks)
│   ├── package.json           npm build script (`npx plug-compile`)
│   └── path.plug.js           Compiled output (gets copied into space/Library/path/)
├── pandoc/                    The PDF/Word export sidecar
│   ├── Dockerfile             Python 3.12 + pandoc + texlive-xetex + FastAPI
│   ├── main.py                FastAPI app with /compile endpoint
│   ├── templates/             LaTeX templates for PDF cover page
│   └── lua-filters/           Pandoc Lua filters
└── exports/                   Output dir for compiled PDFs / DOCXs
```

## Stack at runtime

| Service | Image | Port | Network | Volumes |
|---|---|---|---|---|
| `silverbullet` | `ghcr.io/silverbulletmd/silverbullet` (currently 2.6.1) | 3000 (host) | `path-net` | `./space:/space` |
| `pandoc-svc` | Locally built from `./pandoc/Dockerfile` | 8000 (internal only) | `path-net`, static IP **172.28.0.10** | `./space:/space:ro`, `./exports:/exports` |

`SB_USER` for SB basic auth is set in the compose file (currently hardcoded — needs env-var-ification before distribution).

The static IP for pandoc-svc is load-bearing: SB's HTTP proxy auto-detects HTTPS for non-IP hostnames, which mangles requests to the sidecar. Calling it by bare IP (`http://172.28.0.10:8000/compile`) is what makes the proxy fall back to HTTP. Don't replace it with a hostname.

## Plug development workflow

The plug at `~/portfolio/path-plug/` is the **single source of truth for app UI**. All side-panel rendering, attribute editing, navigation, and any future interactive behaviour lives here.

**Build & deploy:**

```bash
cd ~/portfolio/path-plug
npm install        # one-time
npm run deploy     # builds path.plug.js and copies to space/Library/path/
```

Then in SB's command palette: **`Plugs: Reload`** — picks up the new bundle without a page reload. SB also auto-syncs every ~20s, but `Plugs: Reload` is faster for active dev.

**Dependencies:** Node 24 + npm 11 (already on this machine). The compile is `npx plug-compile path.plug.yaml` under the hood, from `@silverbulletmd/silverbullet`. **No Deno needed** — though Deno was installed earlier in the session for an aborted approach, it's unused now.

**Distribution path:** the compiled `path.plug.js` is the artefact end users care about. They never need Node. For a contributor experience that doesn't require Node, we can later add a `plug-builder` service to docker-compose.

## Key plug entry points (in `path.ts`)

| Function | Hook | What it does |
|---|---|---|
| `onPageLoaded` | `editor:pageLoaded` event | Renders both side panels on every page load |
| `showLeftPanel` | called by `onPageLoaded` | Branded nav: logo + Create / Browse / Workspace sections. Create includes New CPD / claim / future-claim / reflection / contact / credential / quick capture. Browse adds Network, Credentials, History. |
| `showAttributesPanel` | called by `onPageLoaded` | Right panel: three collapsible `<details>` sections — On this page (ToC), Page attributes (form), Linked mentions (backlinks). Open/closed state persisted per-section in `localStorage` (key `path-section-<name>`). |
| `fetchLinkedMentions(pageName)` | internal, called by `showAttributesPanel` | Backlinks query via `lua.parseExpression` + `index.queryLuaObjects` against the `link` tag with `scopedVariables = { pageName }`. The std `linkedMentions` widget is **disabled** in CONFIG.md so we own the rendering. |
| `saveAttributes(pageName, values)` | called from iframe via `system.invokeFunction` | Parses page YAML, applies edits, writes back, reloads |
| `parseFrontmatter`, `serializeFields` | internal | YAML parser/emitter that round-trips complex (nested-object) lists as raw text |
| `extractToc` | internal | Heading parser for the *On this page* panel section |

`showAttributesPanel` reads page text from `editor.getText()` first (the editor buffer), falling back to `space.readPage()`. This avoids a race where a brand-new page from a template hasn't been written to disk yet when `pageLoaded` fires.

## SB panel API gotchas (learned the hard way)

- **Panels run in iframes** when `html` is a string (the path we use). Shadow DOM is for HTMLElement panels, only constructible from native code.
- **`<script>` tags inside the HTML are silently dropped** — SB sets the iframe's `body.innerHTML = html`, which strips scripts. The script must be passed as the **4th arg** to `editor.showPanel(id, mode, html, script)`. The iframe `eval`s it after innerHTML assignment.
- **`syscall(name, ...args)`** is a global inside the iframe. Use it for everything — `editor.flashNotification`, `editor.navigate`, `space.readPage`, `space.writePage`, `system.invokeFunction`, `system.invokeCommand`.
- **Iframe → plug calls** go via `syscall('system.invokeFunction', 'path.functionName', args...)`. The plug function name is namespaced as `<plugName>.<functionName>`.
- **Theme switching is not auto-propagated** to iframes after first render. Each panel script installs a `MutationObserver` on `window.parent.document.documentElement` watching `data-theme` and mirrors the value into its own document. Same-origin so it works.
- **Panel width** is controlled by the second arg to `showPanel` (which the docs call `mode`). It's actually a **flex grow factor** — the editor is `flex: 1`, so a panel `mode: 0.5` ends up at ~33% of layout width. Currently: lhs=0.5, rhs=0.7.
- **Iframe theme attribute** is set once at render via the parent's postMessage. Our `STYLE.md` light/dark CSS uses `html[data-theme="dark"] body` selectors so themes only need that one attribute set.
- **Dark mode CSS selector gotcha:** `html[data-theme="dark"] html { ... }` is invalid — there is no `html` inside `html`. Use `html[data-theme="dark"] { background: ... }` to target the html element itself, or `html[data-theme="dark"] body { ... }` inside a panel iframe.
- **Toolbar HTML structure** (`#sb-top`): three direct children — `div.panel` (ghost spacer mirroring Navigator width), `div.main` (real content), `div.panel` (ghost spacer mirroring Inspector width). Inside `div.main > div.inner > div.wrapper`: `div.sb-page-prefix`, `span#sb-current-page` (a CodeMirror mini-editor — **not** an `<input>`), `div.sb-actions` (all buttons). Ghost spacers shift `.sb-actions` as panels open/close. **Always ask for DOM inspection before writing CSS for unfamiliar structures.**
- **Toolbar CSS approach** (in STYLE.md): `#sb-top { position: fixed }` spans full viewport and eliminates spacer shift; `#sb-top > .panel { display: none }` hides ghost spacers; `#sb-current-page, .sb-page-prefix { display: none }` hides page title; `#sb-top .sb-actions { position: fixed; left: 50%; transform: translateX(-50%) }` centres buttons; `#sb-top + * { margin-top: 44px }` prevents content sliding under the toolbar.

## Conventions the panel/body principle

The most important UX rule across all templates:

> **YAML / panel = structured metadata that something queries. Body = human content that someone reads.**

Practical test: *"Would a query, filter, or template variable use this field?"* If yes → YAML/panel. If no → body section.

Two follow-ons:

- **Single-value-per-field** (one string, one date, one flat list of short strings) → YAML.
- **Variable-length, structured, or multi-paragraph** content → body section.

Concretely, `profile.md` already follows this: identity scalars in YAML, prose (`## Bio`), structured records (`## Qualifications`, `## Registrations`) in body. The same restructure should be applied to `templates/cpd.md`, `templates/claim.md`, `templates/reflection-*.md` next time we touch them — anywhere a field is "argued narrative" or "list of records" rather than "metadata".

## Frontmatter visibility

Inline YAML is **hidden in the editor** via `STYLE.md`:

```css
.sb-frontmatter { display: none !important; }
```

A small italic label remains where the YAML was, pointing users to the right-hand panel. The file on disk is unchanged — only the editor view is suppressed. Two consequences:

1. The right-hand panel is the only edit surface for YAML. Keep it working.
2. Power users can still edit the YAML via any text editor outside SB. The lock is soft.

## Page-name conventions

- **Filenames are the page identifiers.** `claims/uol-1-1-short-name.md` → page `claims/uol-1-1-short-name`.
- **Dots in page names break wikilinks.** Use hyphens: `uol-1-1` not `uol-1.1`. We hit this; the criterion files were renamed accordingly.
- **`name` is reserved by SB** as the page identity attribute. Don't use it as a YAML field — we hit a validation error and renamed `name` → `full_name` in the profile schema.
- Browse pages are top-level capitalised: `Claims.md`, `CPD.md`, `Reflections.md`, `Captures.md`, `Tasks.md`, `Browse.md` (= "All"). The path index lives at `paths/index.md`.

## Tag schemas (in CONFIG.md)

`tag.define { name = "...", schema = { ... enum = {...} } }` for `cpd-claim`, `cpd`, `capture`, `path`, `personal-statement`, `reflection`, `contact`, `credential`. SB will inline-flag invalid values for fields like `status`, `claim_type`, `activity_type`, `framework`, `relationship_type`, `credential_type`. The plug doesn't currently render these as dropdowns — it shows free-text inputs with a hint string. Promoting them to `<select>` elements driven by the schema is a future polish.

## Lua helpers (in CONFIG.md)

CONFIG.md exposes these helpers as space-lua globals:

- **`pageDisplayName()`** — turns `network/benita-olivier` into `Benita Olivier`. Used inside template bodies (`# ${pageDisplayName()}`, `full_name: "${pageDisplayName()}"`) so a new contact's H1 and identifying YAML field auto-populate from the slug. Calls `editor.getCurrentPage()` — works because the SB page-template engine navigates *before* evaluating the body template.
- **`pathCoverage(slug)`** — returns counts of `{claims, cpd, reflections}` per criterion code for a Path. Three queries total. Powers the heatmap and gap helpers below; replaces what would otherwise be 40+ inline `${#query[[...]]}` cells.
- **`pathHeatmap(slug, criteria)`** — `widget.html(dom.table {...})` emitting `<td class="ph-cell ph-N">`; styling lives in STYLE.md so the palette is themeable. Single-hue indigo scale: empty cells get a dashed border and `—` (absence ≠ score zero); filled cells scale 1 → 5+ in indigo intensity. Dark-mode variants in STYLE.md.
- **`pathGaps(slug, criteria)`** — markdown bullet list of any criterion missing claim/CPD/reflection. Replaces the hand-curated gap section.
- **`pathCriterionDetail(slug, code)`** — three-list block (claims, CPD, reflections) for one criterion. Used in the per-criterion sections of coverage dashboards.

Both Path coverage dashboards (`paths/uol-professor-coverage.md`, `paths/advance-he-d4-coverage.md`) use the same helper signatures — they're framework-agnostic.

## Framework registry (in CONFIG.md)

`Path: Add framework` and `Path: Check framework updates` install/update Path bundles from a remote registry. Default registry: `https://raw.githubusercontent.com/michael-rowe/path-frameworks/master`. Override via `config.set("path.framework_registry", "...")`.

Registry layout: `index.json` at the root lists frameworks; each `<slug>/info.json` declares the bundle's files (relative paths). Install fetches each file and writes it into the user's space at the same relative path (`.md` stripped for `space.writePage`).

Internals:
- `net.proxyFetch` for HTTP — but raw.githubusercontent.com sometimes serves `.json` with `text/plain`, so `fetch_json` defensively re-parses string bodies via `js.tolua(js.window.JSON.parse(body))` (the `js` Lua table exposes `tolua/tojs/window` etc; standard JS globals like `JSON` live on `js.window`, not directly on `js`).
- Conflict detection: install asks before overwriting; update calls install with `allow_overwrite = true`.
- Version tracking: each install records `slug | name | version | installed-date` in `_system/installed-frameworks`. Update command pattern-matches that page against the registry.

## Framework vs Path

A **Framework** is the externally-defined standards (HCPC publishes these; we encode them). A **Path** is the user's instance of pursuing recognition under a framework — has status, target_date, claims, timeline.

Architectural consequence (since the 2026-05-05 refactor):
- **Criterion pages are framework-scoped.** Frontmatter has `framework: X` but no `path:` field. Queries inside criterion pages filter by `where p.framework == "X" and p.standard == "Y"` so a single criterion page serves all Paths that target the same framework.
- **Path pages and coverage dashboards stay path-scoped** — `pathCoverage(slug)` filters by `p.path == slug`. They are per-instance views of *your* claims.
- **Bundles still install both** framework files (criteria, standards) and a Path scaffold (paths/X.md, paths/X-coverage.md) for install convenience. The user can later create additional Paths against the same framework by duplicating only the path scaffold.

The 1:1 collapse is fine for typical use (one user, one Path per framework). The decoupling matters for: re-applications after failure, multi-cycle revalidation (HCPC every 2 years, NMC every 3), and cohort use where multiple users share a framework definition.

## Browser tab title and favicon (CONFIG.md)

A `pageLoaded` Lua listener sets `js.window.document.title = "Path | <H1 or page name>"` and replaces the favicon with the inline-SVG Path "route" logo (data URL, indigo `#4f46e5`). Re-runs on every page load so SB navigations don't revert it.

## Search

Full-text search is **not built into SB core** — it's the `basic-search` plug (formerly built-in). We bundle it at `space/Library/silverbulletmd/basic-search/` so the search action button (top-bar magnifying glass, defined in CONFIG.md, priority 1.02) can invoke its `Search Space` command (`Ctrl-Shift-F`). Requires a one-time `Space: Reindex` after first install for results to populate.

**Action button priorities** (CONFIG.md, left-to-right order): SB built-ins Home ≈ 3, Open ≈ 3, RunCmd ≈ 2. Custom: Profile 2.9, Focus mode 1.05, Search 1.02, theme toggles 1. Float priorities let custom buttons interleave with SB's. At equal priority, later-registered buttons appear leftmost.

## Pandoc sidecar contract

`POST /compile` on http://172.28.0.10:8000/compile, body:

```json
{
  "pages": ["personal-statements/uol-professor", "claims/uol-1-1", ...],
  "title": "UoL Promotion to Professor — Submission",
  "slug": "uol-professor",
  "format": "pdf"   // or "docx"
}
```

The sidecar:

1. Reads `profile.md` for cover-page metadata. **Bio is extracted from the `## Bio` body section** (not from YAML — see `_extract_section()` in `pandoc/main.py`).
2. Reads each page in `pages`, strips wikilinks/transclusions/SB expressions, joins with `\newpage`.
3. Runs Pandoc with the LaTeX template (`templates/portfolio-default.tex`) for PDF or default Word for DOCX.
4. Saves to `/exports/submission-<slug>-<YYYY-MM-DD-HHMM>.<ext>` (mounted from `~/portfolio/exports/` on the host).
5. Returns `{ "filename": "...", "host_path": "..." }`.

After editing `pandoc/main.py` or `pandoc/templates/`, rebuild the container:

```bash
sudo docker compose up -d --build pandoc-svc
```

## SB version lock

We're on **SilverBullet 2.6.1**. The 2.6 release replaced iframe-based panels with shadow-DOM panels for HTMLElement content, but **string-HTML panels still use iframes** — which is what we do. So the panel API behaviour we rely on is stable. If SB later drops iframes entirely, we'd need to migrate the panel rendering.

To upgrade SB: `sudo docker compose pull silverbullet && sudo docker compose up -d silverbullet`.

## CPD activity calendar

`cpdCalendar(path_slug)` in CONFIG.md — GitHub-style 52-week contribution grid rendered via `widget.html`. Shaded by hours using a 5-level indigo scale; empty cells get a dashed border. Month labels along the top. Calls `${cpdCalendar()}` on `index.md` (all entries); individual Path pages can call `${cpdCalendar("slug")}` to filter. Uses Julian Day Number arithmetic (no `os.date`). `date.today()` is the reference point.

## Known deferred items

- AI integration (planned: `silverbullet-ai` plug, blocked on having designed prompts to make it useful)
- Standards-driven dropdowns in the attributes panel → **done** (2026-05-05): `FIELD_ENUMS`, `STATUS_ENUMS`, and `getEnumOptions()` in `path.ts` render `<select>` elements for `status`, `claim_type`, `activity_type`, `relationship_type`, `credential_type`, and `framework` (on reflection pages only).
- HCPC standards pack — stub bundle published in registry; needs review for accuracy against official HCPC wording
- AdvanceHE D3 (Senior Fellow) — `paths/sfhea.md` is still a stub; D4 done
- NMC framework bundle — registry slot reserved but not yet authored; quantitative shape (35 hrs / 20 participatory / 5 reflections / etc.) needs custom helpers
- Word reference document for branded `.docx` exports (currently uses Pandoc default styles)
- Task scoping by Path (SB Lua query syntax for filtering by page array fields not yet figured out)
- Path picker at template-instantiation time (CPD / claim / reflection templates default `path: uol-professor`; user edits in panel)
- Open Badges 3.0 verification (currently we just store the verification URL — no JSON-LD/VC validation)
- PARA / Distill workflow (decided against — Forte's framing not loved)
- Personal README / operating manual page type (decided against — adds clutter, value unclear)
- Web clipper (Phase 5)
- Tailscale / remote access doc

## Known UX issues on readonly pages

Two SB editor behaviours that survive `forcedROMode` and we couldn't suppress without breaking other things:

1. **Heading source flash on click** — clicking a heading on a readonly page reveals the raw `## ` markdown prefix and shifts the heading slightly. We have one CSS rule (`html[data-path-readonly="true"] .sb-header-inside .sb-meta { display: none }`) that hides the `#` chars when the line goes into source mode. The shift remains because SB's compensating `text-indent` assumes the prefix is visible. We tried CSS gymnastics (`pointer-events`, padding/font-weight forcing, `width: 0`, `text-indent` overrides per heading level), JS (`mousedown` capture, `MutationObserver` stripping `sb-header-inside`) — none cleanly fixed the shift without introducing new offsets. Accepted as a cosmetic limitation.

2. **Template `${...}` source flash on click** — clicking inside a rendered Lua-directive widget dissolves it and shows the raw source. No targetable wrapper class in source mode (CM renders raw text + token spans inside a regular `cm-line`), so CSS can't hide it after the fact. Mitigation is to make readonly pages clearly non-interactive (View only badge, hidden cursor). Live with it.

**Discovery references** (for any future attempt): grep the bundled client at `/.client/client.js` and `/.client/main.css` (public, served by the SB container without auth). Key names: `sb-header-inside` (line class CM adds when the cursor lands in a heading), `r1(state, [from, to])` (the cursor-in-range helper driving source-reveal), `LuaDirective` (no replace-decoration when `r1` is true), `sb-lua-wrapper` + `sb-lua-directive-inline/block` (widget DOM, distinct from the `sb-lua-directive` span used only in the markdown→HTML export pipeline).

## Component names and focus mode

**Canonical names:** Navigator (left panel), Inspector (right panel), Editor (centre), Toolbar (top bar), Focus mode (both panels hidden simultaneously).

Individual panel collapse was removed — it caused the collapse icon to vanish (nowhere to put it when the panel is hidden) and the Navigator to expand in width. There is now only one toggle: **Focus mode**, which hides both Navigator and Inspector at once.

`toggleZenMode()` sets `zenMode = true` and calls `editor.hidePanel` on both sides. On re-toggle it calls `showLeftPanel()` and `showAttributesPanel()` to restore. `onPageLoaded` skips rendering when `zenMode` is true. State resets on plug reload. Trigger: `Ctrl-Alt-z`, `Path: Toggle focus mode`, or the **columns** icon in the Toolbar.

## Onboarding page

`space/Getting started.md` — a readonly page that calls `onboardingStatus()` from CONFIG.md. Six live checks: profile filled (full_name + job_title), framework installed (`_system/installed-frameworks` has a `slug:` entry), active path exists, first CPD logged, first reflection written, first claim written. Rendered as `widget.html` with a progress bar and step cards. Linked from the Navigator Workspace section. The full interface reference is `manual/interface.md` (Navigator, Inspector, Editor, Toolbar, Focus mode; keyboard shortcuts).

**Launch redirect logic** (`onPageLoaded` in `path.ts`): on fresh install (`_system/onboarding` absent), redirects to Getting started once and immediately writes `redirect: false` to that file. Subsequent sessions read the file and skip. `onboardingChecked` session flag prevents re-checking on in-session navigations. `Path: Dismiss launch redirect` writes `redirect: false`; `Path: Re-enable launch redirect` writes `redirect: true`.

## Gap navigation

`pathGaps(slug, criteria)` in CONFIG.md now outputs wikilinks for each criterion code (e.g. `[[criteria/uol-1-1|1.1]]` instead of `**1.1**`). It looks up the path's `framework` field, queries criterion pages by `type == "criterion" and framework == X`, and builds a code→page map via the local `criterion_page_map(framework)` helper. The heatmap above the gap list stays unchanged (widget.html with indigo colour scale); the gap list below is the navigation surface.

## Distribution checklist (for v0.1)

What's needed before this can be cloned and run on someone else's machine:

1. Replace hardcoded `SB_USER` with an env var; document setup.
2. Strip personal data from `space/`; ship a clean starter pack.
3. Bake `path.plug.js` into the SB image (or commit pre-built into the repo).
4. Publish `pandoc-svc` image to a registry so users `pull` instead of `build`.
5. README with first-run steps.
6. ~~Encode at least HCPC standards as the bundled framework.~~ — done; framework registry at github.com/michael-rowe/path-frameworks ships HCPC + AdvanceHE D4. New users run `Path: Add framework` after install.
7. (Optional) docker-compose `plug-builder` service for contributors who don't have Node.

Image size at install: **~1.7 GB** total (silverbullet ~150 MB + pandoc-svc ~1.5 GB; texlive is the bulk). First-time download is ~700 MB–1 GB compressed.

## Update conventions for this file

When you change the architecture, update the relevant section. When you discover a new gotcha, add it to *SB panel API gotchas* or a new subsection. Keep this file under ~250 lines — anything longer signals it's drifting into project-doc territory and should move to the planning project file instead.
