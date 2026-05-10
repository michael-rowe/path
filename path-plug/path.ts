import {
  editor,
  index as indexApi,
  lua,
  space,
  system,
} from "@silverbulletmd/silverbullet/syscalls";

// Session-level panel state. zenMode persists across navigations;
// leftHidden/rightHidden track individual collapses (reset on navigation).
let zenMode = false;
// Set to true after the first onPageLoaded fires so the launch redirect
// only runs once per session, leaving the user free to navigate afterwards.
let onboardingChecked = false;
// Set to true after the first onPageLoaded fetches the announcements feed,
// so we don't hammer the registry on every in-session navigation.
let announcementsRefreshed = false;

// Keys hidden from the panel UI. They still round-trip in the file —
// we just don't render or expose them. `title` is hidden because the H1 in
// the page body is the human title; the YAML `title:` is only kept for
// queries that haven't been migrated yet.
const SKIP_KEYS = new Set([
  "tags",
  "itags",
  "asTag",
  "lastModified",
  "pageDecoration",
  "title",
]);

const PRETTY_KEYS: Record<string, string> = {
  full_name: "Full name",
  job_title: "Job title",
  activity_type: "Activity type",
  claim_type: "Claim type",
  last_updated: "Last updated",
  reflection_brief: "Reflection brief",
  post_nominals: "Post-nominals",
  preferred_name: "Preferred name",
  relationship_type: "Relationship",
  shared_interests: "Shared interests",
  met_via: "Met via",
  introduction_from: "Introduction from",
  last_contact: "Last contact",
  next_contact: "Next contact",
  credential_type: "Credential type",
  badge_url: "Badge URL",
  badge_image: "Badge image",
  verification_url: "Verification URL",
  award_date: "Award date",
  file_type: "File type",
  related_cpd: "Related CPD",
  related_claims: "Related claims",
};

const FIELD_HINTS: Record<string, string> = {
  framework: "e.g. UoL-TSPP-Professor",
  hours: "decimal number",
  date: "YYYY-MM-DD",
  last_updated: "YYYY-MM-DD",
  path: "slug of a Path page (e.g. uol-professor)",
  paths: "Path slugs this contributes to (e.g. uol-professor, advance-he-d4)",
  standard: "code from the framework (e.g. 1.1)",
  evidence: "[[wikilinks]] to evidence pages",
  standards: "criterion codes from the Path's framework that this addresses (e.g. 1.1, 2.3)",
  related_cpd: "[[wikilinks]] to CPD entries this evidence supports",
  related_claims: "[[wikilinks]] to claims this evidence supports",
  orcid: "URL or 0000-0000-0000-0000",
  scholar: "Google Scholar profile URL",
  linkedin: "LinkedIn profile URL",
  github: "GitHub username or URL",
  mastodon: "@user@instance",
  pronouns: "e.g. she/her, they/them",
  expertise: "comma-separated tags, e.g. AI-education, qualitative-research",
  shared_interests: "comma-separated topics you both care about",
  met_via: "e.g. AMEE-2024, introduction-from-X, professional-body",
};

// Enum values for fields that have a fixed set of valid options.
// Rendered as <select> dropdowns instead of free-text inputs.
const STATUS_ENUMS: Record<string, string[]> = {
  "cpd-claim": ["draft", "ready", "published"],
  "cpd": ["draft", "complete"],
  "capture": ["unprocessed", "processed"],
  "path": ["active", "planned", "paused", "completed", "abandoned"],
  "personal-statement": ["draft", "ready"],
  "contact": ["active", "occasional", "dormant", "former"],
  "milestone": ["planned", "reached", "missed"],
};

const FIELD_ENUMS: Record<string, string[]> = {
  claim_type: ["evidence", "forward-looking"],
  activity_type: ["conference", "course", "workshop", "project", "teaching", "supervision", "reading", "writing", "other"],
  relationship_type: ["collaborator", "mentor", "mentee", "peer", "senior-colleague", "conference-contact", "professional-body", "student", "other"],
  credential_type: ["open-badge", "certification", "degree", "fellowship", "membership", "other"],
  file_type: ["pdf", "image", "email", "video", "web", "other"],
};

function getEnumOptions(key: string, pageType: string): string[] | null {
  if (key === "status") return STATUS_ENUMS[pageType] ?? null;
  // `framework` on reflection pages is the reflection model, not the standards framework
  if (key === "framework" && pageType === "reflection") {
    return ["gibbs", "era", "driscoll", "rolfe"];
  }
  return FIELD_ENUMS[key] ?? null;
}

interface Field {
  key: string;
  value: string | string[];
  isList: boolean;
  // Complex fields (list of objects, multiline blocks) are preserved
  // verbatim — we hide them from the form and round-trip the raw text.
  complex?: boolean;
  raw?: string;
}

interface ParsedPage {
  fields: Field[];
  rest: string;
  fmStart: number;
  fmEnd: number;
}

function stripQuotes(s: string): string {
  const t = s.trim();
  if (t.length >= 2) {
    if (t.startsWith('"') && t.endsWith('"')) return t.slice(1, -1);
    if (t.startsWith("'") && t.endsWith("'")) return t.slice(1, -1);
  }
  return t;
}

// Parse the YAML frontmatter into block-shaped fields. Each block has a
// top-level `key:` line and optionally indented continuation lines.
// Continuation that's purely `- "value"` items is treated as a simple list;
// anything richer (nested keys) is marked `complex` and round-tripped raw.
function parseFrontmatter(text: string): ParsedPage | null {
  if (!text.startsWith("---\n") && !text.startsWith("---\r\n")) return null;
  const fmStart = text.indexOf("\n") + 1;
  const closeIdx = text.indexOf("\n---", fmStart);
  if (closeIdx < 0) return null;
  const fmText = text.substring(fmStart, closeIdx);
  let restStart = closeIdx + 4;
  if (text[restStart] === "\n") restStart++;

  interface Block {
    key: string;
    headerValue: string;
    cont: string[];
  }
  const blocks: Block[] = [];
  let cur: Block | null = null;

  for (const rawLine of fmText.split("\n")) {
    const trimmed = rawLine.trim();
    // Comments and blank lines: keep them inside the current block as
    // raw continuation. Outside any block they're simply dropped.
    if (trimmed === "" || trimmed.startsWith("#")) {
      if (cur) cur.cont.push(rawLine);
      continue;
    }
    // A new top-level key starts only at column 0.
    if (!rawLine.startsWith(" ") && !rawLine.startsWith("\t")) {
      const m = rawLine.match(/^([\w-]+):\s*(.*)$/);
      if (m) {
        if (cur) blocks.push(cur);
        cur = { key: m[1], headerValue: m[2], cont: [] };
        continue;
      }
    }
    if (cur) cur.cont.push(rawLine);
  }
  if (cur) blocks.push(cur);

  const fields: Field[] = [];
  for (const b of blocks) {
    if (b.headerValue.trim() !== "") {
      fields.push({
        key: b.key,
        value: stripQuotes(b.headerValue),
        isList: false,
      });
      continue;
    }
    // No header value → potentially a list block.
    const realLines = b.cont.filter(
      (l) => l.trim() !== "" && !l.trim().startsWith("#"),
    );
    if (realLines.length === 0) {
      fields.push({ key: b.key, value: [], isList: true });
      continue;
    }
    // Simple list: every real line matches `<indent>- <scalar>`.
    const simpleListRe = /^(\s+)-\s+(.*)$/;
    const allSimple = realLines.every((l) => {
      const m = l.match(simpleListRe);
      if (!m) return false;
      // The scalar must not contain a colon followed by space (object key).
      return !/:\s/.test(m[2]);
    });
    if (allSimple) {
      const items = realLines.map((l) =>
        stripQuotes(l.match(simpleListRe)![2])
      );
      fields.push({ key: b.key, value: items, isList: true });
    } else {
      fields.push({
        key: b.key,
        value: [],
        isList: true,
        complex: true,
        raw: b.cont.join("\n"),
      });
    }
  }

  return { fields, rest: text.substring(restStart), fmStart, fmEnd: closeIdx };
}

