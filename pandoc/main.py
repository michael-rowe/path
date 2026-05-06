"""
Path PDF compile sidecar.

Two endpoints:

  POST /compile   — receives a list of page names, runs Pandoc, saves the
                    resulting PDF under a random id, returns JSON
                    {"id": "<uuid>", "missing": [...]}.

  GET  /download/{id}  — serves the saved PDF as an attachment.

The two-step flow lets SilverBullet's Lua simply open the download URL in a
new browser tab once compilation completes — no need to handle binary
response bodies inside Lua.

The profile page is read separately and its frontmatter is passed to Pandoc
as document metadata so the template can render the cover page from it.
"""

import os
import re
import subprocess
import tempfile
import uuid
from datetime import datetime
from pathlib import Path

import yaml
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse

from pydantic import BaseModel

SPACE = Path(os.environ.get("SPACE_PATH", "/space"))
TEMPLATE_DIR = Path(os.environ.get("TEMPLATE_DIR", "/app/templates"))
DEFAULT_TEMPLATE = "portfolio-default.tex"
EXPORTS_DIR = Path(os.environ.get("EXPORTS_DIR", "/exports"))
EXPORTS_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Path PDF compile sidecar")


class CompileRequest(BaseModel):
    pages: list[str]
    title: str | None = None
    template: str | None = None
    slug: str | None = None  # Used in the output filename, e.g. "uol-professor"
    format: str | None = None  # "pdf" (default) or "docx"


@app.get("/health")
def health():
    return {"status": "ok", "space": str(SPACE), "template_dir": str(TEMPLATE_DIR)}


def _split_frontmatter(text: str) -> tuple[dict, str]:
    if not text.startswith("---\n"):
        return {}, text
    end = text.find("\n---", 4)
    if end < 0:
        return {}, text
    yaml_text = text[4:end]
    body = text[end + 4:].lstrip("\n")
    try:
        fm = yaml.safe_load(yaml_text) or {}
    except yaml.YAMLError:
        fm = {}
    return fm, body


def _extract_section(body: str, heading: str) -> str:
    """Return the markdown content under `## <heading>` up to the next `## ` heading.

    Used so long-form profile content (bio, qualifications, registrations)
    can live as page sections rather than be jammed into YAML.
    """
    pattern = rf"^##\s+{re.escape(heading)}\s*\n([\s\S]*?)(?=^##\s+|\Z)"
    m = re.search(pattern, body, flags=re.MULTILINE)
    if not m:
        return ""
    text = m.group(1).strip()
    # Strip leading blockquote placeholder lines so empty/template content
    # doesn't end up on the cover page.
    lines = [ln for ln in text.splitlines() if not ln.lstrip().startswith(">")]
    return "\n".join(lines).strip()


def _read_profile() -> dict:
    profile_path = SPACE / "profile.md"
    if not profile_path.exists():
        return {}
    fm, body = _split_frontmatter(profile_path.read_text())
    fm = fm or {}
    # Bio lives in the page body as `## Bio`; lift it into metadata so the
    # cover-page template can render it the same way as before.
    bio = _extract_section(body, "Bio")
    if bio:
        fm["bio"] = bio
    return fm


def _read_page(name: str) -> tuple[dict, str] | None:
    p = SPACE / f"{name}.md"
    if not p.exists():
        return None
    return _split_frontmatter(p.read_text())


SB_EXPR_RE = re.compile(r"\$\{[^}]+\}", re.DOTALL)
TRANSCLUDE_RE = re.compile(r"!\[\[([^\]]+)\]\]")
WIKILINK_RE = re.compile(r"\[\[([^\]|]+)(?:\|([^\]]+))?\]\]")


def _sanitize_for_pandoc(body: str) -> str:
    body = SB_EXPR_RE.sub("", body)
    body = TRANSCLUDE_RE.sub(r"*[embedded: \1]*", body)

    def wl(m: re.Match) -> str:
        display = m.group(2) or m.group(1).split("/")[-1]
        return display

    body = WIKILINK_RE.sub(wl, body)
    return body


@app.post("/compile")
def compile_pdf(req: CompileRequest):
    profile = _read_profile()

    parts: list[str] = []
    missing: list[str] = []
    for name in req.pages:
        result = _read_page(name)
        if result is None:
            missing.append(name)
            continue
        _, body = result
        parts.append(_sanitize_for_pandoc(body))

    if not parts:
        raise HTTPException(
            status_code=400,
            detail=f"No pages found. Missing: {missing}",
        )

    combined = "\n\n\\newpage\n\n".join(parts)

    metadata = {
        "title": req.title or "Portfolio submission",
        "profile": profile,
    }

    output_format = (req.format or "pdf").lower()
    if output_format not in ("pdf", "docx"):
        raise HTTPException(status_code=400, detail=f"Unsupported format: {output_format}")

    # Build a sensible filename: submission-<slug>-YYYY-MM-DD-HHMM.<ext>
    slug = re.sub(r"[^a-z0-9-]+", "", (req.slug or "submission").lower())
    timestamp = datetime.now().strftime("%Y-%m-%d-%H%M")
    out_filename = f"submission-{slug}-{timestamp}.{output_format}"
    out_path = EXPORTS_DIR / out_filename

    # PDF uses our LaTeX template. DOCX uses Pandoc's default Word output
    # (a custom reference.docx can be added later for branded styling).
    if output_format == "pdf":
        template_name = req.template or DEFAULT_TEMPLATE
        template_path = TEMPLATE_DIR / template_name
        if not template_path.exists():
            raise HTTPException(status_code=400, detail=f"Template not found: {template_name}")
    else:
        template_path = None

    with tempfile.TemporaryDirectory() as tmp:
        md_path = Path(tmp) / "input.md"
        meta_path = Path(tmp) / "meta.yaml"

        md_path.write_text(combined)
        meta_path.write_text(yaml.safe_dump(metadata, allow_unicode=True))

        cmd = [
            "pandoc",
            str(md_path),
            "--metadata-file", str(meta_path),
            "--from", "markdown+yaml_metadata_block",
            "--toc",
            "--toc-depth=2",
            "-o", str(out_path),
        ]
        if output_format == "pdf":
            cmd.extend([
                "--template", str(template_path),
                "--pdf-engine", "xelatex",
                "--no-highlight",
            ])
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=180)

        if result.returncode != 0 or not out_path.exists():
            raise HTTPException(
                status_code=500,
                detail={
                    "message": "Pandoc failed",
                    "stderr": result.stderr[-2000:],
                    "stdout": result.stdout[-1000:],
                },
            )

    return JSONResponse(
        content={
            "filename": out_filename,
            "host_path": f"~/portfolio/exports/{out_filename}",
            "missing": missing,
        }
    )
