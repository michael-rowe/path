This is where you configure SilverBullet to your liking. See [[^Library/Std/Config]] for a full list of configuration options.

```space-lua
-- Inline ToC widget disabled — the right-hand panel (from the Path plug)
-- now shows the page's headings under "On this page".
config.set("std.widgets.toc.enabled", false)

-- Linked-mentions widget disabled — the Path plug renders backlinks
-- inside the right-hand panel ("Linked mentions" section) instead of
-- appending them to the bottom of every page.
config.set("std.widgets.linkedMentions.enabled", false)
```

# Browser tab title and favicon

Sets the browser tab to `Path | <page H1 or page name>` and replaces the
favicon with the Path "route" logo. Re-runs on every page load so SB
navigations don't revert it.

```space-lua
-- Inline-SVG favicon, URL-encoded data URI. Same icon as the left-panel
-- brand. Indigo stroke (#4f46e5) on transparent background.
local PATH_FAVICON = "data:image/svg+xml;utf8,"
  .. "%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234f46e5%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E"
  .. "%3Ccircle%20cx%3D%226%22%20cy%3D%2219%22%20r%3D%223%22%2F%3E"
  .. "%3Cpath%20d%3D%22M9%2019h8.5a3.5%203.5%200%200%200%200-7h-11a3.5%203.5%200%200%201%200-7H15%22%2F%3E"
  .. "%3Ccircle%20cx%3D%2218%22%20cy%3D%225%22%20r%3D%223%22%2F%3E"
  .. "%3C%2Fsvg%3E"

local function set_favicon()
  local doc = js.window.document
  local link = doc.querySelector("link[rel='icon']")
  if not link then
    link = doc.createElement("link")
    link.setAttribute("rel", "icon")
    doc.head.appendChild(link)
  end
  if link.getAttribute("href") ~= PATH_FAVICON then
    link.setAttribute("type", "image/svg+xml")
    link.setAttribute("href", PATH_FAVICON)
  end
end

local function first_h1(text)
  -- Skip frontmatter
  local body = text or ""
  if string.sub(body, 1, 4) == "---\n" then
    local close = string.find(body, "\n---", 5, true)
    if close then body = string.sub(body, close + 4) end
  end
  for line in string.gmatch(body, "[^\n]+") do
    local h = string.match(line, "^#%s+(.+)%s*$")
    if h then return h end
  end
  return nil
end

-- Explicit title overrides. Full page path takes priority over H1.
-- Needed for pages whose slug or H1 shouldn't be the tab title verbatim.
local PAGE_TITLES = {
  ["index"]       = "Home",
  ["paths/index"] = "All Paths",
  ["profile"]     = "Profile",
}

event.listen {
  name = "editor:pageLoaded",
  run = function()
    set_favicon()
    local name = editor.getCurrentPage()
    if not name then return end
    local content = space.readPage(name) or ""
    local h = first_h1(content)
    local short = name:match("([^/]+)$") or name
    -- Full path wins, then last segment, then H1, then raw slug.
    local heading = PAGE_TITLES[name] or PAGE_TITLES[short] or h or name
    local target = "Path | " .. heading

    js.window.document.title = target

    -- SilverBullet overwrites document.title from the page slug after rendering.
    -- A MutationObserver on <title> catches each overwrite and corrects it
    -- immediately, eliminating the flicker that a fixed-delay setTimeout produces.
    -- We disconnect after 5 s when the page is guaranteed settled.
    local title_el = js.window.document.querySelector("title")
    if title_el then
      local obs = js.window.MutationObserver.new(function()
        if js.window.document.title ~= target then
          js.window.document.title = target
        end
      end)
      obs.observe(title_el, js.tojs({
        childList = true,
        characterData = true,
        subtree = true,
      }))
      js.window.setTimeout(function() obs.disconnect() end, 5000)
    end
  end
}
```

# Page locking — soft read-only for system pages

When a page has `readonly: true` in its attributes, we put the editor into
forced read-only mode on load. Power users can unlock by removing the line
and reloading. Used to prevent accidental edits to the manual.

```space-lua
event.listen {
  name = "editor:pageLoaded",
  run = function()
    local name = editor.getCurrentPage()
    if not name then
      editor.setUiOption("forcedROMode", false)
      js.window.document.documentElement.setAttribute("data-path-readonly", "false")
      return
    end
    local content = space.readPage(name) or ""
    local is_readonly = string.find(content, "\nreadonly:%s*true") ~= nil
                        or string.find(content, "^readonly:%s*true") ~= nil
    editor.setUiOption("forcedROMode", is_readonly)
    editor.rebuildEditorState()
    js.window.document.documentElement.setAttribute("data-path-readonly", is_readonly and "true" or "false")
  end
}
```

# Schemas — controlled values for status fields

Constrains the `status` and other choice fields so users can only enter valid values. The editor will flag invalid values inline.

```space-lua
tag.define {
  name = "cpd-claim",
  schema = {
    type = "object",
    properties = {
      status      = { type = "string", enum = {"draft", "ready", "published"} },
      claim_type  = { type = "string", enum = {"evidence", "forward-looking"} },
      path        = { type = "string" },
      standard    = { type = "string" },
    },
  },
}

tag.define {
  name = "cpd",
  schema = {
    type = "object",
    properties = {
      status        = { type = "string", enum = {"draft", "complete"} },
      activity_type = { type = "string", enum = {"conference", "course", "workshop", "project", "teaching", "supervision", "reading", "writing", "other"} },
      hours         = { type = "number" },
    },
  },
}

tag.define {
  name = "capture",
  schema = {
    type = "object",
    properties = {
      status = { type = "string", enum = {"unprocessed", "processed"} },
    },
  },
}

tag.define {
  name = "path",
  schema = {
    type = "object",
    properties = {
      status = { type = "string", enum = {"active", "planned", "paused", "completed"} },
    },
  },
}

tag.define {
  name = "reflection",
  schema = {
    type = "object",
    properties = {
      framework = { type = "string", enum = {"gibbs", "era", "driscoll", "rolfe"} },
    },
  },
}

tag.define {
  name = "personal-statement",
  schema = {
    type = "object",
    properties = {
      status = { type = "string", enum = {"draft", "ready"} },
      path   = { type = "string" },
    },
  },
}

tag.define {
  name = "contact",
  schema = {
    type = "object",
    properties = {
      relationship_type = { type = "string", enum = {"collaborator", "mentor", "mentee", "peer", "senior-colleague", "conference-contact", "professional-body", "student", "other"} },
      status            = { type = "string", enum = {"active", "occasional", "dormant", "former"} },
      met_via           = { type = "string" },
      last_contact      = { type = "string" },
      next_contact      = { type = "string" },
    },
  },
}

tag.define {
  name = "credential",
  schema = {
    type = "object",
    properties = {
      credential_type  = { type = "string", enum = {"open-badge", "certification", "degree", "fellowship", "membership", "other"} },
      issuer           = { type = "string" },
      award_date       = { type = "string" },
      badge_url        = { type = "string" },
      badge_image      = { type = "string" },
      verification_url = { type = "string" },
      expires          = { type = "string" },
    },
  },
}

tag.define {
  name = "milestone",
  schema = {
    type = "object",
    properties = {
      status      = { type = "string", enum = {"planned", "reached", "missed"} },
      target_date = { type = "string" },
      path        = { type = "string" },
    },
  },
}
```

# Coverage helpers — used by Path dashboard pages

`pathCoverage(slug)` runs three queries (claims / CPD / reflections) for a
single Path and returns counts bucketed by criterion code. The heatmap and
gap-list helpers build on it; the per-criterion detail helper renders the
three lists for one criterion. The point of these helpers is so dashboard
pages stay readable — one Lua call per visual block instead of dozens of
inline queries.