function prettyKey(k: string): string {
  if (PRETTY_KEYS[k]) return PRETTY_KEYS[k];
  const s = k.replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function yamlScalar(v: string): string {
  const needsQuote = v === "" || /[:#"'\n]/.test(v) || /^\s|\s$/.test(v);
  if (!needsQuote) return v;
  return `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function serializeFields(
  originalFields: Field[],
  edits: Record<string, string>,
): string {
  const lines: string[] = [];
  for (const f of originalFields) {
    // Complex blocks: emit the raw text we captured at parse time. This
    // round-trips qualifications, registrations, and any other nested-
    // object YAML byte-for-byte without us needing to understand them.
    if (f.complex) {
      lines.push(`${f.key}:`);
      if (f.raw) lines.push(f.raw);
      continue;
    }

    const isManaged = !SKIP_KEYS.has(f.key) && f.key !== "type";

    if (!isManaged) {
      if (f.isList) {
        lines.push(`${f.key}:`);
        for (const item of f.value as string[]) {
          lines.push(`  - ${yamlScalar(item)}`);
        }
      } else {
        lines.push(`${f.key}: ${yamlScalar(f.value as string)}`);
      }
      continue;
    }

    const newVal = edits[f.key] ?? "";
    if (f.isList) {
      const items = newVal
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      lines.push(`${f.key}:`);
      for (const it of items) {
        lines.push(`  - ${yamlScalar(it)}`);
      }
    } else {
      lines.push(`${f.key}: ${yamlScalar(newVal.trim())}`);
    }
  }
  return lines.join("\n");
}

interface Mention {
  ref: string;
  pageName: string;
}

// Strip a path prefix and any leading YYYY-MM-DD- date stamp, then
// title-case word separators. `manual/interface` -> "Interface";
// `cpd/2026-05-07-prs-conference` -> "Prs Conference".
function mentionDisplayName(pageName: string): string {
  const last = pageName.split("/").pop() || pageName;
  const stripped = last.replace(/^\d{4}-\d{2}-\d{2}-?/, "") || last;
  return stripped
    .replace(/[-_]/g, " ")
    .replace(/\b(\p{L})/gu, (c) => c.toUpperCase());
}

// Lookup all installed Paths (excluding the `*-coverage` dashboard
// pages). Used to populate the multi-select for `paths` fields.
async function fetchAllPaths(): Promise<
  { slug: string; title: string; framework: string }[]
> {
  try {
    const where = await lua.parseExpression('p.type == "path"');
    // deno-lint-ignore no-explicit-any
    const rows = (await indexApi.queryLuaObjects<any>("page", {
      objectVariable: "p",
      where,
    })) ?? [];
    const out: { slug: string; title: string; framework: string }[] = [];
    for (const r of rows) {
      const name = (r?.name as string) ?? "";
      const slug = name.replace(/^paths\//, "");
      if (!slug || slug.endsWith("-coverage")) continue;
      out.push({
        slug,
        title: (r?.title as string) || slug,
        framework: (r?.framework as string) || "",
      });
    }
    out.sort((a, b) => a.title.localeCompare(b.title));
    return out;
  } catch (e) {
    console.error("fetchAllPaths failed", e);
    return [];
  }
}

// Criteria of a given framework, used to populate the multi-select for
// `standards` fields. Sorted by code so 1.1, 1.2, ..., 4.2 stay in order.
async function fetchCriteriaForFramework(
  framework: string,
): Promise<{ code: string; title: string }[]> {
  if (!framework) return [];
  try {
    const where = await lua.parseExpression(
      'c.type == "criterion" and c.framework == framework',
    );
    // deno-lint-ignore no-explicit-any
    const rows = (await indexApi.queryLuaObjects<any>(
      "page",
      { objectVariable: "c", where },
      { framework },
    )) ?? [];
    const out: { code: string; title: string }[] = [];
    for (const r of rows) {
      const code = (r?.code as string) || "";
      if (!code) continue;
      out.push({ code, title: (r?.title as string) || "" });
    }
    out.sort((a, b) => a.code.localeCompare(b.code));
    return out;
  } catch (e) {
    console.error("fetchCriteriaForFramework failed", e);
    return [];
  }
}

async function fetchLinkedMentions(pageName: string): Promise<Mention[]> {
  try {
    const where = await lua.parseExpression(
      "l.page ~= pageName and l.toPage == pageName",
    );
    const orderExpr = await lua.parseExpression("l.pageLastModified");
    // deno-lint-ignore no-explicit-any
    const rows = (await indexApi.queryLuaObjects<any>(
      "link",
      {
        objectVariable: "l",
        where,
        orderBy: [{ expr: orderExpr, desc: true }],
        limit: 50,
      },
      { pageName },
    )) ?? [];
    const seen = new Set<string>();
    const out: Mention[] = [];
    for (const r of rows) {
      const p = r?.page ?? "";
      if (!p || seen.has(p)) continue;
      seen.add(p);
      out.push({
        ref: r?.ref ?? p,
        pageName: p,
      });
    }
    return out;
  } catch (e) {
    console.error("fetchLinkedMentions failed", e);
    return [];
  }
}

interface MultiSelectData {
  allPaths: { slug: string; title: string; framework: string }[];
  criteria: { code: string; title: string }[];
}

function buildPanelContent(
  pageName: string,
  fields: Field[],
  toc: TocItem[] = [],
  mentions: Mention[] = [],
  isReadonly: boolean = false,
  multiSelect: MultiSelectData = { allPaths: [], criteria: [] },
  focusSearch: boolean = false,
): { html: string; script: string } {
  const rowsHtml: string[] = [];
  const editableDescs: { key: string; list: boolean }[] = [];

  // Needed to resolve context-dependent enums (e.g. `status` differs per type).
  const pageType = (fields.find((f) => f.key === "type")?.value ?? "") as string;

  for (const f of fields) {
    if (SKIP_KEYS.has(f.key)) continue;
    // Complex YAML (nested objects) is preserved on disk but not editable
    // in the panel — those fields are better restructured into page
    // sections. Hide them silently.
    if (f.complex) continue;

    if (f.key === "type") {
      rowsHtml.push(
        `<div class="row"><div class="k">Type</div><div class="v"><span class="badge">${
          escapeHtml(f.value as string)
        }</span></div></div>`,
      );
      continue;
    }

    const valStr = f.isList
      ? (f.value as string[]).join(", ")
      : (f.value as string);

    // Multi-select for list fields driven by an enum:
    //   `paths`     — checkbox list of all installed Path titles.
    //   `standards` — checkbox list of criteria from the relevant
    //                  framework (looked up via the page's path).
    // Falls back to plain comma-separated input if no options data is
    // available (e.g. no Paths installed yet). Stores the comma-joined
    // value in a hidden input so the existing save flow works unchanged.
    if (f.isList && (f.key === "paths" || f.key === "standards")) {
      const opts: { value: string; label: string }[] =
        f.key === "paths"
          ? multiSelect.allPaths.map((p) => ({ value: p.slug, label: p.title }))
          : multiSelect.criteria.map((c) => ({
            value: c.code,
            label: c.title ? `${c.code} — ${c.title}` : c.code,
          }));
      if (opts.length > 0) {
        const label = escapeHtml(prettyKey(f.key));
        const valList = (f.value as string[]).filter((v) => v && v.trim());
        const valSet = new Set(valList);
        const hiddenVal = valList.join(",");
        const optsHtml = opts.map((opt) =>
          `<label class="multi-opt">
            <input type="checkbox" data-multi-key="${escapeHtml(f.key)}" value="${escapeHtml(opt.value)}"${
            valSet.has(opt.value) ? " checked" : ""
          }>
            <span class="multi-opt-label">${escapeHtml(opt.label)}</span>
          </label>`
        ).join("");
        rowsHtml.push(
          `<div class="row"><div class="k">${label}</div>` +
            `<input type="hidden" id="f-${f.key}" data-key="${f.key}" value="${escapeHtml(hiddenVal)}">` +
            `<div class="multi-list">${optsHtml}</div></div>`,
        );
        editableDescs.push({ key: f.key, list: f.isList });
        continue;
      }
    }

    const enumOpts = getEnumOptions(f.key, pageType);

    if (enumOpts) {
      // Render a <select> dropdown for fields with a fixed set of valid values.
      const label = escapeHtml(prettyKey(f.key));
      const optionsHtml = ['<option value="">—</option>',
        ...enumOpts.map((v) =>
          `<option value="${escapeHtml(v)}"${
            valStr === v ? " selected" : ""
          }>${escapeHtml(v)}</option>`
        ),
      ].join("");
      rowsHtml.push(
        `<div class="row"><label class="k" for="f-${f.key}">${label}</label>` +
          `<select class="field" id="f-${f.key}" data-key="${f.key}">${optionsHtml}</select></div>`,
      );
    } else {
      const label = escapeHtml(prettyKey(f.key)) +
        (f.isList ? ' <span class="hint">(comma-separated)</span>' : "");
      const fieldHint = FIELD_HINTS[f.key];
      const hintHtml = fieldHint
        ? `<div class="field-hint">${escapeHtml(fieldHint)}</div>`
        : "";
      rowsHtml.push(
        `<div class="row"><label class="k" for="f-${f.key}">${label}</label>` +
          `<input class="field" id="f-${f.key}" data-key="${f.key}" value="${
            escapeHtml(valStr)
          }">${hintHtml}</div>`,
      );
    }

    editableDescs.push({ key: f.key, list: f.isList });
  }

  const searchBody = `
    <details class="section" data-section="search" id="section-search">
      <summary class="section-summary">
        <h2>Search portfolio</h2>
        <span class="chev" aria-hidden="true">▾</span>
      </summary>
      <div class="section-body">
        <input type="text" id="search-input" class="field" placeholder="Search..." autocomplete="off">
        <div id="search-results" class="search-results"></div>
      </div>
    </details>`;

  const attrsBody = fields.length === 0 || rowsHtml.length === 0
    ? ""
    : `
    <details class="section" data-section="attrs">
      <summary class="section-summary">
        <h2>Page attributes</h2>
        <span class="chev" aria-hidden="true">▾</span>
      </summary>
      <div class="section-body">
        <div class="section-actions"><button class="btn" id="btn-save">Save</button></div>
        <div class="attrs">${rowsHtml.join("")}</div>
      </div>
    </details>`;

  const tocBody = buildTocHtml(toc);

  const mentionsBody = mentions.length === 0
    ? ""
    : `
    <details class="section" data-section="mentions">
      <summary class="section-summary">
        <h2>Linked mentions <span class="count">${mentions.length}</span></h2>
        <span class="chev" aria-hidden="true">▾</span>
      </summary>
      <div class="section-body">
        <ul class="mentions">${
      mentions.map((m) =>
        `<li class="mention" data-page="${
          escapeHtml(m.pageName)
        }"><div class="mention-ref">${
          escapeHtml(mentionDisplayName(m.pageName))
        }</div></li>`
      ).join("")
    }</ul>
      </div>
    </details>`;

  // "Delete this page" lives at the bottom. Hidden on readonly pages —
  // a user editing a manual page should remove `readonly: true` first,
  // which is a deliberate choice to prevent accidents.
  const dangerBody = isReadonly
    ? ""
    : `
    <div class="section section-danger">
      <button class="btn-danger" id="btn-delete" type="button">Delete this page</button>
    </div>`;

  const html = `
<style>
  html, body { margin: 0; padding: 0; }
  html { background: #f8fafc; }
  body { font-family: Inter, system-ui, -apple-system, sans-serif; font-size: 15px; background: #f8fafc; margin: 0; padding: 0; }
  * { box-sizing: border-box; }
  .panel { padding: 1.3em 1.1em; color: #1f2937; }
  .section { margin-bottom: 1.4em; }
  .section:last-child { margin-bottom: 0; }
  .section > summary { list-style: none; cursor: pointer; user-select: none; display: flex; justify-content: space-between; align-items: center; gap: 0.6em; padding: 0.25em 0; }
  .section > summary::-webkit-details-marker { display: none; }
  .section h2 { font-size: 0.74em; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; margin: 0; font-weight: 600; display: flex; align-items: center; gap: 0.5em; }
  .section .count { background: #eef2ff; color: #4338ca; border-radius: 999px; padding: 0.05em 0.55em; font-size: 0.85em; font-weight: 500; letter-spacing: 0; text-transform: none; }
  .chev { color: #9ca3af; font-size: 0.9em; transition: transform 0.15s ease; }
  .section[open] > summary .chev { transform: rotate(180deg); }
  .section-body { padding-top: 0.85em; }
  .section-actions { display: flex; justify-content: flex-end; margin-bottom: 0.7em; }
  .mentions { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5em; }
  .mention { padding: 0.45em 0.55em; border-radius: 4px; cursor: pointer; line-height: 1.4; }
  .mention:hover { background: #eef2ff; }
  .mention-ref { font-size: 0.92em; color: #2563eb; font-weight: 500; word-break: break-word; }
  .mention:hover .mention-ref { color: #1d4ed8; }
  .mention-snip { font-size: 0.82em; color: #6b7280; margin-top: 0.2em; line-height: 1.45; }
  .btn { background: #4f46e5; color: white; border: none; padding: 0.4em 0.95em; border-radius: 4px; cursor: pointer; font-size: 0.82em; font-weight: 500; font-family: inherit; }
  .btn:hover { background: #4338ca; }
  .btn:disabled { opacity: 0.5; cursor: wait; }
  .attrs { display: flex; flex-direction: column; gap: 0.95em; }
  .row { display: flex; flex-direction: column; gap: 0.3em; }
  .k { font-size: 0.72em; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; font-weight: 500; }
  .hint { text-transform: none; letter-spacing: 0; font-style: italic; opacity: 0.7; font-weight: 400; }
  .v { font-size: 0.95em; color: #111827; word-break: break-word; line-height: 1.45; }
  .field { width: 100%; padding: 0.45em 0.6em; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.92em; font-family: inherit; color: #111827; background: white; }
  .field:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 2px rgba(79,70,229,0.15); }
  select.field { cursor: pointer; }
  .field-hint { font-size: 0.74em; color: #6b7280; margin-top: 0.22em; font-style: italic; }
  .multi-list { display: flex; flex-direction: column; gap: 0.32em; padding: 0.5em 0.6em; border: 1px solid #d1d5db; border-radius: 4px; max-height: 220px; overflow-y: auto; background: white; }
  .multi-opt { display: flex; align-items: center; gap: 0.5em; cursor: pointer; line-height: 1.3; padding: 0.15em 0.1em; border-radius: 3px; }
  .multi-opt:hover { background: #eef2ff; }
  .multi-opt input[type="checkbox"] { cursor: pointer; flex-shrink: 0; accent-color: #4f46e5; }
  .multi-opt-label { font-size: 0.9em; color: #1f2937; word-break: break-word; }
  html[data-theme="dark"] .multi-list { background: #1e293b; border-color: #475569; }
  html[data-theme="dark"] .multi-opt:hover { background: rgba(79, 70, 229, 0.18); }
  html[data-theme="dark"] .multi-opt-label { color: #f1f5f9; }
  .badge { display: inline-block; background: #eef2ff; color: #4338ca; padding: 0.2em 0.65em; border-radius: 5px; font-size: 0.82em; font-weight: 500; text-transform: capitalize; letter-spacing: 0.02em; }
  .empty { color: #6b7280; font-size: 0.9em; font-style: italic; }
  .toc { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.3em; }
  .toc-item { font-size: 0.9em; color: #1f2937; cursor: pointer; padding: 0.25em 0.4em; border-radius: 3px; line-height: 1.4; }
  .toc-item:hover { background: #eef2ff; color: #3730a3; }
  html[data-theme="dark"] { background: #0f172a; }
  html[data-theme="dark"] body { background: #0f172a; }
  html[data-theme="dark"] .panel { color: #e2e8f0; }
  html[data-theme="dark"] .section h2, html[data-theme="dark"] .k { color: #94a3b8; }
  html[data-theme="dark"] .v { color: #f1f5f9; }
  html[data-theme="dark"] .badge { background: #312e81; color: #c7d2fe; }
  html[data-theme="dark"] .empty { color: #94a3b8; }
  html[data-theme="dark"] .field { background: #1e293b; border-color: #475569; color: #f1f5f9; }
  html[data-theme="dark"] select.field { background: #1e293b; color-scheme: dark; }
  html[data-theme="dark"] .field-hint { color: #94a3b8; }
  html[data-theme="dark"] .toc-item { color: #e2e8f0; }
  html[data-theme="dark"] .toc-item:hover { background: #1e293b; color: #c7d2fe; }
  html[data-theme="dark"] .chev { color: #64748b; }
  html[data-theme="dark"] .count { background: #312e81; color: #c7d2fe; }
  html[data-theme="dark"] .mention:hover { background: #1e293b; }
  html[data-theme="dark"] .mention-ref { color: #60a5fa; }
  html[data-theme="dark"] .mention:hover .mention-ref { color: #93c5fd; }
  html[data-theme="dark"] .mention-snip { color: #94a3b8; }
  .section-danger { margin-top: 2.5em; padding-top: 1.2em; border-top: 1px solid #e5e7eb; display: flex; justify-content: center; }
  .btn-danger { background: transparent; color: #b91c1c; border: 1px solid #fca5a5; padding: 0.45em 1em; border-radius: 4px; cursor: pointer; font-size: 0.85em; font-weight: 500; font-family: inherit; transition: background 0.12s, color 0.12s; }
  .btn-danger:hover { background: #fee2e2; color: #991b1b; }
  html[data-theme="dark"] .section-danger { border-top-color: #1e293b; }
  html[data-theme="dark"] .btn-danger { color: #fca5a5; border-color: #7f1d1d; }
  html[data-theme="dark"] .btn-danger:hover { background: #450a0a; color: #fecaca; }
  .search-results { display: flex; flex-direction: column; gap: 0.4em; margin-top: 0.8em; }
  .search-result { padding: 0.5em 0.6em; border-radius: 4px; cursor: pointer; line-height: 1.4; border-bottom: 1px solid rgba(128,128,128,0.1); }
  .search-result:hover { background: #eef2ff; }
  .search-result:last-child { border-bottom: none; }
  .search-title { font-size: 0.9em; font-weight: 600; color: #4f46e5; }
  .search-path { font-size: 0.72em; color: #6b7280; font-weight: 500; margin-bottom: 0.15em; }
  .search-snip { font-size: 0.82em; color: #4b5563; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .search-snip em { font-style: normal; background: rgba(79, 70, 229, 0.15); border-radius: 2px; }
  html[data-theme="dark"] .search-result:hover { background: #1e293b; }
  html[data-theme="dark"] .search-title { color: #818cf8; }
  html[data-theme="dark"] .search-path { color: #94a3b8; }
  html[data-theme="dark"] .search-snip { color: #94a3b8; }
  html[data-theme="dark"] .search-snip em { background: rgba(129, 140, 248, 0.25); }
</style>
<div id="panel" class="panel">
  ${searchBody}
  ${tocBody}
  ${attrsBody}
  ${mentionsBody}
  ${dangerBody}
</div>
`;

  // The script is eval'd in the iframe context where `syscall` is a global.
  // It must be a self-contained string passed as the 4th showPanel arg.
  const fieldsJson = JSON.stringify(editableDescs);
  const pageJson = JSON.stringify(pageName);
  const focusSearchJson = JSON.stringify(focusSearch);
  const script = `
(function() {
  var FIELDS = ${fieldsJson};
  var PAGE = ${pageJson};
  var FOCUS_SEARCH = ${focusSearchJson};

  // Sync data-theme with the parent (theme toggle changes propagate live).
  try {
    var parentHtml = window.parent.document.documentElement;
    var sync = function() {
      var theme = parentHtml.getAttribute('data-theme') || '';
      if (theme) document.documentElement.setAttribute('data-theme', theme);
      else document.documentElement.removeAttribute('data-theme');
    };
    sync();
    new MutationObserver(sync).observe(parentHtml, { attributes: true, attributeFilter: ['data-theme'] });
  } catch (e) {}

  // Search logic
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  var MEILI_URL = 'http://localhost:7700';
  var MEILI_KEY = 'masterKey123';

  if (searchInput) {
    if (FOCUS_SEARCH) {
      setTimeout(function() { searchInput.focus(); }, 100);
      // Ensure the search section is open if we are focusing it
      var searchDetails = document.querySelector('details[data-section="search"]');
      if (searchDetails) searchDetails.setAttribute('open', '');
    }

    searchInput.addEventListener('input', async function(e) {
      var query = e.target.value;
      if (!query) {
        searchResults.innerHTML = '';
        return;
      }
      try {
        var response = await fetch(MEILI_URL + '/indexes/pages/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + MEILI_KEY
          },
          body: JSON.stringify({
            q: query,
            attributesToHighlight: ['content', 'title'],
            highlightPreTag: '<em>',
            highlightPostTag: '</em>',
            limit: 8
          })
        });
        var data = await response.json();
        var hits = data.hits || [];
        searchResults.innerHTML = hits.map(function(hit) {
          var title = (hit._highlightResult && hit._highlightResult.title && hit._highlightResult.title.value) || hit.title;
          var snip = (hit._highlightResult && hit._highlightResult.content && hit._highlightResult.content.value) || (hit.content ? hit.content.substring(0, 100) : '');
          return \`
            <div class="search-result" data-path="\${hit.path}">
              <div class="search-path">\${hit.path}</div>
              <div class="search-title">\${title}</div>
              <div class="search-snip">\${snip}</div>
            </div>\`;
        }).join('');

        document.querySelectorAll('.search-result').forEach(function(el) {
          el.addEventListener('click', async function() {
            var path = el.getAttribute('data-path');
            if (path) await syscall('editor.navigate', path);
          });
        });
      } catch (err) {
        searchResults.innerHTML = '<div style="color:red;font-size:12px;padding:10px">Search failed.</div>';
      }
    });
  }

  // Multi-select checkboxes: keep the hidden input's comma-joined
  // value in sync with which boxes are ticked. The save handler reads
  // f-<key> the same way for plain inputs, dropdowns, and these.

  var saveBtn = document.getElementById('btn-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', async function() {
      saveBtn.disabled = true;
      try {
        var values = {};
        FIELDS.forEach(function(f) {
          var inp = document.getElementById('f-' + f.key);
          if (inp) values[f.key] = inp.value;
        });
        await syscall('system.invokeFunction', 'path.saveAttributes', PAGE, values);
      } catch (e) {
        var msg = (e && e.message) ? e.message : String(e);
        try { await syscall('editor.flashNotification', 'Save failed: ' + msg); } catch (_) {}
      } finally {
        saveBtn.disabled = false;
      }
    });
  }

  // ToC clicks: scroll the editor to the heading's line.
  document.querySelectorAll('.toc-item').forEach(function(el) {
    el.addEventListener('click', async function() {
      var line = parseInt(el.getAttribute('data-line'), 10);
      if (!isNaN(line)) {
        try {
          await syscall('editor.moveCursorToLine', line + 1, 0, true);
        } catch (e) {
          try { await syscall('editor.moveCursorToLine', line + 1); } catch (_) {}
        }
      }
    });
  });

  // Delete button: confirm by typing DELETE (case-insensitive), then
  // delete via syscall and navigate home. SB's space.deletePage removes
  // the file from disk; there's no trash bin, so the confirmation has
  // to be deliberate but doesn't need to be onerous.
  var deleteBtn = document.getElementById('btn-delete');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async function() {
      var typed = window.prompt(
        'Delete "' + PAGE + '"?\\n\\nType DELETE to confirm.'
      );
      if (typed === null) return;
      if (typed.trim().toUpperCase() !== 'DELETE') {
        try { await syscall('editor.flashNotification', 'Confirmation did not match — page not deleted.', 'error'); } catch (_) {}
        return;
      }
      try {
        await syscall('space.deletePage', PAGE);
        try { await syscall('editor.flashNotification', 'Page deleted.'); } catch (_) {}
        try { await syscall('editor.navigate', 'index'); } catch (_) {}
      } catch (e) {
        var msg = (e && e.message) ? e.message : String(e);
        try { await syscall('editor.flashNotification', 'Delete failed: ' + msg, 'error'); } catch (_) {}
      }
    });
  }

  // Linked-mention clicks: navigate to the mentioning page.
  document.querySelectorAll('.mention').forEach(function(el) {
    el.addEventListener('click', async function() {
      var page = el.getAttribute('data-page');
      if (page) {
        try { await syscall('editor.navigate', page); } catch (_) {}
      }
    });
  });

  // Collapsible sections: restore + persist open/closed state.
  // Default is open; an explicit "0" in storage means user collapsed it.
  function ls() { try { return window.parent.localStorage; } catch (_) { return null; } }
  document.querySelectorAll('details.section').forEach(function(d) {
    var key = 'path-section-' + d.getAttribute('data-section');
    var store = ls();
    if (store) {
      var v = store.getItem(key);
      if (v === '0') d.removeAttribute('open');
      else d.setAttribute('open', '');
    } else {
      d.setAttribute('open', '');
    }
    d.addEventListener('toggle', function() {
      var s = ls();
      if (s) s.setItem(key, d.open ? '1' : '0');
    });
  });
})();
`;

  return { html, script };
}

