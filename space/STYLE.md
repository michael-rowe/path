Custom styles for Path. Edit the `space-style` block below; reload (or run `System: Reload`) to apply.

```space-style
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

:root {
  --editor-font: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif !important;
}

/* ============ Body / typography ============ */

.cm-content, .cm-editor {
  font-family: var(--editor-font);
  font-size: 14.5px;
  line-height: 1.6;
}

/* Toolbar: fixed to full viewport. The ghost .panel spacers inside #sb-top
   mirror the Navigator/Inspector widths — we hide them since the toolbar
   is now independent of the panel layout. */
#sb-top {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  z-index: 150;
}

#sb-top > .panel {
  display: none !important;
}

/* Hide the page title (a CodeMirror mini-editor, not a plain input). */
#sb-current-page,
.sb-page-prefix {
  display: none !important;
}

/* Centre the action buttons in the viewport using fixed positioning.
   position:fixed takes them out of the flex flow entirely, so they sit
   at exactly 50% regardless of ghost panels or .main width. */
#sb-top .sb-actions {
  position: fixed !important;
  top: 0 !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  height: 44px !important;
  display: flex !important;
  align-items: center !important;
  z-index: 151 !important;
}

/* Push the main layout (Navigator + Editor + Inspector) below the toolbar. */
#sb-top + * {
  margin-top: 44px !important;
}

/* ============ Frontmatter — hidden; edit via the Inspector ============ */

/* Hide the YAML body — the right-hand "Page attributes" panel is the
   editing surface. Save flows write the YAML back to disk; the file on
   disk is unchanged, just visually suppressed in the editor. */
.sb-frontmatter {
  display: none !important;
}

/* Keep the marker line as a small label so users still know there's
   metadata they can edit in the panel. */
.sb-frontmatter-marker {
  font-size: 0 !important;
}
.sb-frontmatter-marker::after {
  content: "Page attributes — edit in the Inspector (right panel)";
  font-size: 11px;
  font-style: italic;
  opacity: 0.55;
  display: block;
  padding: 0.3em 0.6em;
}

/* ============ Admonitions ============ */

.sb-admonition {
  margin: 1.6em 0 !important;
  border-radius: 10px !important;
  padding: 0.85em 1.1em !important;
}

/* Custom admonition: 'tip' — uses a friendly teal */
.sb-admonition[admonition="tip" i] {
  --admonition-color: #2f8a5d;
}

/* ============ Wiki links — modern, borderless ============ */

.sb-wiki-link {
  border: none !important;
  background: none !important;
  padding: 0 !important;
  margin: 0 !important;
  color: #2563eb;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.12s, color 0.12s;
}

.sb-wiki-link:hover {
  color: #1d4ed8;
  border-bottom-color: currentColor;
}

html[data-theme="dark"] .sb-wiki-link {
  color: #60a5fa;
}
html[data-theme="dark"] .sb-wiki-link:hover {
  color: #93c5fd;
}


.cm-content ul li {
  margin: 0.3em 0;
}

/* Task lines: drop the list bullet — the checkbox is the marker.
   The editor view uses a span.cm-list-bullet; widget-rendered HTML
   (e.g. dashboard task list) renders bullets via a `::before` pseudo
   on each `<li>`. Override both. */
.cm-line.sb-line-task .cm-list-bullet {
  visibility: hidden;
}
#sb-main .cm-editor .sb-lua-directive-block ul li:has(input[type="checkbox"])::before,
#sb-main .cm-editor .sb-lua-directive-inline ul li:has(input[type="checkbox"])::before,
#sb-main .cm-editor .sb-lua-directive-block ul li:has(span[data-external-task-ref])::before,
#sb-main .cm-editor .sb-lua-directive-inline ul li:has(span[data-external-task-ref])::before {
  content: none !important;
  display: none !important;
}

/* ============ Active Paths overview table (dashboard) ============ */

.path-overview {
  border-collapse: collapse;
  margin: 0.6em 0;
  font-size: 0.95em;
}
.path-overview th,
.path-overview td {
  padding: 8px 14px;
  text-align: left;
  vertical-align: middle;
}
/* Top-left corner cell — invisible but holds layout */
.path-overview .path-overview-corner {
  background: transparent;
  border-bottom: 1px solid #e0e7ff;
}
/* Header row (path links) — light indigo wash + indigo bottom border */
.path-overview .path-overview-head {
  background: #eef2ff;
  border-bottom: 2px solid #c7d2fe;
  font-weight: 600;
  font-size: 0.92em;
}
.path-overview .path-overview-head a {
  color: #4338ca;
  text-decoration: none;
}
.path-overview .path-overview-head a:hover {
  color: #312e81;
  text-decoration: underline;
}
/* Left column (metric labels) — same wash but vertical */
.path-overview .path-overview-label {
  background: #eef2ff;
  font-weight: 500;
  font-size: 0.88em;
  color: #4338ca;
  border-right: 2px solid #c7d2fe;
  width: 1%;
  white-space: nowrap;
}
.path-overview .path-overview-value {
  font-size: 0.95em;
  color: inherit;
  border-bottom: 1px solid rgba(199, 210, 254, 0.4);
}
.path-overview tr:last-child .path-overview-value {
  border-bottom: none;
}

/* Dark-mode variants */
html[data-theme="dark"] .path-overview .path-overview-head {
  background: rgba(79, 70, 229, 0.12);
  border-bottom-color: rgba(165, 180, 252, 0.3);
}
html[data-theme="dark"] .path-overview .path-overview-head a {
  color: #c7d2fe;
}
html[data-theme="dark"] .path-overview .path-overview-head a:hover {
  color: #e0e7ff;
}
html[data-theme="dark"] .path-overview .path-overview-label {
  background: rgba(79, 70, 229, 0.12);
  color: #c7d2fe;
  border-right-color: rgba(165, 180, 252, 0.3);
}
html[data-theme="dark"] .path-overview .path-overview-value {
  border-bottom-color: rgba(99, 102, 241, 0.15);
}
html[data-theme="dark"] .path-overview .path-overview-corner {
  border-bottom-color: rgba(99, 102, 241, 0.15);
}

/* ============ Subtle indigo accents across the site ============ */

/* H1 gets a thin indigo accent bar — matches the path logo / heatmap */
#sb-main .cm-editor .cm-line.sb-line-h1::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 0.85em;
  background: #4f46e5;
  border-radius: 2px;
  margin-right: 0.55em;
  vertical-align: -0.05em;
  opacity: 0.85;
}
html[data-theme="dark"] #sb-main .cm-editor .cm-line.sb-line-h1::before {
  background: #818cf8;
}

/* Blockquotes get a thicker indigo left border */
#sb-main .cm-editor .cm-line.sb-line-blockquote {
  border-left: 3px solid #c7d2fe !important;
  padding-left: 0.6em !important;
}
html[data-theme="dark"] #sb-main .cm-editor .cm-line.sb-line-blockquote {
  border-left-color: rgba(165, 180, 252, 0.4) !important;
}

/* H2 gets a thin indigo underline — gives manual pages and dashboards
   visual rhythm between sections without dominating */
#sb-main .cm-editor .cm-line.sb-line-h2 {
  border-bottom: 1px solid rgba(199, 210, 254, 0.55);
  padding-bottom: 0.18em !important;
  margin-bottom: 0.25em !important;
}
html[data-theme="dark"] #sb-main .cm-editor .cm-line.sb-line-h2 {
  border-bottom-color: rgba(99, 102, 241, 0.25);
}

/* Tip admonition uses indigo by default (other variants kept) */
.sb-admonition[admonition="tip" i],
.sb-admonition[admonition="note" i] {
  --admonition-color: #4f46e5;
  background: rgba(238, 242, 255, 0.5) !important;
  border: 1px solid rgba(199, 210, 254, 0.7) !important;
}
html[data-theme="dark"] .sb-admonition[admonition="tip" i],
html[data-theme="dark"] .sb-admonition[admonition="note" i] {
  background: rgba(79, 70, 229, 0.08) !important;
  border-color: rgba(165, 180, 252, 0.2) !important;
}

/* Admonition content inline with the type label — no line break
   between "**tip** Title" and the body text. The .sb-admonition-title
   element wraps the type tag; making it inline-flex with
   align-items: baseline collapses the visual break. */
.sb-admonition .sb-admonition-title {
  display: inline !important;
  margin-right: 0.4em !important;
}
.sb-admonition .sb-admonition-title + p,
.sb-admonition p:first-of-type {
  display: inline !important;
}

/* Tables: light-purple header row only, wrap long content rather than overflowing.
   Selectors include `#sb-main .cm-editor` to beat SB core's white-space: nowrap rule
   (`#sb-main .cm-editor th, #sb-main .cm-editor td { white-space: nowrap }`).
   `.sb-table-widget` is the SB wrapper that defaults to overflow: auto — flatten it
   so long cells wrap instead of producing a horizontal scrollbar. */
