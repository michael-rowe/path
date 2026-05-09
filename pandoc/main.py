"""
Path Word export sidecar.

Two endpoints:

  POST /compile   — receives a list of page names, runs Pandoc, saves the
                    resulting docx under a timestamped filename, returns JSON
                    {"filename": "...", "host_path": "...", "missing": [...]}.

  GET  /download/{id}  — not yet implemented (SilverBullet opens the export
                         folder directly via the host_path in the response).
"""

import os
import re
import subprocess
import tempfile
from datetime import datetime
from pathlib import Path

import yaml
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

from pydantic import BaseModel

SPACE = Path(os.environ.get("SPACE_PATH", "/space"))
EXPORTS_DIR = Path(os.environ.get("EXPORTS_DIR", "/exports"))
EXPORTS_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Path Word export sidecar")


class CompileRequest(BaseModel):
    pages: list[str]
    title: str | None = None
    slug: str | None = None


@app.get("/health")
def health():
    return {"status": "ok", "space": str(SPACE)}


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


def _read_profile() -> dict:
    profile_path = SPACE / "profile.md"
    if not profile_path.exists():
        return {}
    fm, _ = _split_frontmatter(profile_path.read_text())
    return fm or {}


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
def compile_docx(req: CompileRequest):
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
        "author": profile.get("full_name", ""),
    }

    slug = re.sub(r"[^a-z0-9-]+", "", (req.slug or "submission").lower())
    timestamp = datetime.now().strftime("%Y-%m-%d-%H%M")
    out_filename = f"submission-{slug}-{timestamp}.docx"
    out_path = EXPORTS_DIR / out_filename

    with tempfile.TemporaryDirectory() as tmp:
        md_path = Path(tmp) / "input.md"
        meta_path = Path(tmp) / "meta.yaml"

        md_path.write_text(combined)
        meta_path.write_text(yaml.safe_dump(metadata, allow_unicode=True))

        cmd = [
            "pandoc",
            str(md_path),
            "--metadata-file", str(meta_path),
            "--from", "markdown+yaml_metadata_block+raw_tex",
            "--toc",
            "--toc-depth=2",
            "-o", str(out_path),
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)

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