```space-lua
-- Used inside page templates to fill in the `path:` (or `paths:`) YAML
-- field when a new CPD / claim / reflection is created. Behaviour:
--   0 active paths → returns "" (user fills in later, or hasn't set
--                    up Paths yet).
--   1 active path  → returns its slug silently (the only sensible
--                    choice — no need to ask).
--   2+ active paths → prompts via filterBox; user's choice returned.
--                    Cancel returns "" so the field is left blank
--                    rather than guessing wrong.
--
-- Memoises the choice in a session-scoped global so a follow-up call
-- to `selectedPathFramework()` in the same template can reuse it
-- without re-prompting.
function selectActivePath()
  local paths = query[[from p = tags.page where p.type == "path" and p.status == "active" select p]]
  if not paths or #paths == 0 then
    _lastSelectedPath = nil
    return ""
  end
  local function slug_of(p)
    return string.match(p.name, "paths/(.+)") or p.name
  end
  if #paths == 1 then
    _lastSelectedPath = paths[1]
    return slug_of(paths[1])
  end
  local options = {}
  for _, p in ipairs(paths) do
    local s = slug_of(p)
    table.insert(options, {
      name        = s,
      description = (p.title or s) .. " · " .. (p.framework or ""),
    })
  end
  local choice = editor.filterBox("Path", options, "Which Path is this for?")
  if not choice then
    _lastSelectedPath = nil
    return ""
  end
  for _, p in ipairs(paths) do
    if slug_of(p) == choice.name then
      _lastSelectedPath = p
      return choice.name
    end
  end
  return choice.name
end

-- Companion to selectActivePath(): returns the framework slug for the
-- Path the user just picked. Designed for use in the same template
-- evaluation, immediately after `${selectActivePath()}` ran.
function selectedPathFramework()
  return (_lastSelectedPath and _lastSelectedPath.framework) or ""
end

-- Derives a display title from the current page name for use inside
-- page templates. `network/benita-olivier` → `Benita Olivier`. Used to
-- pre-populate the H1 and identifying YAML fields when a template
-- creates a new page; saves the user from typing the same name twice.
function pageDisplayName()
  local n = editor.getCurrentPage()
  if not n or n == "" then return "" end
  local last = string.match(n, "[^/]+$") or n
  local title = last:gsub("-", " "):gsub("_", " ")
  title = title:gsub("(%a)([%w']*)", function(first, rest)
    return first:upper() .. rest
  end)
  return title
end

-- Renders a titled bullet-list link for a page. Uses `title` from
-- frontmatter when available; falls back to the raw page path.
function pageItem(p)
  local label = p.title or p.name
  return "- [[" .. p.name .. "|" .. label .. "]]"
end

-- Like pageItem but appends inline metadata: activity_type, path or
-- paths, and the activity date — rendered as ` · sep · separated`
-- after the title link. Used for the Recent CPD activity list on the
-- dashboard so users can scan without opening each page.
function cpdItem(p)
  local label = p.title or p.name
  local meta = {}
  if p.activity_type and p.activity_type ~= "" then
    table.insert(meta, tostring(p.activity_type))
  end
  if p.path and p.path ~= "" then
    table.insert(meta, tostring(p.path))
  end
  if type(p.paths) == "table" then
    for _, s in ipairs(p.paths) do
      if s and s ~= "" then table.insert(meta, tostring(s)) end
    end
  end
  if p.date then
    table.insert(meta, tostring(p.date):sub(1, 10))
  end
  local meta_str = #meta > 0 and ("  · _" .. table.concat(meta, " · ") .. "_") or ""
  return "- [[" .. p.name .. "|" .. label .. "]]" .. meta_str
end

-- Renders a transposed summary table of active Paths: each path is a
-- column, each metric is a row. Designed for ≤3 active paths at once
-- (a reasonable working constraint — most users pursue 1–2 recognition
-- routes at a time). Three queries total: paths, criteria, claims.
function activePathsOverview()
  local paths = query[[from p = tags.page where p.type == "path" and p.status == "active" order by p.target_date select p]]
  if not paths or #paths == 0 then
    return "_No active Paths. Use **Capture → Path** to start one._"
  end
  local all_criteria = query[[from c = tags.page where c.type == "criterion" select c]] or {}
  local all_claims = query[[from cl = tags.page where cl.type == "cpd-claim" select cl]] or {}

  local cols = {}
  for _, p in ipairs(paths) do
    local slug = string.match(p.name, "paths/(.+)") or p.name
    local fwk = p.framework or ""
    local total_criteria = 0
    local fwk_codes = {}
    for _, c in ipairs(all_criteria) do
      if c.framework == fwk then
        total_criteria = total_criteria + 1
        fwk_codes[c.code] = true
      end
    end
    local ready_count = 0
    local covered_codes = {}
    for _, cl in ipairs(all_claims) do
      if cl.path == slug then
        if cl.status == "ready" then ready_count = ready_count + 1 end
        if cl.standard and fwk_codes[cl.standard] then
          covered_codes[cl.standard] = true
        end
      end
    end
    local covered = 0
    for _ in pairs(covered_codes) do covered = covered + 1 end
    table.insert(cols, {
      title = p.title or slug,
      slug = slug,
      framework = fwk,
      criteria = covered .. " / " .. total_criteria,
      ready = tostring(ready_count),
      target = (p.target_date and p.target_date ~= "") and p.target_date or "—",
    })
  end

  -- Inline HTML — markdown tables choke on the empty leading cell
  -- `| | a | b |` and on the `|` inside wikilinks. Styled inline with
  -- a subtle indigo tint on the header row and label column to match
  -- the rest of Path's accent palette. CSS classes (.path-overview-*)
  -- carry the colour so theming stays in STYLE.md.
  local hdr = { dom.th { class = "path-overview-corner", "" } }
  for _, c in ipairs(cols) do
    table.insert(hdr, dom.th {
      class = "path-overview-head",
      dom.a { href = "/paths/" .. c.slug, c.title }
    })
  end
  local rows = { dom.tr(hdr) }

  local function metric_row(label, getter)
    local cells = { dom.td { class = "path-overview-label", label } }
    for _, c in ipairs(cols) do
      table.insert(cells, dom.td { class = "path-overview-value", getter(c) })
    end
    table.insert(rows, dom.tr(cells))
  end

  metric_row("Framework",        function(c) return c.framework end)
  metric_row("Criteria covered", function(c) return c.criteria end)
  metric_row("Claims ready",     function(c) return c.ready end)
  metric_row("Target",           function(c) return c.target end)

  return widget.html(dom.table {
    class = "path-overview",
    table.unpack(rows)
  })
end

-- Tasks scoped by Path. Tasks live inside CPD / claim / reflection
-- pages; a task "belongs to" a Path if its parent page has `path == slug`
-- (single-Path fields like claim.path) or `paths` list contains the
-- slug (multi-Path fields like cpd.paths). The join is done Lua-side
-- because LIQ across nested array fields with cross-table filtering
-- is fiddly. Returns a markdown list of `templates.taskItem(t)` lines
-- so checkbox toggling stays wired to the original task position.
function tasksForPath(slug, limit)
  limit = limit or 20
  local matching_pages = query[[
    from p = tags.page
    where p.path == slug or table.includes(p.paths or {}, slug)
    select p
  ]]
  local in_path = {}
  for _, p in ipairs(matching_pages or {}) do in_path[p.name] = true end

  local tasks = query[[from t = tags.task where not t.done order by t.pageLastModified desc]]
  local out = {}
  for _, t in ipairs(tasks or {}) do
    if in_path[t.page] then
      table.insert(out, templates.taskItem(t))
      if #out >= limit then break end
    end
  end
  if #out == 0 then return "_No open tasks for this Path._" end
  return table.concat(out, "")
end

-- Dashboard variant: every open task with a path chip showing which
-- Path it contributes to. Tasks live in two places:
--   1. Path landing pages (`paths/<slug>`) — added via the New task
--      command; the page name itself indicates the Path.
--   2. CPD / claim / reflection notes whose `path` or `paths` field
--      ties them to a Path (legacy / power-user case).
-- Tasks with no Path scope (e.g. tasks in the manual) are omitted.
function allOpenTasksByPath(limit)
  limit = limit or 30
  local pages_with_path = query[[
    from p = tags.page
    where p.path or (p.paths and #p.paths > 0)
    select p
  ]]
  local page_paths = {}
  for _, p in ipairs(pages_with_path or {}) do
    if p.path and p.path ~= "" then
      page_paths[p.name] = { p.path }
    elseif p.paths and #p.paths > 0 then
      page_paths[p.name] = p.paths
    end
  end

  local tasks = query[[from t = tags.task where not t.done order by t.pageLastModified desc]]
  local out = {}
  for _, t in ipairs(tasks or {}) do
    local paths = page_paths[t.page]
    -- A task on `paths/<slug>` (but not `paths/<slug>-coverage`) is
    -- scoped to that Path by virtue of where it lives.
    if not paths then
      local m = string.match(t.page or "", "^paths/(.+)$")
      if m and not string.find(m, "%-coverage$") then
        paths = { m }
      end
    end
    if paths and #paths > 0 then
      if #out >= limit then break end
      -- Render as: `- [ ] description ([[page@pos|source]]) · path-chip`
      -- SB's Task renderer scans for the first WikiLink with positional
      -- ref (page@pos) and wires the checkbox to it — order-independent.
      local desc = t.name or ""
      local ref = t.ref or ((t.page or "") .. "@" .. tostring(t.pos or 0))
      local source_link = "[[" .. ref .. "|source]]"
      local chips = {}
      for _, ps in ipairs(paths) do
        table.insert(chips, "[" .. ps .. "](paths/" .. ps .. ")")
      end
      table.insert(out,
        "- [ ] " .. desc
        .. " (" .. source_link .. ")"
        .. " · " .. table.concat(chips, " · ")
        .. "\n"
      )
    end
  end
  if #out == 0 then return "_No open tasks scoped to any Path. Use **+ Capture → Task** to add one._" end
  return table.concat(out, "")
end

function pathCoverage(slug)
  local out = {}

  local claims = query[[
    from p = tags.page
    where p.type == "cpd-claim" and p.path == slug
    select { standard = p.standard }
  ]]
  for _, c in ipairs(claims) do
    local s = c.standard or ""
    if s ~= "" then
      out[s] = out[s] or { claims = 0, cpd = 0, reflections = 0, evidence = 0 }
      out[s].claims = out[s].claims + 1
    end
  end

  local cpds = query[[
    from p = tags.page
    where p.type == "cpd" and table.includes(p.paths or {}, slug)
    select { standards = p.standards }
  ]]
  for _, c in ipairs(cpds) do
    for _, s in ipairs(c.standards or {}) do
      if s ~= "" then
        out[s] = out[s] or { claims = 0, cpd = 0, reflections = 0, evidence = 0 }
        out[s].cpd = out[s].cpd + 1
      end
    end
  end

  local refs = query[[
    from p = tags.page
    where p.type == "reflection" and table.includes(p.paths or {}, slug)
    select { standards = p.standards }
  ]]
  for _, c in ipairs(refs) do
    for _, s in ipairs(c.standards or {}) do
      if s ~= "" then
        out[s] = out[s] or { claims = 0, cpd = 0, reflections = 0, evidence = 0 }
        out[s].reflections = out[s].reflections + 1
      end
    end
  end

  local ev = query[[
    from p = tags.page
    where p.type == "evidence" and table.includes(p.paths or {}, slug)
    select { standards = p.standards }
  ]]
  for _, c in ipairs(ev) do
    for _, s in ipairs(c.standards or {}) do
      if s ~= "" then
        out[s] = out[s] or { claims = 0, cpd = 0, reflections = 0, evidence = 0 }
        out[s].evidence = out[s].evidence + 1
      end
    end
  end

  return out
end

-- Render a coverage heatmap as an HTML table. Single-hue indigo scale:
-- empty cells get a dashed border and "—" (absence ≠ score zero); filled
-- cells scale 1 → 5+ in indigo intensity. All styling lives in STYLE.md
-- under the .ph-* classes so the palette can be themed (light/dark) and
-- iterated without touching Lua.
function pathHeatmap(slug, criteria)
  local cov = pathCoverage(slug)
  local function level(n)
    if n == 0 then return 0
    elseif n == 1 then return 1
    elseif n == 2 then return 2
    elseif n == 3 then return 3
    elseif n == 4 then return 4
    else return 5 end
  end
  local function cell(n)
    local lvl = level(n)
    return dom.td {
      class = "ph-cell ph-" .. lvl,
      n == 0 and "—" or tostring(n),
    }
  end
  local rows = {
    dom.tr {
      dom.th { "Criterion" },
      dom.th { class = "ph-num", "Claims" },
      dom.th { class = "ph-num", "CPD" },
      dom.th { class = "ph-num", "Reflections" },
      dom.th { class = "ph-num", "Evidence" },
    }
  }
  for _, code in ipairs(criteria) do
    local r = cov[code] or { claims = 0, cpd = 0, reflections = 0, evidence = 0 }
    table.insert(rows, dom.tr {
      dom.td { class = "ph-label", code },
      cell(r.claims), cell(r.cpd), cell(r.reflections), cell(r.evidence),
    })
  end
  return widget.html(dom.table {
    class = "ph-table",
    table.unpack(rows)
  })
end

-- Builds a code → page-name map for criterion pages belonging to a framework.
-- Used by pathGaps and pathHeatmap to make criterion codes into wikilinks.
local function criterion_page_map(framework)
  local map = {}
  if not framework then return map end
  local crits = query[[
    from p = tags.page
    where p.type == "criterion" and p.framework == framework
    select p
  ]]
  for _, c in ipairs(crits) do
    if c.code then map[c.code] = c.name end
  end
  return map
end

-- Auto-derived gap list. Returns markdown listing any criterion that is
-- missing a claim, CPD entry, or reflection. Criterion codes are wikilinks
-- to their criterion pages so the user can navigate directly to fill the gap.
function pathGaps(slug, criteria)
  local cov = pathCoverage(slug)

  -- Look up the framework for this path so we can link criterion codes
  -- to their pages (e.g. "1.1" → [[criteria/uol-1-1|1.1]]).
  local path_pages = query[[from p = tags.page where p.type == "path" and p.slug == slug select p]]
  local framework = path_pages[1] and path_pages[1].framework
  local code_map = criterion_page_map(framework)

  local lines = {}
  for _, code in ipairs(criteria) do
    local r = cov[code] or { claims = 0, cpd = 0, reflections = 0, evidence = 0 }
    local missing = {}
    if r.claims == 0 then table.insert(missing, "claim") end
    if r.cpd == 0 then table.insert(missing, "CPD") end
    if r.reflections == 0 then table.insert(missing, "reflection") end
    if #missing > 0 then
      local page = code_map[code]
      local label = page and ("[[" .. page .. "|" .. code .. "]]") or ("**" .. code .. "**")
      table.insert(lines, "- " .. label .. " — missing: " .. table.concat(missing, ", "))
    end
  end
  if #lines == 0 then
    return "_Every criterion has at least one claim, CPD entry, and reflection. Move on to depth and quality._"
  end
  return table.concat(lines, "\n")
end

-- Render the three evidence lists for one criterion. Used in the
-- detailed per-criterion sections of a coverage dashboard.
function pathCriterionDetail(slug, code)
  local out = "**Claims**\n\n"
  local claims = query[[
    from p = tags.page
    where p.type == "cpd-claim" and p.path == slug and p.standard == code
    order by p.status, p.lastModified desc
  ]]
  if #claims > 0 then
    out = out .. template.each(claims, templates.fullPageItem)
  else
    out = out .. "_No claims mapped._\n"
  end

  out = out .. "\n**CPD**\n\n"
  local cpds = query[[
    from p = tags.page
    where p.type == "cpd"
      and table.includes(p.paths or {}, slug)
      and table.includes(p.standards or {}, code)
    order by p.date desc
  ]]
  if #cpds > 0 then
    out = out .. template.each(cpds, templates.fullPageItem)
  else
    out = out .. "_No CPD mapped._\n"
  end

  out = out .. "\n**Reflections**\n\n"
  local refs = query[[
    from p = tags.page
    where p.type == "reflection"
      and table.includes(p.paths or {}, slug)
      and table.includes(p.standards or {}, code)
    order by p.date desc
  ]]
  if #refs > 0 then
    out = out .. template.each(refs, templates.fullPageItem)
  else
    out = out .. "_No reflections mapped._\n"
  end

  return out
end
```