:root {
  --editor-table-head-background-color: #ddd6fe;
  --editor-table-head-color: #312e81;
}
html[data-theme="dark"] {
  --editor-table-head-background-color: #3730a3;
  --editor-table-head-color: #ffffff;
}
#sb-main .cm-editor .sb-table-widget,
.sb-lua-wrapper .sb-table-widget {
  overflow: visible !important;
}
#sb-main .cm-editor table,
.sb-lua-wrapper table {
  width: 100% !important;
  max-width: 100% !important;
  table-layout: fixed !important;
}
#sb-main .cm-editor table thead tr,
.sb-lua-wrapper table thead tr {
  background-color: var(--editor-table-head-background-color) !important;
  color: var(--editor-table-head-color) !important;
}
#sb-main .cm-editor table thead th,
.sb-lua-wrapper table thead th {
  color: var(--editor-table-head-color) !important;
}
#sb-main .cm-editor table td,
#sb-main .cm-editor table th,
.sb-lua-wrapper table td,
.sb-lua-wrapper table th {
  white-space: normal !important;
  overflow-wrap: anywhere !important;
  word-break: break-word !important;
  vertical-align: top;
}

/* Inline code gets a faint indigo tint */
#sb-main .cm-editor .sb-code {
  background: rgba(238, 242, 255, 0.6);
  color: #312e81;
  padding: 0.05em 0.35em;
  border-radius: 3px;
  font-size: 0.9em;
}
html[data-theme="dark"] #sb-main .cm-editor .sb-code {
  background: rgba(79, 70, 229, 0.12);
  color: #c7d2fe;
}