interface TocItem {
  level: number;
  text: string;
  line: number;
}

function extractToc(text: string): TocItem[] {
  const items: TocItem[] = [];
  // Strip frontmatter so its `---` lines aren't mistaken for headings.
  let body = text;
  let lineOffset = 0;
  if (body.startsWith("---")) {
    const close = body.indexOf("\n---", 4);
    if (close >= 0) {
      const fmEnd = close + 4;
      lineOffset = body.substring(0, fmEnd).split("\n").length;
      body = body.substring(fmEnd).replace(/^\n/, "");
    }
  }
  const lines = body.split("\n");
  let inCodeBlock = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;
    const m = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (m) {
      items.push({
        level: m[1].length,
        text: m[2].replace(/[*_`]/g, ""),
        line: lineOffset + i,
      });
    }
  }
  return items;
}

function buildTocHtml(items: TocItem[]): string {
  if (items.length === 0) return "";
  // Normalise to start at the smallest level present.
  const minLevel = Math.min(...items.map((i) => i.level));
  const liHtml = items.map((it, idx) => {
    const indent = (it.level - minLevel) * 12;
    return `<li class="toc-item" data-line="${it.line}" data-idx="${idx}" style="padding-left:${indent}px;">${
      escapeHtml(it.text)
    }</li>`;
  }).join("");
  return `
    <details class="section" data-section="toc">
      <summary class="section-summary">
        <h2>On this page</h2>
        <span class="chev" aria-hidden="true">▾</span>
      </summary>
      <div class="section-body">
        <ul class="toc">${liHtml}</ul>
      </div>
    </details>
  `;
}

export async function showAttributesPanel(focusSearch: boolean = false): Promise<void> {
  const pageName = await editor.getCurrentPage();
  if (!pageName) {
    await editor.hidePanel("rhs");
    return;
  }
  // Read from the editor buffer first — this avoids a race when a
  // brand-new page (created from a template) hasn't been written to
  // disk yet by the time pageLoaded fires. Fall back to disk read.
  let text = "";
  try {
    text = await editor.getText();
  } catch {
    text = "";
  }
  if (!text) {
    try {
      text = await space.readPage(pageName);
    } catch {
      text = "";
    }
  }
  // Race condition on fresh template instantiation: pageLoaded can
  // fire before the template body lands in the buffer or on disk.
  // Schedule a retry so the panel populates once content settles,
  // rather than rendering an empty state with just the Delete button.
  if (!text) {
    (globalThis as { setTimeout?: typeof setTimeout }).setTimeout?.(() => {
      showAttributesPanel().catch((e) =>
        console.error("showAttributesPanel retry", e)
      );
    }, 250);
    await editor.hidePanel("rhs");
    return;
  }
  const parsed = parseFrontmatter(text);
  const toc = extractToc(text);
  const mentions = await fetchLinkedMentions(pageName);
  const isReadonly = /^readonly:\s*true\s*$/m.test(text);

  // Multi-select data: only fetch if the page actually has fields that
  // can use it. The framework for `standards` is determined from the
  // page's `framework` field, or from the (singular `path` / first
  // `paths` entry) → looked up against the Paths list.
  let multiSelect: MultiSelectData = { allPaths: [], criteria: [] };
  const hasMultiSelectField = (parsed?.fields ?? []).some(
    (f) => f.isList && (f.key === "paths" || f.key === "standards"),
  );
  if (hasMultiSelectField) {
    const allPaths = await fetchAllPaths();
    let framework =
      (parsed?.fields.find((f) => f.key === "framework")?.value as string) ||
      "";
    if (!framework) {
      const pathField = parsed?.fields.find((f) => f.key === "path");
      const pathsField = parsed?.fields.find((f) => f.key === "paths");
      let candidate = "";
      if (pathField && !pathField.isList) candidate = pathField.value as string;
      else if (pathsField && pathsField.isList) {
        const list = pathsField.value as string[];
        candidate = list.find((s) => s && s.trim()) ?? "";
      }
      if (candidate) {
        const match = allPaths.find((p) => p.slug === candidate);
        if (match) framework = match.framework;
      }
    }
    const criteria = framework
      ? await fetchCriteriaForFramework(framework)
      : [];
    multiSelect = { allPaths, criteria };
  }

  // Always render the panel for editable pages so the Delete button is
  // reachable even on a page that has no attributes, ToC, or mentions.
  // Readonly pages with nothing to show still hide.
  if (
    isReadonly &&
    (!parsed || parsed.fields.length === 0) &&
    toc.length === 0 &&
    mentions.length === 0
  ) {
    await editor.hidePanel("rhs");
    return;
  }

  const { html, script } = buildPanelContent(
    pageName,
    parsed?.fields ?? [],
    toc,
    mentions,
    isReadonly,
    multiSelect,
    focusSearch,
  );
  // Second arg = flex grow. Editor is flex:1, so 0.7 puts the panel
  // at roughly 40% of the available space.
  await editor.showPanel("rhs", 0.7, html, script);
}

export async function search(): Promise<void> {
  // Restore if hidden (zen mode)
  if (zenMode) {
    zenMode = false;
    await showLeftPanel();
  }
  await showAttributesPanel(true);
}

export async function saveAttributes(
  pageName: string,
  values: Record<string, string>,
): Promise<void> {
  const text = await space.readPage(pageName);
  const parsed = parseFrontmatter(text);
  if (!parsed) {
    await editor.flashNotification("No frontmatter to save");
    return;
  }
  const newYaml = serializeFields(parsed.fields, values);
  const newContent = `---\n${newYaml}\n---\n${parsed.rest}`;
  if (newContent === text) {
    await editor.flashNotification("No changes");
    return;
  }
  await space.writePage(pageName, newContent);
  await editor.flashNotification("Saved");
  await editor.reloadPage();
}

// Tiny inline SVG icon library (Lucide-derived). Each value is the inner
// SVG markup; we wrap it with consistent attributes at render time.
const ICONS: Record<string, string> = {
  "plus":
    '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  "paperclip":
    '<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  "plus-circle":
    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',
  "edit-3":
    '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
  "pen-tool":
    '<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2 9.586 9.586"/><circle cx="11" cy="11" r="2"/>',
  "feather":
    '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>',
  "trending-up":
    '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  "zap":
    '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  "repeat":
    '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  "compass":
    '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  "file-text":
    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  "file-down":
    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/>',
  "calendar":
    '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  "bookmark":
    '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  "check-square":
    '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  "book-open":
    '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  "layers":
    '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  "route":
    '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  "clock":
    '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  "users":
    '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  "award":
    '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  "download":
    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  "refresh-cw":
    '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  "focus":
    '<circle cx="12" cy="12" r="3"/><path d="M3 9V6a1 1 0 0 1 1-1h3"/><path d="M21 9V6a1 1 0 0 0-1-1h-3"/><path d="M3 15v3a1 1 0 0 0 1 1h3"/><path d="M21 15v3a1 1 0 0 1-1 1h-3"/>',
  "sidebar-collapse":
    '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/>',
  "sidebar-expand":
    '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>',
  "bell":
    '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  "info":
    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  "cpu":
    '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',
  "inbox":
    '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
};

function svgIcon(name: string): string {
  const inner = ICONS[name] ?? "";
  return `<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

async function announcementsUnreadCount(): Promise<number> {
  // Mirrors the Lua `announcementsUnread()` helper. Read here so the
  // Navigator can render a badge synchronously alongside the rest of the
  // nav HTML — the Lua helper is the source of truth on Announcements.md.
  try {
    const cache = await space.readPage("_system/announcements-cache").catch(
      () => "",
    );
    if (!cache) return 0;
    const m = cache.match(/```json\s*([\s\S]*?)\s*```/);
    if (!m) return 0;
    const items: { id?: string }[] =
      (JSON.parse(m[1]).announcements as any[]) ?? [];
    let readSet = new Set<string>();
    try {
      const read = await space.readPage("_system/announcements-read");
      readSet = new Set(
        Array.from(read.matchAll(/^- ([\w\-_.]+)$/gm)).map((x) => x[1]),
      );
    } catch (_) {}
    return items.filter((a) => a.id && !readSet.has(a.id)).length;
  } catch (_) {
    return 0;
  }
}

async function buildLeftPanel(): Promise<{ html: string; script: string }> {
  const unreadCount = await announcementsUnreadCount();
  const sections: {
    title: string;
    items: {
      label: string;
      icon: string;
      navigate?: string;
      command?: string;
      badge?: number;
    }[];
  }[] = [
    // Single capture button replaces the long Create list — picker
    // (`Path: Capture`) shows all entry types including New task,
    // Quick capture, Contact, Credential, Personal statement, etc.
    {
      title: "",
      items: [
        {
          label: "Capture",
          icon: "plus",
          command: "Path: Capture",
        },
      ],
    },
    {
      title: "Browse",
      items: [
        { label: "All Paths", icon: "compass", navigate: "paths/index" },
        { label: "Claims", icon: "feather", navigate: "Claims" },
        { label: "CPD activities", icon: "calendar", navigate: "CPD" },
        { label: "Reflections", icon: "repeat", navigate: "Reflections" },
        { label: "Evidence", icon: "paperclip", navigate: "Evidence" },
        { label: "Network", icon: "users", navigate: "Network" },
        { label: "Credentials", icon: "award", navigate: "Credentials" },
        { label: "Captures", icon: "bookmark", navigate: "Captures" },
        { label: "Inbox", icon: "inbox", navigate: "Inbox" },
        { label: "Tasks", icon: "check-square", navigate: "Tasks" },
        { label: "All pages", icon: "layers", navigate: "Browse" },
      ],
    },
    {
      title: "Workspace",
      items: [
        { label: "Setup", icon: "check-square", navigate: "Setup" },
        {
          label: "Announcements",
          icon: "bell",
          navigate: "Announcements",
          badge: unreadCount,
        },
        { label: "History", icon: "clock", navigate: "History" },
        { label: "Export to Word", icon: "file-text", command: "Path: Export to Word" },
        { label: "AI context", icon: "cpu", navigate: "_system/mcp-context" },
        { label: "Manual", icon: "book-open", navigate: "manual/cheatsheet" },
        {
          label: "Add framework",
          icon: "download",
          command: "Path: Add framework",
        },
        { label: "About", icon: "info", navigate: "About" },
      ],
    },
  ];

  const sectionsHtml = sections.map((sec) => {
    // The "Capture" section uses a single button-styled item; the
    // empty title flag tells the CSS to render it as a CTA, no header.
    const isCapture = sec.title === "" && sec.items.length === 1 &&
      sec.items[0].command === "Path: Capture";
    const itemClass = isCapture ? "nav-item nav-capture" : "nav-item";
    const sectionClass = isCapture ? "section section-capture" : "section";
    const itemsHtml = sec.items.map((it) => {
      const dataAttr = it.navigate
        ? `data-navigate="${escapeHtml(it.navigate)}"`
        : `data-command="${escapeHtml(it.command ?? "")}"`;
      const badge = it.badge && it.badge > 0
        ? `<span class="nav-badge">${it.badge}</span>`
        : "";
      return `<li class="${itemClass}" ${dataAttr}>${
        svgIcon(it.icon)
      }<span class="nav-label">${escapeHtml(it.label)}</span>${badge}</li>`;
    }).join("");
    const heading = sec.title
      ? `<h2>${escapeHtml(sec.title)}</h2>`
      : "";
    return `<div class="${sectionClass}">${heading}<ul class="nav">${itemsHtml}</ul></div>`;
  }).join("");

  const html = `
<style>
  html, body { margin: 0; padding: 0; }
  html { background: #f8fafc; }
  body { font-family: Inter, system-ui, -apple-system, sans-serif; font-size: 14px; background: #f8fafc; width: 220px; max-width: 220px; overflow-x: hidden; }
  * { box-sizing: border-box; }
  .panel { padding: 1.4em 1em 1.4em 1.1em; color: #1f2937; }
  .brand-row { display: flex; align-items: center; gap: 0.55em; margin: 0 0 0.15em 0; }
  .logo { width: 24px; height: 24px; color: #4f46e5; flex-shrink: 0; }
  .brand { font-size: 1.3em; font-weight: 600; letter-spacing: 0.01em; margin: 0; color: #111827; flex: 1; }
  .tagline { font-size: 0.78em; color: #6b7280; margin: 0 0 1.7em 0; font-style: italic; }
  .section { margin-bottom: 1.5em; }
  .section h2 { font-size: 0.72em; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; margin: 0 0 0.55em 0; font-weight: 600; }
  .nav { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.1em; }
  .nav-item { display: flex; align-items: center; gap: 0.6em; font-size: 0.92em; color: #1f2937; cursor: pointer; padding: 0.45em 0.55em; border-radius: 4px; line-height: 1.3; white-space: nowrap; }
  .nav-item:hover { background: #eef2ff; color: #3730a3; }
  .nav-label { flex: 1; }
  .nav-badge { flex-shrink: 0; min-width: 1.4em; padding: 0 0.45em; height: 1.4em; line-height: 1.4em; text-align: center; font-size: 0.72em; font-weight: 600; color: white; background: #4f46e5; border-radius: 999px; }
  html[data-theme="dark"] .nav-badge { background: #818cf8; color: #0f172a; }
  .icon { flex-shrink: 0; opacity: 0.75; }
  .nav-item:hover .icon { opacity: 1; }
  /* Capture CTA — primary action, distinct from regular nav. Sits at
     ~50% panel width, left-aligned with the rest of the navigator. */
  .section-capture { margin-bottom: 1.6em; }
  .section-capture .nav { width: 50%; min-width: 90px; }
  .nav-capture { background: #4f46e5; color: white; justify-content: center; padding: 0.55em 0.9em; font-weight: 500; gap: 0.45em; border-radius: 6px; box-shadow: 0 1px 2px rgba(79, 70, 229, 0.2); transition: background 0.12s, box-shadow 0.12s; }
  .nav-capture:hover { background: #4338ca; color: white; box-shadow: 0 2px 6px rgba(79, 70, 229, 0.3); }
  .nav-capture .icon { opacity: 1; color: white; }
  html[data-theme="dark"] { background: #0f172a; }
  html[data-theme="dark"] body { background: #0f172a; }
  html[data-theme="dark"] .panel { color: #e2e8f0; }
  html[data-theme="dark"] .brand { color: #f8fafc; }
  html[data-theme="dark"] .logo { color: #818cf8; }
  html[data-theme="dark"] .tagline { color: #94a3b8; }
  html[data-theme="dark"] .section h2 { color: #94a3b8; }
  html[data-theme="dark"] .nav-item { color: #e2e8f0; }
  html[data-theme="dark"] .nav-item:hover { background: #1e293b; color: #c7d2fe; }
  html[data-theme="dark"] .nav-capture { background: #4f46e5; color: white; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4); }
  html[data-theme="dark"] .nav-capture:hover { background: #6366f1; color: white; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5); }
</style>
<div id="panel" class="panel">
  <div class="brand-row">
    <svg class="logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS["route"]}</svg>
    <h1 class="brand">Path</h1>
  </div>
  <p class="tagline">Career development for professionals</p>
  ${sectionsHtml}
</div>
`;

  const script = `
(function() {
  // Sync data-theme with the parent (theme toggle changes propagate live).
  try {
    var parentHtml = window.parent.document.documentElement;
    var sync = function() {
      var theme = parentHtml.getAttribute('data-theme') || '';
      if (theme) document.documentElement.setAttribute('data-theme', theme);
      else document.documentElement.removeAttribute('data-theme');
    };
    sync();
    new MutationObserver(sync).observe(parentHtml, { attributes: true, attributeFilter: ['data-theme'] });
  } catch (e) {}

  document.querySelectorAll('.nav-item').forEach(function(el) {
    el.addEventListener('click', async function() {
      var nav = el.getAttribute('data-navigate');
      var cmd = el.getAttribute('data-command');
      try {
        if (nav) {
          await syscall('editor.navigate', nav);
        } else if (cmd) {
          await syscall('system.invokeCommand', cmd);
        }
      } catch (e) {
        var msg = (e && e.message) ? e.message : String(e);
        try { await syscall('editor.flashNotification', 'Nav failed: ' + msg); } catch (_) {}
      }
    });
  });

})();
`;

  return { html, script };
}

export async function showLeftPanel(): Promise<void> {
  const { html, script } = await buildLeftPanel();
  // Wide enough that the longest item ("New future-claim") fits on one line.
  await editor.showPanel("lhs", 0.5, html, script);
}

// Ctrl-Alt-z: if any panel is hidden (zen or individual collapse), restore
// everything. If all panels are visible, enter zen mode. This means the
// shortcut is always "restore" when anything is hidden.
export async function toggleZenMode(): Promise<void> {
  if (zenMode) {
    zenMode = false;
    await Promise.all([
      showLeftPanel().catch((e) => console.error("showLeftPanel", e)),
      showAttributesPanel().catch((e) => console.error("showAttributesPanel", e)),
    ]);
  } else {
    zenMode = true;
    await Promise.all([
      editor.hidePanel("lhs"),
      editor.hidePanel("rhs"),
    ]);
  }
}

export async function onPageLoaded(): Promise<void> {
  if (zenMode) return;

  // Launch redirect: on fresh install (no _system/onboarding file), redirect
  // once to Setup, then write redirect: false so subsequent sessions never
  // redirect. The session flag prevents re-checking on every in-session
  // navigation; the file prevents re-checking on browser refresh.
  if (!onboardingChecked) {
    onboardingChecked = true;
    const pageName = await editor.getCurrentPage();
    if (pageName && pageName !== "Setup") {
      let shouldRedirect = false;
      try {
        const cfg = await space.readPage("_system/onboarding");
        shouldRedirect = cfg.includes("redirect: true");
      } catch (_) {
        // File doesn't exist = fresh install
        shouldRedirect = true;
      }
      if (shouldRedirect) {
        try {
          await space.writePage("_system/onboarding", "redirect: false\n");
        } catch (_) {}
        await (editor as any).navigate("Setup");
        return;
      }
    }
  }

  // Fire-and-forget announcement refresh on the first onPageLoaded of a
  // session. The silent variant swallows network errors and never reloads
  // the page; the badge will update next time showLeftPanel renders.
  if (!announcementsRefreshed) {
    announcementsRefreshed = true;
    (async () => {
      try {
        await system.invokeCommand("Path: Refresh announcements (silent)");
        // Re-render the left panel now that the cache has changed, so the
        // unread badge reflects today's feed without needing another nav.
        await showLeftPanel().catch(() => {});
      } catch (_) {
        // Offline or registry unreachable — the cached feed (if any) still renders.
      }
    })();
  }

  // Auto-mark on visit: when the user lands on Announcements, mark
  // everything currently in the cache as read. The render of the page
  // body uses the read-state at render time, so existing unread markers
  // still display on this visit; subsequent renders show them as read.
  // The mark command itself triggers a Navigator refresh to clear the badge.
  try {
    if ((await editor.getCurrentPage()) === "Announcements") {
      // Defer slightly so the page body renders against the pre-mark
      // read-state — the user sees what was new before it disappears.
      (globalThis as { setTimeout?: typeof setTimeout }).setTimeout?.(() => {
        system.invokeCommand("Path: Mark all announcements as read").catch(
          () => {},
        );
      }, 600);
    }
  } catch (_) {}

  await Promise.all([
    showLeftPanel().catch((e) => console.error("showLeftPanel failed", e)),
    showAttributesPanel().catch((e) => console.error("showAttributesPanel failed", e)),
  ]);
}

export async function hello(): Promise<void> {
  await editor.flashNotification("Hello from the Path plug!");
}

// Debug: writes title="DEBUG_TEST" to current page, bypassing the iframe.
// If this works but the panel Save doesn't, the bug is in the iframe path.
// If this also fails, the bug is in the parse/save logic.
export async function debugSave(): Promise<void> {
  const pageName = await editor.getCurrentPage();
  if (!pageName) {
    await editor.flashNotification("No current page");
    return;
  }
  await editor.flashNotification(`debugSave: targeting ${pageName}`);
  try {
    await saveAttributes(pageName, { title: "DEBUG_TEST" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await editor.flashNotification(`debugSave threw: ${msg}`);
  }
}