# Theme toggle (moon when light, sun when dark)

Two action buttons, one for each direction — CSS in [[STYLE]] hides whichever does not match the current theme.

```space-lua
-- Restore saved theme on load; fall back to system preference if no saved value
do
  local saved = js.window.localStorage.getItem("path-theme")
  if saved == "dark" then
    js.window.document.documentElement.setAttribute("data-theme", "dark")
  elseif saved == nil and js.window.matchMedia("(prefers-color-scheme: dark)").matches then
    js.window.document.documentElement.setAttribute("data-theme", "dark")
  end
end

local function toggleTheme()
  local html = js.window.document.documentElement
  local current = html.getAttribute("data-theme")
  if current == "dark" then
    html.removeAttribute("data-theme")
    js.window.localStorage.setItem("path-theme", "light")
  else
    html.setAttribute("data-theme", "dark")
    js.window.localStorage.setItem("path-theme", "dark")
  end
end

-- Priority controls left-to-right position: higher number = further left.
-- SB's built-in buttons appear to use integer priorities: Home ≈ 3, Open ≈ 3,
-- RunCmd ≈ 2. We use floats to slot our buttons between them.
-- At the same priority, the button registered LATER appears to the LEFT.
actionButton.define {
  icon = "moon",
  description = "Toggle dark mode",
  priority = 1,
  run = toggleTheme,
}

actionButton.define {
  icon = "sun",
  description = "Toggle light mode",
  priority = 1,
  run = toggleTheme,
}

-- Focus mode — priority 1.05, sits between SB's RunCmd (≈1.1) and Search.
-- This places it: ... RunCmd | FocusMode | Search | Theme.
actionButton.define {
  icon = "columns",
  description = "Focus mode — hide/restore panels (Ctrl-Alt-z)",
  priority = 1.05,
  run = function()
    editor.invokeCommand("Path: Toggle focus mode")
  end
}

-- Profile — priority 2.9, just under SB's Home/Open (≈3) so it slots
-- immediately after them rather than before.
actionButton.define {
  icon = "user",
  description = "Your profile",
  priority = 2.9,
  run = function()
    editor.navigate("profile")
  end
}
```


# Onboarding checklist helper

Generates a live markdown checklist for the Setup page. Each check
queries the space so the status updates as the user populates their portfolio.

```space-lua
function onboardingStatus()
  local steps = {}

  local function add(done, done_label, todo_label, hint)
    table.insert(steps, { done = done,
      label = done and done_label or todo_label,
      hint  = (not done) and hint or nil })
  end

  -- 1. Profile
  local profiles = query[[
    from p = tags.page
    where p.type == "profile" and p.full_name ~= nil and p.full_name ~= ""
    select p
  ]]
  local profile_ok = #profiles > 0
    and (profiles[1].full_name or "") ~= ""
    and profiles[1].full_name ~= "Your Name"
    and (profiles[1].job_title or "") ~= ""
    and profiles[1].job_title ~= "Your job title"
  add(profile_ok, "Profile filled", "Fill in your profile",
    "Open your profile page and add your name and job title. These appear on the cover page of every export.")

  -- 2. Framework
  local fw_content = ""
  if space.pageExists("_system/installed-frameworks") then
    fw_content = space.readPage("_system/installed-frameworks") or ""
  end
  add(string.find(fw_content, "slug:") ~= nil, "Framework installed", "Install a framework",
    "Open the command palette (Ctrl-/) and run Path: Add framework.")

  -- 3. Active Path
  local paths = query[[
    from p = tags.page where p.type == "path" and p.status == "active" select p
  ]]
  local path_label = "Path active"
  if #paths > 0 then
    path_label = "Path active: " .. (paths[1].title or paths[1].slug or paths[1].name or "")
  end
  add(#paths > 0, path_label, "Create a Path",
    "Use Ctrl-Alt-c → Path. If you installed a framework bundle, a Path scaffold was created automatically.")

  -- 4. CPD
  local cpds = query[[from p = tags.page where p.type == "cpd" select p]]
  add(#cpds > 0,
    #cpds .. " CPD " .. (#cpds == 1 and "activity" or "activities") .. " logged",
    "Log a CPD activity",
    "Use Ctrl-Alt-c → CPD activity to record a course, conference, project, reading session, or any other learning event.")

  -- 5. Reflection
  local refs = query[[from p = tags.page where p.type == "reflection" select p]]
  add(#refs > 0,
    #refs .. " " .. (#refs == 1 and "reflection" or "reflections") .. " written",
    "Write a reflection",
    "Use Ctrl-Alt-c → Reflection. Driscoll (What / So what / Now what) or ERA are the quickest frameworks to start.")

  -- 6. Claim
  local claims = query[[from p = tags.page where p.type == "cpd-claim" select p]]
  add(#claims > 0,
    #claims .. " " .. (#claims == 1 and "claim" or "claims") .. " written",
    "Write a claim",
    "Use Ctrl-Alt-c → Claim. A claim argues that a standard has been met. Start with a criterion where you already have evidence.")

  -- Count and build widget
  local done_count = 0
  for _, s in ipairs(steps) do if s.done then done_count = done_count + 1 end end
  local n = #steps
  local pct = n > 0 and math.floor(done_count / n * 100) or 0

  -- Progress header
  local summary_text = done_count == n
    and "All steps complete"
    or (done_count .. " of " .. n .. " steps complete")
  local header = dom.div {
    style = "margin-bottom:14px",
    dom.div { style = "font-size:12px;opacity:0.5;margin-bottom:5px;font-family:inherit", summary_text },
    dom.div {
      style = "height:3px;background:rgba(99,102,241,0.18);border-radius:2px",
      dom.div { style = "height:100%;width:" .. pct .. "%;background:#4f46e5;border-radius:2px" }
    }
  }

  -- Step rows
  local rows = {}
  for i, s in ipairs(steps) do
    local dot_style = s.done
      and "flex-shrink:0;width:24px;height:24px;border-radius:50%;background:#4f46e5;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;margin-top:1px"
      or  "flex-shrink:0;width:24px;height:24px;border-radius:50%;border:1.5px solid rgba(99,102,241,0.45);color:rgba(99,102,241,0.8);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;margin-top:1px"
    local dot = dom.div { style = dot_style, s.done and "✓" or tostring(i) }

    local label_style = "font-size:14px;line-height:1.4;font-family:inherit;" .. (s.done and "opacity:0.4" or "font-weight:500")
    local text_nodes = { dom.span { style = label_style, s.label } }
    if s.hint then
      table.insert(text_nodes, dom.span {
        style = "display:block;font-size:12px;opacity:0.45;margin-top:3px;line-height:1.5;font-family:inherit",
        s.hint
      })
    end

    local border = i < n and "border-bottom:1px solid rgba(128,128,128,0.1);" or ""
    table.insert(rows, dom.div {
      style = "display:flex;align-items:flex-start;gap:10px;padding:8px 0;" .. border,
      dot,
      dom.div { style = "flex:1", table.unpack(text_nodes) }
    })
  end

  return widget.html(dom.div { style = "padding:4px 0 2px", header, table.unpack(rows) })
end
```