/* ============ Coverage heatmap (path dashboards) ============ */

.ph-table {
  border-collapse: separate;
  border-spacing: 4px;
  font-size: 0.95em;
  margin: 0.6em 0 0.3em;
  table-layout: fixed;
  width: 100%;
}
.ph-table th {
  text-align: left;
  padding: 6px 14px;
  font-size: 0.78em;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: inherit;
  opacity: 0.6;
  font-weight: 600;
}
.ph-table th.ph-num { text-align: center; }

/* Criterion label column: inherit page text colour so it works in both themes */
.ph-label {
  padding: 6px 14px;
  font-weight: 500;
  color: inherit;
}

/* Cells: indigo single-hue scale */
.ph-cell {
  text-align: center;
  padding: 6px 14px;
  font-weight: 500;
  border-radius: 4px;
  color: #111827;
}
.ph-cell.ph-0 {
  background: transparent;
  border: 1px dashed rgba(99, 102, 241, 0.35);
  color: rgba(0, 0, 0, 0.35);
  font-weight: 400;
}
.ph-cell.ph-1 { background: #eef2ff; }
.ph-cell.ph-2 { background: #c7d2fe; }
.ph-cell.ph-3 { background: #a5b4fc; }
.ph-cell.ph-4 { background: #818cf8; color: white; }
.ph-cell.ph-5 { background: #4f46e5; color: white; }

/* Dark mode: same hue, deeper shades; light text on filled cells */
html[data-theme="dark"] .ph-cell {
  color: #e2e8f0;
}
html[data-theme="dark"] .ph-cell.ph-0 {
  border-color: rgba(165, 180, 252, 0.25);
  color: rgba(226, 232, 240, 0.4);
  background: transparent;
}
html[data-theme="dark"] .ph-cell.ph-1 { background: #1e1b4b; color: #c7d2fe; }
html[data-theme="dark"] .ph-cell.ph-2 { background: #312e81; color: #c7d2fe; }
html[data-theme="dark"] .ph-cell.ph-3 { background: #3730a3; color: white; }
html[data-theme="dark"] .ph-cell.ph-4 { background: #4338ca; color: white; }
html[data-theme="dark"] .ph-cell.ph-5 { background: #4f46e5; color: white; }

/* ============ Task list checkboxes — theme-aware accent colour ============ */

input[type="checkbox"] {
  accent-color: #4f46e5;
  width: 1.05em;
  height: 1.05em;
  cursor: default;
}
html[data-theme="dark"] input[type="checkbox"] {
  accent-color: #818cf8;
}

/* ============ View-only badge + editor lock — shown on readonly pages ============ */

/* Hide blinking cursor on readonly pages. forcedROMode prevents typing but
   doesn't suppress the cursor visually. */
html[data-path-readonly="true"] .cm-cursor,
html[data-path-readonly="true"] .cm-cursorLayer {
  display: none !important;
}

/* Hide the markdown `#` prefix when a click puts a heading line into
   source mode (CM adds .sb-header-inside; the `#` chars get class
   .sb-meta inside that line). The line itself may shift slightly
   because SB's compensating text-indent assumes the prefix is visible
   — that's a known cosmetic limitation we've accepted. */
html[data-path-readonly="true"] .sb-header-inside .sb-meta {
  display: none !important;
}

/* Hide widget hover-action buttons (refresh / copy / edit icons SB
   overlays on rendered query result items via .button-bar with
   <button data-button="reload|copy|edit">). View-only pages don't
   need edit affordances, and the edit button reveals source. */
html[data-path-readonly="true"] .cm-content .button-bar,
html[data-path-readonly="true"] .cm-content button[data-button],
html[data-path-readonly="true"] .cm-content button[data-onclick],
html[data-path-readonly="true"] .cm-content .sb-code-copy-button {
  display: none !important;
}

html[data-path-readonly="true"] #sb-top::after {
  content: "View only";
  position: fixed;
  top: 0;
  right: 0;
  height: 44px;
  line-height: 44px;
  padding: 0 16px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(99, 102, 241, 0.65);
  z-index: 152;
  pointer-events: none;
}

/* ============ Light/dark toggle — swap visible button ============ */

button[title*="Toggle light mode" i],
button[aria-label*="Toggle light mode" i] {
  display: none !important;
}

html[data-theme="dark"] button[title*="Toggle dark mode" i],
html[data-theme="dark"] button[aria-label*="Toggle dark mode" i] {
  display: none !important;
}
html[data-theme="dark"] button[title*="Toggle light mode" i],
html[data-theme="dark"] button[aria-label*="Toggle light mode" i] {
  display: inline-flex !important;
}
```
