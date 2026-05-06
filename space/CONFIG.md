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

event.listen {
  name = "editor:pageLoaded",
  run = function()
    set_favicon()
    local name = editor.getCurrentPage()
    if not name then return end
    local content = space.readPage(name) or ""
    local heading = first_h1(content) or name
    js.window.document.title = "Path | " .. heading
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
      return
    end
    local content = space.readPage(name) or ""
    local is_readonly = string.find(content, "\nreadonly:%s*true") ~= nil
                        or string.find(content, "^readonly:%s*true") ~= nil
    editor.setUiOption("forcedROMode", is_readonly)
    editor.rebuildEditorState()
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
```

# Coverage helpers — used by Path dashboard pages

`pathCoverage(slug)` runs three queries (claims / CPD / reflections) for a
single Path and returns counts bucketed by criterion code. The heatmap and
gap-list helpers build on it; the per-criterion detail helper renders the
three lists for one criterion. The point of these helpers is so dashboard
pages stay readable — one Lua call per visual block instead of dozens of
inline queries.

```space-lua
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
      out[s] = out[s] or { claims = 0, cpd = 0, reflections = 0 }
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
        out[s] = out[s] or { claims = 0, cpd = 0, reflections = 0 }
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
        out[s] = out[s] or { claims = 0, cpd = 0, reflections = 0 }
        out[s].reflections = out[s].reflections + 1
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
    }
  }
  for _, code in ipairs(criteria) do
    local r = cov[code] or { claims = 0, cpd = 0, reflections = 0 }
    table.insert(rows, dom.tr {
      dom.td { class = "ph-label", code },
      cell(r.claims), cell(r.cpd), cell(r.reflections),
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
    local r = cov[code] or { claims = 0, cpd = 0, reflections = 0 }
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

-- Search — priority 1.02, between Focus mode and theme toggle.
-- Invokes the basic-search plug ("Search Space" command).
-- Run `Space: Reindex` once after first install for results to appear.
actionButton.define {
  icon = "search",
  description = "Search across all pages",
  priority = 1.02,
  run = function()
    editor.invokeCommand("Search Space")
  end
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

Generates a live markdown checklist for the Getting started page. Each check
queries the space so the status updates as the user populates their portfolio.

```space-lua
function onboardingStatus()
  local results = {}

  local function add(done, done_text, todo_text)
    table.insert(results, {
      done = done,
      text = done and ("[x] " .. done_text) or ("[ ] " .. todo_text),
    })
  end

  -- 1. Profile: full_name and job_title both filled
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
  add(profile_ok,
    "Profile filled",
    "**Fill in your profile** — open [[profile]] and add your name and job title. These appear on every document you export.")

  -- 2. Framework installed: _system/installed-frameworks exists and has an entry
  local fw_content = ""
  if space.pageExists("_system/installed-frameworks") then
    fw_content = space.readPage("_system/installed-frameworks") or ""
  end
  add(string.find(fw_content, "slug:") ~= nil,
    "Framework installed",
    "**Install a framework** — run **Path: Add framework** from the command palette. This loads the criteria, templates, and coverage dashboard for your chosen standards (e.g. UoL Professor, AdvanceHE D4, HCPC CPD).")

  -- 3. At least one active Path
  local paths = query[[
    from p = tags.page
    where p.type == "path" and p.status == "active"
    select p
  ]]
  local path_links = {}
  for _, p in ipairs(paths) do
    table.insert(path_links, "[[" .. p.name .. "|" .. (p.title or p.slug or p.name) .. "]]")
  end
  add(#paths > 0,
    "Path active: " .. (#paths > 0 and table.concat(path_links, ", ") or ""),
    "**Create a Path** — use **Ctrl-Alt-c → Path**. A Path represents one portfolio goal (e.g. promotion, fellowship, revalidation). If you installed a framework bundle, a Path scaffold was created automatically — check [[paths/index]].")

  -- 4. At least one CPD activity
  local cpds = query[[from p = tags.page where p.type == "cpd" select p]]
  add(#cpds > 0,
    #cpds .. " CPD " .. (#cpds == 1 and "activity" or "activities") .. " logged",
    "**Log a CPD activity** — use **Ctrl-Alt-c → CPD activity**. CPD entries are the raw evidence for your portfolio: courses, conferences, presentations, projects, reading, writing.")

  -- 5. At least one reflection
  local refs = query[[from p = tags.page where p.type == "reflection" select p]]
  add(#refs > 0,
    #refs .. " " .. (#refs == 1 and "reflection" or "reflections") .. " written",
    "**Write a reflection** — use **Ctrl-Alt-c → Reflection**. Driscoll (What / So what / Now what) or ERA (Experience / Reflection / Action) are the shortest frameworks to start with.")

  -- 6. At least one claim
  local claims = query[[from p = tags.page where p.type == "cpd-claim" select p]]
  add(#claims > 0,
    #claims .. " " .. (#claims == 1 and "claim" or "claims") .. " written",
    "**Write a claim** — use **Ctrl-Alt-c → Claim**. A claim argues that a criterion has been met, backed by your CPD and reflections. Start with a criterion where you already have strong evidence.")

  -- Build output
  local done_count = 0
  for _, r in ipairs(results) do if r.done then done_count = done_count + 1 end end

  local summary
  if done_count == #results then
    summary = "_All steps complete — your portfolio is set up. Go to [[paths/index|your Paths]] to track coverage and prepare for export._"
  else
    summary = "_" .. done_count .. " of " .. #results .. " steps complete._"
  end

  local lines = {}
  for _, r in ipairs(results) do table.insert(lines, "- " .. r.text) end
  return summary .. "\n\n" .. table.concat(lines, "\n")
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
        {name = "Quick capture",    description = "An in-the-moment thought, not yet evidence"},
        {name = "Contact",          description = "A person in your professional network"},
        {name = "Credential",       description = "An award, badge, certification, or fellowship"},
        {name = "Path",             description = "A new goal you are working towards"},
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
    elseif choice.name == "Quick capture" then
      editor.invokeCommand("Path: New capture")
    elseif choice.name == "Contact" then
      editor.invokeCommand("Path: New contact")
    elseif choice.name == "Credential" then
      editor.invokeCommand("Path: New credential")
    elseif choice.name == "Path" then
      editor.invokeCommand("Path: New Path")
    elseif choice.name == "Personal statement" then
      editor.invokeCommand("Path: New personal statement")
    end
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
  name = "Path: Export to PDF",
  run = function() path_export("pdf") end
}

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

# Launch redirect toggle

Reads `_system/onboarding` to determine whether the user has dismissed the
launch redirect, and renders the appropriate toggle link on Getting started.

```space-lua
function onboardingLaunchToggle()
  local dismissed = false
  pcall(function()
    local content = space.readPage("_system/onboarding") or ""
    dismissed = string.find(content, "dismissed: true") ~= nil
  end)
  local cmd = dismissed and "Path: Re-enable launch redirect" or "Path: Dismiss launch redirect"
  return widget.html(
    dom.label {
      style = "cursor:pointer;display:inline-flex;align-items:center;gap:0.5em;font-size:14.5px;color:inherit",
      dom.input {
        type = "checkbox",
        checked = dismissed,
        style = "accent-color:#4f46e5;width:1.05em;height:1.05em;cursor:pointer",
        onchange = "syscall('system.invokeCommand', '" .. cmd .. "')"
      },
      "Don't show this on launch"
    }
  )
end

command.define {
  name = "Path: Dismiss launch redirect",
  run = function()
    space.writePage("_system/onboarding", "dismissed: true\n")
    editor.reloadPage()
  end
}

command.define {
  name = "Path: Re-enable launch redirect",
  run = function()
    space.writePage("_system/onboarding", "dismissed: false\n")
    editor.reloadPage()
  end
}
```