# Path commands

The main entry point for creating new structured notes. Bound to `Ctrl-Alt-c`.

```space-lua
command.define {
  name = "Path: Capture",
  key = "Ctrl-Alt-c",
  run = function()
    local choice = editor.filterBox(
      "Capture",
      {
        {name = "CPD activity",    description = "Log an activity (course, conference, project, teaching)"},
        {name = "Reflection",       description = "Structured reflection — Gibbs, ERA, Driscoll, or Rolfe"},
        {name = "Claim",            description = "Argued statement that a criterion is met"},
        {name = "Future-claim",     description = "Forward-looking aspirations for a pillar (X.4 sections)"},
        {name = "Evidence",         description = "An artefact (PDF, image, certificate) supporting a claim or CPD entry"},
        {name = "Task",             description = "A to-do item — added to the current page"},
        {name = "Quick capture",    description = "An in-the-moment thought, not yet evidence"},
        {name = "Contact",          description = "A person in your professional network"},
        {name = "Credential",       description = "An award, badge, certification, or fellowship"},
        {name = "Path",             description = "A new goal you are working towards"},
        {name = "Milestone",          description = "A target date or checkpoint on a Path — planned, reached, or missed"},
        {name = "Personal statement", description = "A narrative introduction for a specific Path"},
      },
      "What do you want to capture?"
    )
    if not choice then return end
    if choice.name == "CPD activity" then
      editor.invokeCommand("Path: New CPD activity")
    elseif choice.name == "Reflection" then
      editor.invokeCommand("Path: New reflection")
    elseif choice.name == "Claim" then
      editor.invokeCommand("Path: New claim")
    elseif choice.name == "Future-claim" then
      editor.invokeCommand("Path: New future-contributions claim")
    elseif choice.name == "Evidence" then
      editor.invokeCommand("Path: New evidence")
    elseif choice.name == "Task" then
      editor.invokeCommand("Path: New task")
    elseif choice.name == "Quick capture" then
      editor.invokeCommand("Path: New quick capture")
    elseif choice.name == "Contact" then
      editor.invokeCommand("Path: New contact")
    elseif choice.name == "Credential" then
      editor.invokeCommand("Path: New credential")
    elseif choice.name == "Path" then
      editor.invokeCommand("Path: New Path")
    elseif choice.name == "Milestone" then
      editor.invokeCommand("Path: New milestone")
    elseif choice.name == "Personal statement" then
      editor.invokeCommand("Path: New personal statement")
    end
  end
}

-- Archive this Path — flips its `status` field on the path landing
-- page from `active` to either `completed` (goal achieved) or
-- `abandoned` (no longer pursuing). Content links remain intact:
-- claims, CPD entries, reflections, captures, and credentials still
-- reference the Path slug, providing a record of why they exist.
-- The dashboard's Active Paths view filters by `status == "active"`,
-- so archived Paths drop off automatically.
command.define {
  name = "Path: Archive this Path",
  run = function()
    local page = editor.getCurrentPage()
    if not page or page == "" then
      editor.flashNotification("Open a Path landing page first.", "error")
      return
    end
    local slug = string.match(page, "^paths/(.+)$")
    if not slug or string.find(slug, "%-coverage$") then
      editor.flashNotification("Run this command on a Path landing page (paths/<slug>).", "error")
      return
    end
    local content = space.readPage(page) or ""
    if not string.find(content, "type:%s*path") then
      editor.flashNotification("This page isn't typed as a Path.", "error")
      return
    end
    local choice = editor.filterBox(
      "Archive Path",
      {
        {name = "Completed",  description = "Goal achieved — submission successful, fellowship awarded, etc."},
        {name = "Abandoned",  description = "No longer pursuing this Path"},
        {name = "Cancel",     description = "Don't archive"},
      },
      "How would you describe this Path's outcome?"
    )
    if not choice or choice.name == "Cancel" then return end
    local new_status = string.lower(choice.name)
    -- Replace `status: <anything>` (mid-frontmatter) — Lua patterns
    -- don't have multiline anchors, so we anchor on the leading newline.
    local replaced
    local new_content = string.gsub(
      content,
      "(\nstatus:%s*)[^\n]*",
      "%1" .. new_status,
      1
    )
    if new_content == content then
      -- Try start-of-file (frontmatter starting with status:)
      new_content = string.gsub(content, "^(status:%s*)[^\n]*", "%1" .. new_status, 1)
    end
    space.writePage(page, new_content)
    editor.flashNotification(
      "Archived as " .. new_status .. ". Content links to this Path remain intact."
    )
    editor.navigate("index")
  end
}

-- Clean up done tasks — moves `- [x]` lines from every Path landing
-- page to `_system/archived-tasks`, with a date stamp for each batch.
-- Tasks aren't deleted (so a record is preserved); they accumulate in
-- the archive page in run-order. Done tasks remain visible on the
-- Path page (struck through) until the user runs this cleanup.
local function ensure_archive_page()
  local page = "_system/archived-tasks"
  if not space.pageExists(page) then
    space.writePage(page,
      "---\nreadonly: true\n---\n\n"
      .. "# Archived tasks\n\n"
      .. "_Tasks moved here by **Path: Clean up done tasks**. Most recent batch at the bottom._\n"
    )
  end
  return page
end

command.define {
  name = "Path: Clean up done tasks",
  run = function()
    local paths = query[[from p = tags.page where p.type == "path" select p]]
    if not paths or #paths == 0 then
      editor.flashNotification("No Paths found.")
      return
    end
    local archived_lines = {}
    local total_pages = 0
    for _, p in ipairs(paths) do
      local content = space.readPage(p.name) or ""
      local found = {}
      -- Capture done-task lines mid-file (preceded by newline)
      local cleaned = string.gsub(content, "\n([ \t]*%-%s*%[[xX]%][^\n]*)", function(line)
        table.insert(found, line)
        return ""
      end)
      -- Also handle a done task at the very start of the file
      cleaned = string.gsub(cleaned, "^([ \t]*%-%s*%[[xX]%][^\n]*\n?)", function(line)
        table.insert(found, (string.gsub(line, "\n$", "")))
        return ""
      end)
      if #found > 0 then
        total_pages = total_pages + 1
        for _, line in ipairs(found) do
          table.insert(archived_lines, line)
        end
        space.writePage(p.name, cleaned)
      end
    end
    if #archived_lines == 0 then
      editor.flashNotification("No done tasks to clean up.")
      return
    end
    -- Append archived lines to the archive page with a dated batch header
    local archive_page = ensure_archive_page()
    local existing = space.readPage(archive_page) or ""
    local trimmed = string.gsub(existing, "%s+$", "")
    local today = ""
    pcall(function() today = tostring(date.today()):sub(1, 10) end)
    local batch = "\n\n## " .. (today ~= "" and today or "Archive batch") .. "\n\n"
      .. table.concat(archived_lines, "\n") .. "\n"
    space.writePage(archive_page, trimmed .. batch)
    editor.flashNotification(
      "Archived " .. #archived_lines .. " done task(s) from "
      .. total_pages .. " Path page(s)."
    )
    if editor.getCurrentPage() and string.find(editor.getCurrentPage(), "^paths/") then
      editor.reloadPage()
    end
  end
}

-- New task — tasks are scoped to a Path (not to a specific note),
-- so they get appended to the Path's landing page under the
-- "Open tasks for this Path" section. Run from anywhere; the
-- selectActivePath helper handles pickling between active paths
-- (silent if only one). Task description is prompted; the resulting
-- `- [ ] description` lands on `paths/<slug>.md` and shows up on the
-- Path landing page and the dashboard's task list.
command.define {
  name = "Path: New task",
  run = function()
    local description = editor.prompt("Task:", "")
    if not description or description == "" then return end
    local slug = selectActivePath()
    if not slug or slug == "" then
      editor.flashNotification(
        "No active Path to attach this task to. Create a Path or set one to status: active first.",
        "error"
      )
      return
    end
    local page = "paths/" .. slug
    if not space.pageExists(page) then
      editor.flashNotification("Path landing page " .. page .. " not found.", "error")
      return
    end
    local content = space.readPage(page) or ""
    -- Locate the "Open tasks for this Path" section; append the task
    -- at the end of that section (just before the next ## heading,
    -- or at the end of the file if no section exists).
    local marker = "## Open tasks for this Path"
    local s = string.find(content, marker, 1, true)
    local new_content
    if not s then
      local trimmed = string.gsub(content, "%s+$", "")
      new_content = trimmed
        .. "\n\n## Open tasks for this Path\n\n- [ ] " .. description .. "\n"
    else
      local section_start = s + #marker
      local next_h2 = string.find(content, "\n##%s", section_start)
      local section_end = next_h2 or (#content + 1)
      local before = string.sub(content, 1, section_start - 1)
      local section = string.sub(content, section_start, section_end - 1)
      local after = string.sub(content, section_end)
      section = string.gsub(section, "%s+$", "")
      local new_section = section .. "\n\n- [ ] " .. description .. "\n"
      new_content = before .. new_section .. (after ~= "" and "\n" .. after or "")
    end
    space.writePage(page, new_content)
    if editor.getCurrentPage() == page then editor.reloadPage() end
    editor.flashNotification("Task added to " .. slug .. ".")
  end
}

-- Helper used by both export commands. The output format determines
-- whether the sidecar produces PDF (LaTeX template) or DOCX (Word).
local function path_export(output_format)
    -- Profile completeness check: full_name + job_title must be populated.
    local profile_results = query[[from p = tags.page where p.type == "profile" select p]]
    if #profile_results == 0 then
      editor.flashNotification("No profile page found. Click the user icon and fill it in first.")
      return
    end
    local profile = profile_results[1]
    local missing_profile = {}
    if not profile.full_name or profile.full_name == "" then
      table.insert(missing_profile, "full_name")
    end
    if not profile.job_title or profile.job_title == "" then
      table.insert(missing_profile, "job_title")
    end
    if #missing_profile > 0 then
      local proceed = editor.filterBox(
        "Profile incomplete",
        {
          {name = "Open profile to fix", description = "Recommended"},
          {name = "Export anyway",       description = "Will produce output with blank fields"},
          {name = "Cancel",              description = "Stop"},
        },
        "Profile is missing: " .. table.concat(missing_profile, ", ")
      )
      if not proceed or proceed.name == "Cancel" then return end
      if proceed.name == "Open profile to fix" then
        editor.navigate("profile")
        return
      end
    end

    local path_results = query[[from p = tags.page where p.type == "path" select p]]
    if #path_results == 0 then
      editor.flashNotification("No Paths defined. Create a Path first.")
      return
    end

    local options = {}
    for _, p in ipairs(path_results) do
      table.insert(options, {
        name = p.title or p.slug or p.name,
        description = "slug: " .. (p.slug or p.name),
      })
    end
    local choice = editor.filterBox("Export Path (" .. output_format .. ")", options, "Which Path?")
    if not choice then return end

    local slug = choice.description:gsub("^slug: ", "")

    local pages = {}

    local statements = query[[
      from p = tags.page
      where p.type == "personal-statement" and p.path == slug and p.status == "ready"
      select p
    ]]
    for _, s in ipairs(statements) do
      table.insert(pages, s.name)
    end

    local claims = query[[
      from p = tags.page
      where p.type == "cpd-claim" and p.path == slug and p.status == "ready"
      order by p.standard
      select p
    ]]
    local drafts = query[[
      from p = tags.page
      where p.type == "cpd-claim" and p.path == slug and p.status ~= "ready"
      select p
    ]]

    if #claims == 0 then
      editor.flashNotification("No claims marked 'ready' for this Path. Mark some claims as ready first.")
      return
    end

    if #drafts > 0 then
      local proceed = editor.filterBox(
        "Drafts not ready",
        {
          {name = "Export ready claims only", description = #drafts .. " draft(s) will be excluded"},
          {name = "Cancel", description = "Stop and finish the drafts first"},
        },
        #drafts .. " draft claim(s) are not yet 'ready'. Continue?"
      )
      if not proceed or proceed.name == "Cancel" then return end
    end

    for _, c in ipairs(claims) do
      table.insert(pages, c.name)
    end

    editor.flashNotification("Compiling " .. output_format:upper() .. " — this can take 30 seconds…")

    local title_str = (choice.name or slug) .. " — Submission"
    local response = net.proxyFetch("http://172.28.0.10:8000/compile", {
      method = "POST",
      headers = {["Content-Type"] = "application/json"},
      body = { pages = pages, title = title_str, slug = slug, format = output_format },
    })

    if not response or not response.ok then
      local body_preview = tostring((response and response.body) or "")
      editor.flashNotification("Export failed (HTTP " .. tostring(response and response.status or "?") .. "): " .. body_preview:sub(1, 300))
      return
    end

    local data = response.body
    if not data or not data.filename then
      editor.flashNotification("No filename returned. Got: " .. tostring(data))
      return
    end

    editor.flashNotification(output_format:upper() .. " saved to portfolio/exports/" .. data.filename)
end

command.define {
  name = "Path: Export to Word",
  run = function() path_export("docx") end
}

-- ============================================================
-- Framework registry — install Path bundles from a remote source.
-- ============================================================
-- A bundle is a folder of .md files. Each install copies them into the
-- user's space at the relative path declared in the bundle's info.json.
-- Default registry is on GitHub; override via:
--   config.set("path.framework_registry", "https://your-mirror/...")

-- Registry URL = base path that contains index.json plus one folder per
-- framework. GitHub raw URLs require the branch name in the path; we
-- default to `master` because the canonical registry uses that branch.
-- To point at a different registry (private fork, personal mirror), set:
--   config.set("path.framework_registry", "https://raw.githubusercontent.com/<user>/<repo>/<branch>")
local DEFAULT_REGISTRY = "https://raw.githubusercontent.com/michael-rowe/path-frameworks/master"

local function registry_url()
  return config.get("path.framework_registry", DEFAULT_REGISTRY)
end

-- Wrap proxyFetch with explicit error messages. proxyFetch returns
-- { ok=false, status, body=<error text> } on non-200; we surface that
-- text so a 404 reports "HTTP 404: 404: Not Found" rather than a
-- vague "no frameworks" symptom downstream.
local function fetch_json(url)
  local r = net.proxyFetch(url, { method = "GET" })
  if not r then return nil, "no response from proxy" end
  if not r.ok then
    local body_preview = tostring(r.body or ""):sub(1, 100)
    return nil, "HTTP " .. tostring(r.status or "?") .. " (" .. body_preview .. ")"
  end
  -- Defensive parse: proxyFetch decodes JSON when the response
  -- content-type is application/json, but raw.githubusercontent.com
  -- sometimes serves .json with text/plain. Handle both.
  if type(r.body) == "string" then
    -- js.tolua converts the JS object from JSON.parse into a Lua table
    -- so ipairs/.field access works as expected.
    local ok, parsed = pcall(function() return js.tolua(js.window.JSON.parse(r.body)) end)
    if not ok then return nil, "JSON parse failed: " .. tostring(parsed):sub(1, 200) end
    return parsed, nil
  end
  return r.body, nil
end

local function fetch_text(url)
  local r = net.proxyFetch(url, { method = "GET" })
  if not r then return nil, "no response from proxy" end
  if not r.ok then
    return nil, "HTTP " .. tostring(r.status or "?")
  end
  return r.body, nil
end

local function record_installation(slug, name, version)
  local installed_path = "_system/installed-frameworks"
  local existing = ""
  if space.pageExists(installed_path) then
    existing = space.readPage(installed_path) or ""
  end
  -- Strip any prior entry for this slug; append a fresh one.
  local pattern = "\n?%- slug: " .. slug .. " |[^\n]*"
  existing = existing:gsub(pattern, "")
  local entry = "- slug: " .. slug .. " | name: " .. name
    .. " | version: " .. version .. " | installed: " .. date.today()
  local body = existing == "" and "# Installed frameworks\n\n" or existing
  if not body:match("\n$") then body = body .. "\n" end
  space.writePage(installed_path, body .. entry)
end

local function install_framework(fw, base, allow_overwrite)
  local info, err = fetch_json(base .. "/" .. fw.slug .. "/info.json")
  if not info then
    editor.flashNotification("Could not fetch info.json for " .. fw.slug .. ": " .. err)
    return false
  end
  local files = info.files or {}
  if #files == 0 then
    editor.flashNotification("Bundle has no files")
    return false
  end

  -- Conflict detection
  if not allow_overwrite then
    local conflicts = {}
    for _, f in ipairs(files) do
      local page = f:gsub("%.md$", "")
      if space.pageExists(page) then table.insert(conflicts, f) end
    end
    if #conflicts > 0 then
      local proceed = editor.filterBox(
        "Existing files will be overwritten",
        {
          {name = "Overwrite", description = #conflicts .. " file(s) will be replaced"},
          {name = "Cancel",    description = "Do nothing"},
        },
        #conflicts .. " file(s) already exist"
      )
      if not proceed or proceed.name == "Cancel" then return false end
    end
  end

  editor.flashNotification("Installing " .. fw.name .. " (" .. #files .. " files)…")
  local installed = 0
  for _, f in ipairs(files) do
    local body, ferr = fetch_text(base .. "/" .. fw.slug .. "/" .. f)
    if body then
      local page = f:gsub("%.md$", "")
      space.writePage(page, body)
      installed = installed + 1
    end
  end

  record_installation(fw.slug, fw.name, info.version or "?")

  editor.flashNotification("Installed " .. installed .. "/" .. #files .. " files from " .. fw.name)
  if info.entry_page then editor.navigate(info.entry_page) end
  return true
end

command.define {
  name = "Path: Add framework",
  run = function()
    local base = registry_url()
    local index, err = fetch_json(base .. "/index.json")
    if not index then
      editor.flashNotification("Could not reach registry: " .. err)
      return
    end
    local frameworks = index.frameworks or {}
    if #frameworks == 0 then
      editor.flashNotification("Registry has no frameworks")
      return
    end

    local options = {}
    for _, fw in ipairs(frameworks) do
      table.insert(options, {
        name        = fw.name,
        description = (fw.regulator or "?") .. " · v" .. (fw.version or "?") .. " · " .. (fw.description or ""),
      })
    end
    local choice = editor.filterBox("Add framework", options, "Which framework?")
    if not choice then return end

    local picked = nil
    for _, fw in ipairs(frameworks) do
      if fw.name == choice.name then picked = fw; break end
    end
    if picked then install_framework(picked, base, false) end
  end
}

command.define {
  name = "Path: Check framework updates",
  run = function()
    local installed_path = "_system/installed-frameworks"
    if not space.pageExists(installed_path) then
      editor.flashNotification("No frameworks installed yet — try Path: Add framework first")
      return
    end
    local base = registry_url()
    local index, err = fetch_json(base .. "/index.json")
    if not index then
      editor.flashNotification("Could not reach registry: " .. err)
      return
    end

    local installed_text = space.readPage(installed_path) or ""
    local updates = {}
    for _, fw in ipairs(index.frameworks or {}) do
      local installed_version = string.match(
        installed_text,
        "slug: " .. fw.slug .. " |[^\n]*version: ([^%s|]+)"
      )
      if installed_version and installed_version ~= fw.version then
        table.insert(updates, {
          name        = fw.name,
          description = installed_version .. " → " .. fw.version,
          _fw         = fw,
        })
      end
    end

    if #updates == 0 then
      editor.flashNotification("All installed frameworks are up to date")
      return
    end
    local choice = editor.filterBox("Update framework", updates, #updates .. " update(s) available")
    if not choice then return end
    for _, u in ipairs(updates) do
      if u.name == choice.name then
        install_framework(u._fw, base, true)
        return
      end
    end
  end
}

command.define {
  name = "Path: New reflection",
  run = function()
    local choice = editor.filterBox(
      "Reflection framework",
      {
        {name = "Gibbs",    description = "Six stages: description, feelings, evaluation, analysis, conclusion, action plan"},
        {name = "ERA",      description = "Experience, Reflection, Action — concise three-stage cycle"},
        {name = "Driscoll", description = "What? So what? Now what? — pragmatic three-stage model"},
        {name = "Rolfe",    description = "What? So what? Now what? — descriptive, theoretical, action-oriented"},
      },
      "Pick a reflective framework"
    )
    if not choice then return end
    if choice.name == "Gibbs" then
      editor.invokeCommand("Path: New reflection (Gibbs)")
    elseif choice.name == "ERA" then
      editor.invokeCommand("Path: New reflection (ERA)")
    elseif choice.name == "Driscoll" then
      editor.invokeCommand("Path: New reflection (Driscoll)")
    elseif choice.name == "Rolfe" then
      editor.invokeCommand("Path: New reflection (Rolfe)")
    end
  end
}
```

