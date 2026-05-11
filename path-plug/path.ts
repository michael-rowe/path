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
  // Internal preview-mode flags written by previewSnapshot — they drive
  // the Restore banner via showAttributesPanel rather than appearing as
  // editable rows.
  "path_preview_of",
  "path_preview_hash",
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

type PathConfig = {
  meiliUrl: string;
  meiliKey: string;
  gitWatcherUrl: string;
  lycheeUrl: string;
  rcloneUrl: string;
  languageToolUrl: string;
};

// Read sidecar URLs and the Meilisearch key from `_system/path-config.md`
// frontmatter, with defaults that match the compose stack out of the box.
// The page is a soft-locked YAML-only config surface; if missing, defaults
// are used.
async function getPathConfig(): Promise<PathConfig> {
  const defaults: PathConfig = {
    meiliUrl: "http://localhost:7700",
    meiliKey: "masterKey",
    gitWatcherUrl: "http://localhost:8020",
    lycheeUrl: "http://localhost:8030",
    rcloneUrl: "http://localhost:8040",
    languageToolUrl: "http://localhost:8010",
  };
  try {
    const text = await space.readPage("_system/path-config");
    const parsed = parseFrontmatter(text);
    if (!parsed) return defaults;
    const get = (k: string) => {
      const v = parsed.fields.find((f) => f.key === k)?.value;
      return typeof v === "string" && v ? v : undefined;
    };
    return {
      meiliUrl: get("meili_url") ?? defaults.meiliUrl,
      meiliKey: get("meili_key") ?? defaults.meiliKey,
      gitWatcherUrl: get("git_watcher_url") ?? defaults.gitWatcherUrl,
      lycheeUrl: get("lychee_url") ?? defaults.lycheeUrl,
      rcloneUrl: get("rclone_url") ?? defaults.rcloneUrl,
      languageToolUrl: get("languagetool_url") ?? defaults.languageToolUrl,
    };
  } catch {
    return defaults;
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

interface PreviewState {
  originalPage: string;
  hash: string;
}

function buildPanelContent(
  pageName: string,
  fields: Field[],
  toc: TocItem[] = [],
  mentions: Mention[] = [],
  isReadonly: boolean = false,
  multiSelect: MultiSelectData = { allPaths: [], criteria: [] },
  focusSearch: boolean = false,
  pathConfig: PathConfig = {
    meiliUrl: "http://localhost:7700",
    meiliKey: "masterKey",
    gitWatcherUrl: "http://localhost:8020",
    lycheeUrl: "http://localhost:8030",
    rcloneUrl: "http://localhost:8040",
    languageToolUrl: "http://localhost:8010",
  },
  preview: PreviewState | null = null,
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
    <div class="search-container">
      <input type="text" id="search-input" class="field" placeholder="Search portfolio..." autocomplete="off">
      <div id="search-results" class="search-results"></div>
    </div>`;

  const attrsBody = fields.length === 0 || rowsHtml.length === 0
    ? ""
    : `
    <div class="section" data-section="attrs">
      <div class="section-actions"><button class="btn" id="btn-save">Save changes</button></div>
      <div class="attrs">${rowsHtml.join("")}</div>
    </div>`;

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

  const toolsBody = `
    <div class="tool-section">
      <h3>Writing Quality</h3>
      <button class="btn-tool" id="btn-grammar">Check grammar & style</button>
    </div>
    <div class="tool-section">
      <h3>Link Checker</h3>
      <button class="btn-tool" id="btn-links">Check broken links</button>
    </div>
    ${isReadonly ? "" : `
    <div class="section-danger" style="margin-top: 3em;">
      <button class="btn-danger" id="btn-delete" type="button">Delete this page</button>
    </div>`}
  `;

  const historyBody = `
    <div class="tool-section">
      <h3>Time Machine</h3>
      <div id="history-list" class="history-list">
        <div class="empty">Loading snapshots...</div>
      </div>
    </div>
  `;

  const html = `
<style>
  html, body { margin: 0; padding: 0; }
  html { background: #f8fafc; }
  body { font-family: Inter, system-ui, -apple-system, sans-serif; font-size: 15px; background: #f8fafc; margin: 0; padding: 0; }
  * { box-sizing: border-box; }
  .panel { padding: 0 1.1em 1.3em 1.1em; color: #1f2937; }
  
  /* Pinned search with 4.5em top spacing */
  .search-container { margin-top: 4.5em; margin-bottom: 1.5em; }
  
  .tabs { display: flex; border-bottom: 1px solid #e5e7eb; margin-bottom: 1.4em; gap: 0.5em; position: sticky; top: 0; background: #f8fafc; z-index: 10; padding-top: 1em; }
  .tab-btn { background: none; border: none; padding: 0.6em 0.8em; cursor: pointer; font-size: 0.85em; font-weight: 500; color: #6b7280; border-bottom: 2px solid transparent; transition: all 0.15s; }
  .tab-btn:hover { color: #4f46e5; }
  .tab-btn.active { color: #4f46e5; border-bottom-color: #4f46e5; }
  .tab-content { display: none; }
  .tab-content.active { display: block; }

  .section { margin-bottom: 1.4em; }
  .section > summary { list-style: none; cursor: pointer; user-select: none; display: flex; justify-content: space-between; align-items: center; gap: 0.6em; padding: 0.25em 0; }
  .section h2 { font-size: 0.74em; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; margin: 0; font-weight: 600; display: flex; align-items: center; gap: 0.5em; }
  .section .count { background: #eef2ff; color: #4338ca; border-radius: 999px; padding: 0.05em 0.55em; font-size: 0.85em; font-weight: 500; }
  .chev { color: #9ca3af; font-size: 0.9em; transition: transform 0.15s ease; }
  .section[open] > summary .chev { transform: rotate(180deg); }
  .section-body { padding-top: 0.85em; }
  .section-actions { display: flex; justify-content: flex-end; margin-bottom: 0.7em; }
  
  .tool-section { margin-bottom: 1.8em; }
  .tool-section h3 { font-size: 0.72em; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin: 0 0 0.7em 0; font-weight: 600; }
  .btn-tool { background: white; border: 1px solid #d1d5db; color: #111827; padding: 0.55em 0.9em; border-radius: 4px; cursor: pointer; font-size: 0.88em; font-family: inherit; transition: all 0.12s; width: fit-content; text-align: left; }
  .btn-tool:hover { background: #f9fafb; border-color: #9ca3af; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
  
  .status-area { margin-top: 0.8em; font-size: 0.82em; color: #6b7280; line-height: 1.5; padding: 0.6em 0.8em; background: #f1f5f9; border-radius: 4px; }
  .status-area span { color: #1f2937; font-weight: 500; }

  .history-list { display: flex; flex-direction: column; gap: 0.2em; }
  .history-item { display: flex; align-items: center; justify-content: space-between; padding: 0.6em 0.7em; border-radius: 4px; border-bottom: 1px solid #f1f5f9; }
  .history-item:hover { background: #f8fafc; }
  .history-info { flex: 1; min-width: 0; }
  .history-date { font-size: 0.85em; font-weight: 600; color: #111827; margin-bottom: 0.1em; }
  .history-msg { font-size: 0.78em; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .history-actions { display: flex; gap: 0.2em; }
  .btn-icon { background: none; border: none; padding: 0.4em; cursor: pointer; color: #9ca3af; border-radius: 4px; transition: all 0.12s; display: flex; align-items: center; justify-content: center; }
  .btn-icon:hover { color: #4f46e5; background: #eef2ff; }

  .btn { background: #4f46e5; color: white; border: none; padding: 0.4em 0.95em; border-radius: 4px; cursor: pointer; font-size: 0.82em; font-weight: 500; font-family: inherit; }
  .btn:hover { background: #4338ca; }
  .attrs { display: flex; flex-direction: column; gap: 0.95em; }
  .row { display: flex; flex-direction: column; gap: 0.3em; }
  .k { font-size: 0.72em; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; font-weight: 500; }
  .field { width: 100%; padding: 0.45em 0.6em; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.92em; font-family: inherit; color: #111827; background: white; }
  .field:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 2px rgba(79,70,229,0.15); }
  .multi-list { display: flex; flex-direction: column; gap: 0.32em; padding: 0.5em 0.6em; border: 1px solid #d1d5db; border-radius: 4px; max-height: 220px; overflow-y: auto; background: white; }
  .multi-opt { display: flex; align-items: center; gap: 0.5em; cursor: pointer; line-height: 1.3; padding: 0.15em 0.1em; border-radius: 3px; }
  .multi-opt:hover { background: #eef2ff; }
  .badge { display: inline-block; background: #eef2ff; color: #4338ca; padding: 0.2em 0.65em; border-radius: 5px; font-size: 0.82em; font-weight: 500; }
  .empty { color: #6b7280; font-size: 0.85em; font-style: italic; padding: 1em 0; }
  .toc { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.3em; }
  .toc-item { font-size: 0.9em; color: #1f2937; cursor: pointer; padding: 0.25em 0.4em; border-radius: 3px; line-height: 1.4; }
  .toc-item:hover { background: #eef2ff; color: #3730a3; }
  
  .search-results { display: flex; flex-direction: column; gap: 0.4em; margin-top: 0.8em; }
  .search-result { padding: 0.5em 0.6em; border-radius: 4px; cursor: pointer; line-height: 1.4; border-bottom: 1px solid rgba(128,128,128,0.1); }
  .search-result:hover { background: #eef2ff; }
  .search-title { font-size: 0.9em; font-weight: 600; color: #4f46e5; }
  .search-path { font-size: 0.72em; color: #6b7280; font-weight: 500; margin-bottom: 0.15em; }
  .search-snip { font-size: 0.82em; color: #4b5563; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .search-snip em { font-style: normal; background: rgba(79, 70, 229, 0.15); border-radius: 2px; }

  /* Sticky inside the History tab so it stays visible as users scroll a long snapshot list.
     Top offset matches .tabs sticky bar height (~2.6em including padding). */
  .preview-banner { position: sticky; top: 3em; z-index: 9; margin-bottom: 1em; padding: 0.9em 1em; background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 6px; }
  .preview-banner-title { font-size: 0.92em; font-weight: 600; color: #3730a3; margin-bottom: 0.15em; }
  .preview-banner-title code, .preview-banner-sub code { background: rgba(79, 70, 229, 0.12); padding: 0.05em 0.4em; border-radius: 3px; font-size: 0.92em; }
  .preview-banner-sub { font-size: 0.82em; color: #4338ca; margin-bottom: 0.85em; word-break: break-word; }
  .preview-banner-actions { display: flex; gap: 0.5em; flex-wrap: wrap; }
  .btn-restore { background: #4f46e5; }
  .btn-restore:hover { background: #4338ca; }
  .btn-secondary { background: white; color: #4338ca; border: 1px solid #c7d2fe; padding: 0.4em 0.95em; border-radius: 4px; cursor: pointer; font-size: 0.82em; font-weight: 500; font-family: inherit; }
  .btn-secondary:hover { background: #f5f3ff; }

  .section-danger { margin-top: 2em; padding-top: 1.2em; border-top: 1px solid #e5e7eb; display: flex; justify-content: center; }
  .btn-danger { background: transparent; color: #b91c1c; border: 1px solid #fca5a5; padding: 0.45em 1em; border-radius: 4px; cursor: pointer; font-size: 0.85em; font-weight: 500; font-family: inherit; transition: all 0.12s; }
  .btn-danger:hover { background: #fee2e2; color: #991b1b; }

  .mentions { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5em; }
  .mention { padding: 0.45em 0.55em; border-radius: 4px; cursor: pointer; line-height: 1.4; }
  .mention:hover { background: #eef2ff; }
  .mention-ref { font-size: 0.92em; color: #2563eb; font-weight: 500; word-break: break-word; }

  html[data-theme="dark"] { background: #0f172a; }
  html[data-theme="dark"] body { background: #0f172a; }
  html[data-theme="dark"] .panel { color: #e2e8f0; }
  html[data-theme="dark"] .tabs { background: #0f172a; border-bottom-color: #1e293b; }
  html[data-theme="dark"] .tab-btn { color: #94a3b8; }
  html[data-theme="dark"] .tab-btn:hover { color: #818cf8; }
  html[data-theme="dark"] .tab-btn.active { color: #818cf8; border-bottom-color: #818cf8; }
  html[data-theme="dark"] .section h2, html[data-theme="dark"] .k, html[data-theme="dark"] .tool-section h3 { color: #94a3b8; }
  html[data-theme="dark"] .btn-tool { background: #1e293b; border-color: #334155; color: #f1f5f9; }
  html[data-theme="dark"] .btn-tool:hover { background: #334155; border-color: #475569; }
  html[data-theme="dark"] .status-area { background: #1e293b; color: #94a3b8; }
  html[data-theme="dark"] .status-area span { color: #f1f5f9; }
  html[data-theme="dark"] .history-item { border-bottom-color: #1e293b; }
  html[data-theme="dark"] .history-item:hover { background: #1e293b; }
  html[data-theme="dark"] .history-date { color: #f1f5f9; }
  html[data-theme="dark"] .toc-item { color: #cbd5e1; }
  html[data-theme="dark"] .toc-item:hover { background: #1e1b4b; color: #c7d2fe; }
  html[data-theme="dark"] .preview-banner { background: #1e1b4b; border-color: #312e81; }
  html[data-theme="dark"] .preview-banner-title { color: #c7d2fe; }
  html[data-theme="dark"] .preview-banner-sub { color: #a5b4fc; }
  html[data-theme="dark"] .btn-secondary { background: #1e293b; color: #c7d2fe; border-color: #312e81; }
  html[data-theme="dark"] .btn-secondary:hover { background: #312e81; }
  html[data-theme="dark"] .field { background: #1e293b; border-color: #475569; color: #f1f5f9; }
  html[data-theme="dark"] .multi-list { background: #1e293b; border-color: #475569; }
  html[data-theme="dark"] .search-title { color: #818cf8; }
  html[data-theme="dark"] .search-result:hover { background: #1e293b; }
  html[data-theme="dark"] .badge { background: #312e81; color: #c7d2fe; }
</style>
<div id="panel" class="panel">
  ${searchBody}
  <div class="tabs">
    <button class="tab-btn ${preview ? "" : "active"}" data-tab="page">Page</button>
    <button class="tab-btn" data-tab="tools">Tools</button>
    <button class="tab-btn ${preview ? "active" : ""}" data-tab="history">History</button>
  </div>
  <div id="tab-page" class="tab-content ${preview ? "" : "active"}">
    ${tocBody}
    ${attrsBody}
    ${mentionsBody}
  </div>
  <div id="tab-tools" class="tab-content">
    ${toolsBody}
  </div>
  <div id="tab-history" class="tab-content ${preview ? "active" : ""}">
    ${
      preview
        ? `
    <div class="preview-banner">
      <div class="preview-banner-title">Previewing snapshot <code>${
          escapeHtml(preview.hash.slice(0, 7))
        }</code></div>
      <div class="preview-banner-sub">of <code>${
          escapeHtml(preview.originalPage)
        }</code></div>
      <div class="preview-banner-actions">
        <button class="btn btn-restore" id="btn-preview-restore">Restore this version</button>
        <button class="btn-secondary" id="btn-preview-back">Back to current</button>
      </div>
    </div>`
        : ""
    }
    ${historyBody}
  </div>
</div>
`;

  // The script is eval'd in the iframe context where `syscall` is a global.
  const fieldsJson = JSON.stringify(editableDescs);
  const pageJson = JSON.stringify(pageName);
  const focusSearchJson = JSON.stringify(focusSearch);
  const configJson = JSON.stringify(pathConfig);
  const previewOfJson = JSON.stringify(preview?.originalPage ?? "");
  const previewHashJson = JSON.stringify(preview?.hash ?? "");
  const script = `
(function() {
  var FIELDS = ${fieldsJson};
  var PAGE = ${pageJson};
  var FOCUS_SEARCH = ${focusSearchJson};
  var CFG = ${configJson};
  var MEILI_URL = CFG.meiliUrl;
  var MEILI_KEY = CFG.meiliKey;
  // Stored on window so previewSnapshot/restoreSnapshot can read them
  // without re-threading every call signature.
  window.PREVIEW_OF = ${previewOfJson};
  window.PREVIEW_HASH = ${previewHashJson};

  function ls() { try { return window.parent.localStorage; } catch (_) { return null; } }

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

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var tab = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById('tab-' + tab).classList.add('active');
      
      var store = ls();
      if (store) store.setItem('path-active-tab', tab);

      if (tab === 'history') updateHistory();
    });
  });

  // Restore active tab
  var store = ls();
  if (store) {
    var activeTab = store.getItem('path-active-tab');
    if (activeTab && activeTab !== 'page') {
      var btn = document.querySelector('.tab-btn[data-tab="' + activeTab + '"]');
      if (btn) btn.click();
    }
  }

  function fmtDate(iso) {
    if (!iso) return '';
    try {
      var d = new Date(iso);
      return d.toLocaleString();
    } catch (_) { return iso; }
  }

  async function updateHistory() {
    var list = document.getElementById('history-list');
    // In preview mode the iframe's PAGE is "_system/history-preview"; the
    // snapshot list users actually want is for the original page.
    var anchor = (window.PREVIEW_OF && window.PREVIEW_OF.length) ? window.PREVIEW_OF : PAGE;
    try {
      var resp = await fetch(CFG.gitWatcherUrl + '/history?path=' + encodeURIComponent(anchor));
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      var data = await resp.json();
      var history = data.history || [];
      if (history.length === 0) {
        list.innerHTML = '<div class="empty">No snapshots found.</div>';
        return;
      }
      list.innerHTML = history.map(function(item) {
        return \`
          <div class="history-item">
            <div class="history-info">
              <div class="history-date">\${fmtDate(item.timestamp)}</div>
              <div class="history-msg">\${item.message}</div>
            </div>
            <div class="history-actions">
              <button class="btn-icon btn-history-preview" data-hash="\${item.hash}" title="Preview snapshot">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </button>
              <button class="btn-icon btn-history-restore" data-hash="\${item.hash}" title="Restore snapshot">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              </button>
            </div>
          </div>\`;
      }).join('');

      list.querySelectorAll('.btn-history-preview').forEach(function(btn) {
        btn.addEventListener('click', function() { previewSnapshot(btn.getAttribute('data-hash')); });
      });
      list.querySelectorAll('.btn-history-restore').forEach(function(btn) {
        btn.addEventListener('click', function() { restoreSnapshot(btn.getAttribute('data-hash')); });
      });
    } catch (e) {
      list.innerHTML = '<div class="empty">History unavailable — is the git-watcher sidecar running?</div>';
    }
  }

  async function fetchSnapshot(hash, page) {
    var p = page || PAGE;
    var url = CFG.gitWatcherUrl + '/version?path=' + encodeURIComponent(p) + '&hash=' + encodeURIComponent(hash);
    var resp = await fetch(url);
    if (!resp.ok) throw new Error('Snapshot not found');
    return await resp.json();
  }

  async function previewSnapshot(hash) {
    try {
      // ANCHOR is the page the snapshot belongs to: while *on* a preview
      // page, we're already showing snapshots for the original page (via
      // PREVIEW_OF rewiring of updateHistory), so a click on another
      // snapshot here previews from that same original — not from the
      // preview-of-the-preview.
      var anchor = (window.PREVIEW_OF && window.PREVIEW_OF.length) ? window.PREVIEW_OF : PAGE;
      var data = await fetchSnapshot(hash, anchor);
      var previewPage = '_system/history-preview';
      // YAML carries the original page + hash so showAttributesPanel can
      // detect preview mode on next pageLoaded and inject the banner +
      // rewire the History tab.
      var yaml = '---\\nreadonly: true\\npath_preview_of: ' + anchor + '\\npath_preview_hash: ' + hash + '\\n---\\n\\n';
      await syscall('space.writePage', previewPage, yaml + data.content);
      await syscall('editor.navigate', previewPage);
    } catch (e) {
      await syscall('editor.flashNotification', 'Preview failed: ' + String(e));
    }
  }

  async function restoreSnapshot(hash) {
    // When called from inside a preview, target the original page (not
    // the preview file itself, which has no history of its own).
    var target = (window.PREVIEW_OF && window.PREVIEW_OF.length) ? window.PREVIEW_OF : PAGE;
    if (!window.confirm('Restore "' + target + '" to snapshot ' + hash.slice(0, 7) + '? Unsaved changes will be lost.')) return;
    try {
      var data = await fetchSnapshot(hash, target);
      await syscall('space.writePage', target, data.content);
      await syscall('editor.flashNotification', 'Restored snapshot ' + hash.slice(0, 7));
      await syscall('editor.navigate', target);
    } catch (e) {
      await syscall('editor.flashNotification', 'Restore failed: ' + String(e));
    }
  }

  // Tool buttons — fetch directly from sidecars. Results for grammar/links
  // are written to a transient _system page and opened.
  document.getElementById('btn-grammar')?.addEventListener('click', async function() {
    var btn = this;
    btn.disabled = true;
    try {
      var text = await syscall('editor.getText');
      var body = 'text=' + encodeURIComponent(text) + '&language=en-GB';
      var resp = await fetch(CFG.languageToolUrl + '/v2/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body,
      });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      var data = await resp.json();
      var matches = data.matches || [];
      var lines = ['---', 'readonly: true', '---', '', '# Grammar & style check', '', '*Source:* \`' + PAGE + '\`  ', '*Issues found:* ' + matches.length, ''];
      matches.forEach(function(m) {
        var ctx = (m.context && m.context.text) || '';
        lines.push('## ' + (m.shortMessage || m.message));
        lines.push('');
        lines.push('> ' + ctx);
        lines.push('');
        lines.push('*Rule:* ' + (m.rule && m.rule.id ? m.rule.id : '—'));
        lines.push('');
      });
      await syscall('space.writePage', '_system/last-grammar-check', lines.join('\\n'));
      await syscall('editor.flashNotification', matches.length + ' issue(s) found.');
      await syscall('editor.navigate', '_system/last-grammar-check');
    } catch (e) {
      await syscall('editor.flashNotification', 'Grammar check failed: ' + String(e));
    } finally { btn.disabled = false; }
  });

  document.getElementById('btn-links')?.addEventListener('click', async function() {
    var btn = this;
    btn.disabled = true;
    try {
      var resp = await fetch(CFG.lycheeUrl + '/check?path=' + encodeURIComponent(PAGE));
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      var data = await resp.json();
      var issues = data.issues || [];
      var lines = ['---', 'readonly: true', '---', '', '# Broken link check', '', '*Source:* \`' + PAGE + '\`  ', '*Broken / unreachable:* ' + issues.length, ''];
      issues.forEach(function(i) {
        lines.push('- **' + i.status + '** — ' + i.uri + (i.message ? ' (' + i.message + ')' : ''));
      });
      await syscall('space.writePage', '_system/last-link-check', lines.join('\\n'));
      await syscall('editor.flashNotification', issues.length + ' broken link(s).');
      await syscall('editor.navigate', '_system/last-link-check');
    } catch (e) {
      await syscall('editor.flashNotification', 'Link check failed: ' + String(e));
    } finally { btn.disabled = false; }
  });

  // Preview banner buttons (only present when in preview mode).
  document.getElementById('btn-preview-restore')?.addEventListener('click', function() {
    if (window.PREVIEW_HASH) restoreSnapshot(window.PREVIEW_HASH);
  });
  document.getElementById('btn-preview-back')?.addEventListener('click', function() {
    if (window.PREVIEW_OF) syscall('editor.navigate', window.PREVIEW_OF);
  });

  // Search logic
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');

  if (searchInput) {
    if (FOCUS_SEARCH) setTimeout(function() { searchInput.focus(); }, 100);

    searchInput.addEventListener('input', async function(e) {
      var query = e.target.value;
      if (!query) { searchResults.innerHTML = ''; return; }
      try {
        var response = await fetch(MEILI_URL + '/indexes/pages/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + MEILI_KEY },
          body: JSON.stringify({ q: query, attributesToHighlight: ['content', 'title'], limit: 8 })
        });
        var data = await response.json();
        searchResults.innerHTML = (data.hits || []).map(function(hit) {
          var title = (hit._highlightResult && hit._highlightResult.title && hit._highlightResult.title.value) || hit.title;
          var snip = (hit._highlightResult && hit._highlightResult.content && hit._highlightResult.content.value) || '';
          return \`
            <div class="search-result" data-path="\${hit.path}">
              <div class="search-path">\${hit.path}</div>
              <div class="search-title">\${title}</div>
              <div class="search-snip">\${snip}</div>
            </div>\`;
        }).join('');

        document.querySelectorAll('.search-result').forEach(function(el) {
          el.addEventListener('click', async function() {
            await syscall('editor.navigate', el.getAttribute('data-path'));
          });
        });
      } catch (err) { searchResults.innerHTML = '<div class="empty">Search unavailable.</div>'; }
    });
  }

  // Attrs save
  document.getElementById('btn-save')?.addEventListener('click', async function() {
    var btn = this;
    btn.disabled = true;
    try {
      var values = {};
      FIELDS.forEach(function(f) {
        var inp = document.getElementById('f-' + f.key);
        if (inp) values[f.key] = inp.value;
      });
      await syscall('system.invokeFunction', 'path.saveAttributes', PAGE, values);
    } catch (e) {
      await syscall('editor.flashNotification', 'Save failed: ' + String(e));
    } finally { btn.disabled = false; }
  });

  // ToC clicks
  document.querySelectorAll('.toc-item').forEach(function(el) {
    el.addEventListener('click', async function() {
      var line = parseInt(el.getAttribute('data-line'), 10);
      if (!isNaN(line)) await syscall('editor.moveCursorToLine', line + 1, 0, true);
    });
  });

  // Delete button
  document.getElementById('btn-delete')?.addEventListener('click', async function() {
    if (window.confirm('Delete "' + PAGE + '"?')) {
      try {
        await syscall('space.deletePage', PAGE);
        await syscall('editor.navigate', 'index');
      } catch (e) {
        await syscall('editor.flashNotification', 'Delete failed: ' + String(e), 'error');
      }
    }
  });

  // Linked-mention clicks
  document.querySelectorAll('.mention').forEach(function(el) {
    el.addEventListener('click', async function() {
      await syscall('editor.navigate', el.getAttribute('data-page'));
    });
  });

  // Collapsible sections
  document.querySelectorAll('details.section').forEach(function(d) {
    var key = 'path-section-' + d.getAttribute('data-section');
    var v = store ? store.getItem(key) : null;
    if (v === '0') d.removeAttribute('open');
    else d.setAttribute('open', '');
    d.addEventListener('toggle', function() {
      if (store) store.setItem(key, d.open ? '1' : '0');
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

  const pathConfig = await getPathConfig();

  // Preview state: when the page YAML carries path_preview_of /
  // path_preview_hash (written by previewSnapshot), surface a Restore
  // banner and re-anchor the History tab to the original page.
  const previewOf = parsed?.fields.find((f) => f.key === "path_preview_of")
    ?.value as string | undefined;
  const previewHash = parsed?.fields.find((f) => f.key === "path_preview_hash")
    ?.value as string | undefined;
  const preview: PreviewState | null = previewOf && previewHash
    ? { originalPage: previewOf, hash: previewHash }
    : null;

  const { html, script } = buildPanelContent(
    pageName,
    parsed?.fields ?? [],
    toc,
    mentions,
    isReadonly,
    multiSelect,
    focusSearch,
    pathConfig,
    preview,
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
        { label: "Recent", icon: "clock", navigate: "Recent" },
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

// Sync space to the configured rclone remote. Triggered from the
// toolbar cloud-upload button (registered in CONFIG.md). Reaches the
// rclone-svc by docker service name — this command only makes sense
// when running inside the compose stack.
export async function syncToCloud(): Promise<void> {
  await editor.flashNotification("Syncing to cloud...");
  try {
    const resp = await fetch("http://rclone-svc:8040/sync", {
      method: "POST",
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      const detail = data?.detail || `HTTP ${resp.status}`;
      throw new Error(detail);
    }
    const status = data?.status || "complete";
    const when = data?.last_run ? ` (${data.last_run})` : "";
    await editor.flashNotification(`Sync: ${status}${when}`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await editor.flashNotification(`Sync failed: ${msg}`);
  }
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
