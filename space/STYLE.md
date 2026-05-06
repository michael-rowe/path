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

/* ============ Coverage heatmap (path dashboards) ============ */

.ph-table {
  border-collapse: separate;
  border-spacing: 4px;
  font-size: 0.95em;
  margin: 0.6em 0 0.3em;
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