# Announcements

Fetches a news feed from the framework registry (`news.json` at the registry
root) and renders it as a feed of admonitions on **Announcements.md**. The
plug auto-refreshes once per session via the silent command below; users can
also run **Path: Check announcements** by hand.

Storage:
- `_system/announcements-cache` — last fetched JSON (so the page renders offline)
- `_system/announcements-read` — list of dismissed announcement IDs

```space-lua
local DEFAULT_NEWS_URL = "https://raw.githubusercontent.com/michael-rowe/path-frameworks/master/news.json"
local CACHE_PAGE = "_system/announcements-cache"
local READ_PAGE  = "_system/announcements-read"

local function news_url()
  return config.get("path.news_url", DEFAULT_NEWS_URL)
end

-- Fetch the news.json feed. Returns the raw body string on success so we
-- can write it verbatim into the cache page (and re-parse on render).
local function fetch_news_raw()
  local r = net.proxyFetch(news_url(), { method = "GET" })
  if not r then return nil, "no response" end
  if not r.ok then return nil, "HTTP " .. tostring(r.status or "?") end
  if type(r.body) ~= "string" then
    -- proxyFetch may have parsed JSON when the server returned application/json;
    -- re-stringify so we cache the canonical text form. r.body is already a JS
    -- value at this point so JSON.stringify accepts it directly.
    local ok, s = pcall(function() return js.window.JSON.stringify(r.body) end)
    if ok and s then return s end
    return nil, "unexpected body type"
  end
  -- Validate parses as JSON before caching, so a HTML 404 page never poisons the cache.
  local ok = pcall(function() return js.window.JSON.parse(r.body) end)
  if not ok then return nil, "invalid JSON" end
  return r.body, nil
end

local function load_cached_announcements()
  if not space.pageExists(CACHE_PAGE) then return {} end
  local content = space.readPage(CACHE_PAGE) or ""
  local json_str = content:match("```json%s*(.-)%s*```")
  if not json_str then return {} end
  local ok, parsed = pcall(function() return js.tolua(js.window.JSON.parse(json_str)) end)
  if not ok or not parsed or not parsed.announcements then return {} end
  return parsed.announcements
end

local function load_read_set()
  if not space.pageExists(READ_PAGE) then return {} end
  local content = space.readPage(READ_PAGE) or ""
  local set = {}
  for id in content:gmatch("%-%s+([%w%-_%.]+)") do set[id] = true end
  return set
end

-- Public: count of unread announcements. Used by the Navigator badge.
function announcementsUnread()
  local items = load_cached_announcements()
  local read = load_read_set()
  local n = 0
  for _, a in ipairs(items) do if a.id and not read[a.id] then n = n + 1 end end
  return n
end

local SEVERITY_ADMON = {
  info     = "note",
  update   = "tip",
  warning  = "warning",
  critical = "danger",
}

-- Public: render the feed as markdown for Announcements.md.
function announcementsList()
  local items = load_cached_announcements()
  if #items == 0 then
    return "_No announcements yet. The feed refreshes automatically each session — or run **Path: Check announcements** now._"
  end
  local read = load_read_set()
  -- Newest first
  table.sort(items, function(a, b) return (a.date or "") > (b.date or "") end)
  local out = ""
  for _, a in ipairs(items) do
    local sev = SEVERITY_ADMON[a.severity or "info"] or "note"
    local marker = read[a.id] and " · _read_" or " · **unread**"
    out = out .. "> **" .. sev .. "** **" .. (a.title or "") .. "**  \n"
    out = out .. "> " .. (a.date or "") .. marker .. "\n>\n"
    for line in (a.body or ""):gmatch("[^\n]+") do
      out = out .. "> " .. line .. "  \n"
    end
    if a.action then
      if a.action.type == "command" and a.action.command then
        out = out .. ">\n> _Action:_ run **" .. a.action.command .. "**"
        if a.action.label then out = out .. " — " .. a.action.label end
        out = out .. "  \n"
      elseif a.action.type == "page" and a.action.target then
        out = out .. ">\n> _See:_ [[" .. a.action.target .. "]]  \n"
      elseif a.action.type == "url" and a.action.url then
        out = out .. ">\n> _Link:_ [" .. (a.action.label or a.action.url) .. "](" .. a.action.url .. ")  \n"
      end
    end
    out = out .. "\n\n"
  end
  out = out .. "---\n\n_Run **Path: Mark all announcements as read** to clear the badge in the Navigator._\n"
  return out
end

-- Refresh the cache, returning whether the network call succeeded.
local function refresh_cache()
  local raw, err = fetch_news_raw()
  if not raw then return false, err end
  local content = "---\ntype: announcements-cache\n---\n\n```json\n" .. raw .. "\n```\n"
  local ok = pcall(function() space.writePage(CACHE_PAGE, content) end)
  return ok, ok and nil or "write failed"
end

-- User-facing: refresh + flash the count delta.
command.define {
  name = "Path: Check announcements",
  run = function()
    local before = announcementsUnread()
    local ok, err = refresh_cache()
    if not ok then
      editor.flashNotification("Could not reach announcements feed: " .. (err or ""), "error")
      return
    end
    local after = announcementsUnread()
    local diff = after - before
    if diff > 0 then
      editor.flashNotification(diff .. " new announcement(s)")
    else
      editor.flashNotification("Announcements up to date")
    end
    pcall(function() editor.invokeCommand("Path: Refresh navigator") end)
    if editor.getCurrentPage() == "Announcements" then editor.reloadPage() end
  end
}

-- Silent variant for the plug's session-start auto-refresh. No notifications,
-- no page reload — just updates the cache so the next render is current.
command.define {
  name = "Path: Refresh announcements (silent)",
  run = function() refresh_cache() end
}

command.define {
  name = "Path: Mark all announcements as read",
  run = function()
    local items = load_cached_announcements()
    local lines = "---\ntype: announcements-read\n---\n\n"
    for _, a in ipairs(items) do
      if a.id then lines = lines .. "- " .. a.id .. "\n" end
    end
    space.writePage(READ_PAGE, lines)
    editor.flashNotification("All announcements marked as read")
    -- Force the Navigator to re-render so the badge picks up the new
    -- read-state without waiting for the next page navigation.
    pcall(function() editor.invokeCommand("Path: Refresh navigator") end)
    if editor.getCurrentPage() == "Announcements" then editor.reloadPage() end
  end
}

command.define {
  name = "Path: Mark announcement as read",
  run = function()
    local items = load_cached_announcements()
    if #items == 0 then editor.flashNotification("No announcements"); return end
    local read = load_read_set()
    local options = {}
    for _, a in ipairs(items) do
      if a.id and not read[a.id] then
        table.insert(options, {
          name = a.id,
          description = (a.title or "") .. " · " .. (a.date or ""),
        })
      end
    end
    if #options == 0 then editor.flashNotification("Nothing unread"); return end
    local choice = editor.filterBox("Mark as read", options, "Pick an announcement")
    if not choice then return end
    local existing = ""
    if space.pageExists(READ_PAGE) then existing = space.readPage(READ_PAGE) or "" end
    if existing == "" then existing = "---\ntype: announcements-read\n---\n\n" end
    existing = existing .. "- " .. choice.name .. "\n"
    space.writePage(READ_PAGE, existing)
    pcall(function() editor.invokeCommand("Path: Refresh navigator") end)
    if editor.getCurrentPage() == "Announcements" then editor.reloadPage() end
  end
}
```

# Launch redirect toggle

Reads `_system/onboarding` to determine whether the user has dismissed the
launch redirect, and renders the appropriate toggle link on Setup.

```space-lua
function onboardingLaunchToggle()
  local redirect = true
  pcall(function()
    local content = space.readPage("_system/onboarding") or ""
    -- File exists with redirect: false means the user has dismissed it
    redirect = string.find(content, "redirect: false") == nil
  end)
  if not redirect then
    return "_This page will not open automatically on launch. Run **Path: Re-enable launch redirect** from the command palette to restore it._"
  else
    return "_This page opens automatically on launch. Run **Path: Dismiss launch redirect** from the command palette to stop it._"
  end
end

command.define {
  name = "Path: Dismiss launch redirect",
  run = function()
    space.writePage("_system/onboarding", "redirect: false\n")
    editor.reloadPage()
  end
}

command.define {
  name = "Path: Re-enable launch redirect",
  run = function()
    space.writePage("_system/onboarding", "redirect: true\n")
    editor.reloadPage()
  end
}
```

# CPD activity calendar

GitHub-style contribution grid showing CPD activity over the last 52 weeks,
shaded by hours. Call as `${cpdCalendar()}` for all entries, or
`${cpdCalendar("path-slug")}` to filter by a specific Path.

```space-lua
-- Julian Day Number helpers for date arithmetic without os.date

local function to_jdn(y, m, d)
  local a = math.floor((14 - m) / 12)
  local yy = y + 4800 - a
  local mm = m + 12 * a - 3
  return d + math.floor((153*mm+2)/5) + 365*yy
         + math.floor(yy/4) - math.floor(yy/100) + math.floor(yy/400) - 32045
end

local function from_jdn(n)
  local a  = n + 32044
  local b  = math.floor((4*a+3)/146097)
  local c  = a - math.floor(146097*b/4)
  local dd = math.floor((4*c+3)/1461)
  local e  = c - math.floor(1461*dd/4)
  local mm = math.floor((5*e+2)/153)
  return 100*b + dd - 4800 + math.floor(mm/10),
         mm + 3 - 12*math.floor(mm/10),
         e - math.floor((153*mm+2)/5) + 1
end

-- Day of week from a JDN. Convention: JDN 0 fell on a Monday (per the
-- canonical Julian Day definition), so `jdn % 7` directly maps to
-- 0 = Mon, 6 = Sun. The previous `(jdn + 1) % 7` was off by one and
-- placed Fridays into the Saturday column.
local function jdn_dow(jdn) return jdn % 7 end

function cpdCalendar(path_slug)
  -- Query CPD entries
  local entries
  if path_slug then
    entries = query[[ from p = tags.page where p.type == "cpd" and p.path == path_slug select p ]]
  else
    entries = query[[ from p = tags.page where p.type == "cpd" select p ]]
  end

  -- Build date → hours map
  local hmap, total_h, n_days = {}, 0, 0
  for _, e in ipairs(entries) do
    if e.date then
      local s = tostring(e.date):sub(1, 10)
      local hrs = tonumber(e.hours) or 0
      if not hmap[s] then hmap[s] = 0; n_days = n_days + 1 end
      hmap[s]  = hmap[s] + hrs
      total_h  = total_h + hrs
    end
  end

  -- Today's date via date module
  local today_str = nil
  pcall(function() today_str = tostring(date.today()):sub(1, 10) end)
  if not (today_str and #today_str == 10) then
    return widget.html(dom.div {
      style = "opacity:0.4;font-size:13px;font-family:inherit",
      "Calendar unavailable."
    })
  end
  local ty = tonumber(today_str:sub(1,4))
  local tm = tonumber(today_str:sub(6,7))
  local td = tonumber(today_str:sub(9,10))
  local today_jdn  = to_jdn(ty, tm, td)
  local start_jdn  = today_jdn - jdn_dow(today_jdn) - 51 * 7  -- Monday, 52 weeks back
  local n_weeks    = 52

  -- Month labels: stamp the first week a new month appears
  local MONTHS = {"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"}
  local month_lbl, prev_m = {}, nil
  for w = 0, n_weeks - 1 do
    local _, wm = from_jdn(start_jdn + w * 7)
    if wm ~= prev_m then month_lbl[w] = MONTHS[wm]; prev_m = wm end
  end

  -- Cell style by hours
  local CB = "width:11px;height:11px;border-radius:2px;"
  local function cell_bg(h)
    if     h <= 0 then return CB .. "background:transparent;border:1px dashed rgba(99,102,241,0.2)"
    elseif h < 1  then return CB .. "background:#eef2ff"
    elseif h < 2  then return CB .. "background:#c7d2fe"
    elseif h < 4  then return CB .. "background:#a5b4fc"
    elseif h < 6  then return CB .. "background:#818cf8"
    else               return CB .. "background:#4f46e5"
    end
  end

  -- Month header row
  local hdr = { dom.td { style = "width:26px" } }
  for w = 0, n_weeks - 1 do
    table.insert(hdr, dom.td {
      style = "font-size:10px;opacity:0.45;padding-bottom:3px;font-family:inherit;white-space:nowrap",
      month_lbl[w] or ""
    })
  end

  -- Seven day rows
  local DAY_LBL = {"Mon","","Wed","","Fri","","Sun"}
  local rows = { dom.tr(hdr) }
  for d_idx = 0, 6 do
    local cells = { dom.td {
      style = "font-size:10px;opacity:0.4;padding-right:4px;vertical-align:middle;white-space:nowrap;font-family:inherit",
      DAY_LBL[d_idx + 1]
    }}
    for w = 0, n_weeks - 1 do
      local jdn = start_jdn + w * 7 + d_idx
      if jdn <= today_jdn then
        local cy, cm, cd = from_jdn(jdn)
        local ds  = string.format("%04d-%02d-%02d", cy, cm, cd)
        local hrs = hmap[ds] or 0
        local tip = hrs > 0 and (ds .. ": " .. string.format("%.1f", hrs) .. "h") or ds
        table.insert(cells, dom.td { style = cell_bg(hrs), title = tip })
      else
        table.insert(cells, dom.td { style = "width:11px;height:11px" })
      end
    end
    table.insert(rows, dom.tr(cells))
  end

  -- Legend
  local LEGEND = {
    { bg = "background:transparent;border:1px dashed rgba(99,102,241,0.2)", lbl = "None" },
    { bg = "background:#eef2ff", lbl = "<1h"  },
    { bg = "background:#c7d2fe", lbl = "1–2h" },
    { bg = "background:#a5b4fc", lbl = "2–4h" },
    { bg = "background:#818cf8", lbl = "4–6h" },
    { bg = "background:#4f46e5", lbl = "6h+"  },
  }
  local leg = { dom.span { style = "font-size:10px;opacity:0.4;margin-right:6px;font-family:inherit", "Hours:" } }
  for _, le in ipairs(LEGEND) do
    table.insert(leg, dom.span {
      style = "display:inline-flex;align-items:center;gap:3px;margin-right:8px;font-size:10px;opacity:0.55;font-family:inherit",
      dom.span { style = "display:inline-block;width:9px;height:9px;border-radius:2px;" .. le.bg },
      le.lbl
    })
  end

  -- Summary header
  local summary = total_h > 0
    and ("CPD activity — last 12 months · " .. string.format("%.1f", total_h)
         .. "h across " .. n_days .. (n_days == 1 and " day" or " days"))
    or  "CPD activity — last 12 months · no entries yet"

  return widget.html(dom.div {
    style = "padding:4px 0",
    dom.div { style = "font-size:12px;opacity:0.5;margin-bottom:6px;font-family:inherit", summary },
    dom.table { style = "border-collapse:separate;border-spacing:2px", table.unpack(rows) },
    dom.div { style = "margin-top:6px;display:flex;align-items:center;flex-wrap:wrap", table.unpack(leg) }
  })
end

-- Compact month-only variant of cpdCalendar — for the dashboard, where
-- the full 12-month view is too wide. Renders a standard 7-column
-- (Mon–Sun) grid for the current calendar month, with day numbers in
-- each cell and the same indigo intensity scale for hours.
function cpdCalendarMonth(path_slug)
  local entries
  if path_slug then
    entries = query[[from p = tags.page where p.type == "cpd" and p.path == path_slug select p]]
  else
    entries = query[[from p = tags.page where p.type == "cpd" select p]]
  end

  local hmap = {}
  for _, e in ipairs(entries) do
    if e.date then
      local s = tostring(e.date):sub(1, 10)
      hmap[s] = (hmap[s] or 0) + (tonumber(e.hours) or 0)
    end
  end

  local today_str
  pcall(function() today_str = tostring(date.today()):sub(1, 10) end)
  if not today_str or #today_str ~= 10 then
    return widget.html(dom.div { style = "opacity:0.4;font-size:13px", "Calendar unavailable." })
  end
  local ty = tonumber(today_str:sub(1,4))
  local tm = tonumber(today_str:sub(6,7))
  local td = tonumber(today_str:sub(9,10))
  local today_jdn = to_jdn(ty, tm, td)

  local first_jdn = to_jdn(ty, tm, 1)
  local first_dow = jdn_dow(first_jdn)
  local nm_y, nm_m = ty, tm + 1
  if nm_m > 12 then nm_m = 1; nm_y = nm_y + 1 end
  local _, _, last_d = from_jdn(to_jdn(nm_y, nm_m, 1) - 1)

  local month_h, month_days = 0, 0
  local prefix = string.format("%04d-%02d", ty, tm)
  for k, v in pairs(hmap) do
    if k:sub(1, 7) == prefix then
      month_h = month_h + v
      month_days = month_days + 1
    end
  end

  local CB = "width:22px;height:22px;border-radius:3px;text-align:center;font-size:11px;line-height:22px;font-family:inherit;"
  local function cell_bg(h)
    if     h <= 0 then return CB .. "background:transparent;border:1px dashed rgba(99,102,241,0.2);color:rgba(0,0,0,0.3)"
    elseif h < 1  then return CB .. "background:#eef2ff;color:#312e81"
    elseif h < 2  then return CB .. "background:#c7d2fe;color:#312e81"
    elseif h < 4  then return CB .. "background:#a5b4fc;color:#1e1b4b"
    elseif h < 6  then return CB .. "background:#818cf8;color:white"
    else               return CB .. "background:#4f46e5;color:white"
    end
  end

  local DAY_LBL = {"Mon","Tue","Wed","Thu","Fri","Sat","Sun"}
  local hdr = {}
  for _, lbl in ipairs(DAY_LBL) do
    table.insert(hdr, dom.td {
      style = "font-size:10px;opacity:0.45;padding-bottom:3px;text-align:center;font-family:inherit;width:22px",
      lbl
    })
  end
  local rows = { dom.tr(hdr) }

  local row = {}
  for i = 0, first_dow - 1 do
    table.insert(row, dom.td { style = "width:22px;height:22px" })
  end
  for d = 1, last_d do
    local jdn = to_jdn(ty, tm, d)
    local ds = string.format("%04d-%02d-%02d", ty, tm, d)
    local hrs = hmap[ds] or 0
    if jdn > today_jdn then
      table.insert(row, dom.td { style = "width:22px;height:22px;color:rgba(0,0,0,0.15);text-align:center;font-size:11px;line-height:22px;font-family:inherit", tostring(d) })
    else
      local tip = hrs > 0 and (ds .. ": " .. string.format("%.1f", hrs) .. "h") or ds
      table.insert(row, dom.td { style = cell_bg(hrs), title = tip, tostring(d) })
    end
    if jdn_dow(jdn) == 6 then
      table.insert(rows, dom.tr(row))
      row = {}
    end
  end
  if #row > 0 then
    while #row < 7 do
      table.insert(row, dom.td { style = "width:22px;height:22px" })
    end
    table.insert(rows, dom.tr(row))
  end

  local MONTHS = {"January","February","March","April","May","June","July","August","September","October","November","December"}
  local summary = string.format("%s %d · %.1fh across %d %s",
    MONTHS[tm], ty, month_h, month_days,
    month_days == 1 and "day" or "days")

  return widget.html(dom.div {
    style = "padding:4px 0",
    dom.div { style = "font-size:12px;opacity:0.5;margin-bottom:6px;font-family:inherit", summary },
    dom.table { style = "border-collapse:separate;border-spacing:2px", table.unpack(rows) }
  })
end

-- Activity calendar: counts every record the user touched (cpd,
-- reflection, credential, claim, capture) on each day of the current
-- month, GitHub-contributions style. Uses `lastModified` (when the file
-- was last edited) rather than the YAML `date` field, so logging an old
-- activity today shows up today, not on the activity's actual date.
-- Intensity scales by record count.
function activityCalendarMonth(path_slug)
  local cmap = {}  -- YYYY-MM-DD -> count of records touched that day
  -- Path-slug filtering happens in Lua: SB's query language doesn't
  -- expose a "list contains" predicate against the multi-valued `paths` field.
  local function in_path(p)
    if not path_slug then return true end
    if p.path == path_slug then return true end
    if type(p.paths) == "table" then
      for _, s in ipairs(p.paths) do if s == path_slug then return true end end
    end
    return false
  end
  -- SB's index stores `lastModified` as a number-or-string depending on
  -- code path; the JS Date constructor handles both. We go via the JS
  -- bridge because space-lua doesn't expose os.date or a date.fromTs.
  local function ts_to_date_str(value)
    if value == nil or value == "" then return nil end
    local s
    pcall(function()
      s = tostring(js.new(js.window.Date, value):toISOString()):sub(1, 10)
    end)
    if s and #s == 10 then return s end
    -- Fallback: numeric ms via JDN math
    local n = tonumber(value)
    if n then
      if n < 10000000000 then n = n * 1000 end  -- seconds → ms
      local jdn = math.floor(n / 86400000) + 2440588
      local y, m, d = from_jdn(jdn)
      return string.format("%04d-%02d-%02d", y, m, d)
    end
    -- Final fallback: ISO string prefix
    if type(value) == "string" then return value:sub(1, 10) end
    return nil
  end
  -- The query language returns YAML-frontmatter fields cleanly but
  -- doesn't always surface the system-side `lastModified` on iteration.
  -- We get reliable timestamps from `space.listPages()`, then filter to
  -- only the page names that came back from the typed queries.
  local typed = {}
  local function note_typed(list)
    for _, e in ipairs(list or {}) do
      if in_path(e) and e.name then typed[e.name] = true end
    end
  end
  note_typed(query[[from p = tags.page where p.type == "cpd" select p]])
  note_typed(query[[from p = tags.page where p.type == "reflection" select p]])
  note_typed(query[[from p = tags.page where p.type == "credential" select p]])
  note_typed(query[[from p = tags.page where p.type == "cpd-claim" select p]])
  note_typed(query[[from p = tags.page where p.type == "capture" select p]])

  local all_meta = {}
  pcall(function() all_meta = space.listPages() or {} end)
  for _, meta in ipairs(all_meta) do
    if typed[meta.name] then
      local s = ts_to_date_str(meta.lastModified)
      if s then cmap[s] = (cmap[s] or 0) + 1 end
    end
  end

  local today_str
  pcall(function() today_str = tostring(date.today()):sub(1, 10) end)
  if not today_str or #today_str ~= 10 then
    return widget.html(dom.div { style = "opacity:0.4;font-size:13px", "Calendar unavailable." })
  end
  local ty = tonumber(today_str:sub(1,4))
  local tm = tonumber(today_str:sub(6,7))
  local td = tonumber(today_str:sub(9,10))
  local today_jdn = to_jdn(ty, tm, td)

  local first_jdn = to_jdn(ty, tm, 1)
  local first_dow = jdn_dow(first_jdn)
  local nm_y, nm_m = ty, tm + 1
  if nm_m > 12 then nm_m = 1; nm_y = nm_y + 1 end
  local _, _, last_d = from_jdn(to_jdn(nm_y, nm_m, 1) - 1)

  local month_total, month_days = 0, 0
  local prefix = string.format("%04d-%02d", ty, tm)
  for k, v in pairs(cmap) do
    if k:sub(1, 7) == prefix then
      month_total = month_total + v
      month_days = month_days + 1
    end
  end

  local CB = "width:22px;height:22px;border-radius:3px;text-align:center;font-size:11px;line-height:22px;font-family:inherit;"
  local function cell_bg(c)
    if     c <= 0 then return CB .. "background:transparent;border:1px dashed rgba(99,102,241,0.2);color:rgba(0,0,0,0.3)"
    elseif c == 1 then return CB .. "background:#eef2ff;color:#312e81"
    elseif c == 2 then return CB .. "background:#c7d2fe;color:#312e81"
    elseif c <= 4 then return CB .. "background:#a5b4fc;color:#1e1b4b"
    elseif c <= 6 then return CB .. "background:#818cf8;color:white"
    else               return CB .. "background:#4f46e5;color:white"
    end
  end

  local DAY_LBL = {"Mon","Tue","Wed","Thu","Fri","Sat","Sun"}
  local hdr = {}
  for _, lbl in ipairs(DAY_LBL) do
    table.insert(hdr, dom.td {
      style = "font-size:10px;opacity:0.45;padding-bottom:3px;text-align:center;font-family:inherit;width:22px",
      lbl
    })
  end
  local rows = { dom.tr(hdr) }

  local row = {}
  for i = 0, first_dow - 1 do
    table.insert(row, dom.td { style = "width:22px;height:22px" })
  end
  for d = 1, last_d do
    local jdn = to_jdn(ty, tm, d)
    local ds = string.format("%04d-%02d-%02d", ty, tm, d)
    local count = cmap[ds] or 0
    if jdn > today_jdn then
      table.insert(row, dom.td { style = "width:22px;height:22px;color:rgba(0,0,0,0.15);text-align:center;font-size:11px;line-height:22px;font-family:inherit", tostring(d) })
    else
      local label = count == 1 and "1 record touched" or (count .. " records touched")
      local tip = count > 0 and (ds .. ": " .. label) or ds
      table.insert(row, dom.td { style = cell_bg(count), title = tip, tostring(d) })
    end
    if jdn_dow(jdn) == 6 then
      table.insert(rows, dom.tr(row))
      row = {}
    end
  end
  if #row > 0 then
    while #row < 7 do
      table.insert(row, dom.td { style = "width:22px;height:22px" })
    end
    table.insert(rows, dom.tr(row))
  end

  local MONTHS = {"January","February","March","April","May","June","July","August","September","October","November","December"}
  local summary = string.format("%s %d · %d %s across %d %s",
    MONTHS[tm], ty, month_total,
    month_total == 1 and "record" or "records",
    month_days, month_days == 1 and "day" or "days")

  return widget.html(dom.div {
    style = "padding:4px 0",
    dom.div { style = "font-size:12px;opacity:0.5;margin-bottom:6px;font-family:inherit", summary },
    dom.table { style = "border-collapse:separate;border-spacing:2px", table.unpack(rows) }
  })
end
```
