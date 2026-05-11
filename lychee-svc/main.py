import os
import subprocess
import json
import logging
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Path Lychee API")

# Per-page debounce: a page checked within DEBOUNCE_SECONDS returns the
# cached result instead of hitting upstream URLs again. Keeps an
# accidental rapid double-click from firing 2×N outbound requests.
DEBOUNCE_SECONDS = 60
LYCHEE_TIMEOUT = "15"  # per-link
LYCHEE_CONCURRENCY = "10"
SUBPROCESS_TIMEOUT = 120  # whole-run safety cap

_cache: dict[str, tuple[float, dict]] = {}

# Restrict CORS to the SilverBullet UI origin. The sidecar is also bound to
# 127.0.0.1 in compose; CORS is belt-and-braces.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

SPACE_PATH = "/space"

@app.get("/health")
async def health():
    return {"ok": True}


@app.get("/check")
async def check_links(path: str):
    # Sanitize path — anchor under SPACE_PATH and reject traversal.
    clean_path = path.lstrip("/")
    if not clean_path.endswith(".md"):
        clean_path += ".md"

    space_root = os.path.realpath(SPACE_PATH)
    full_path = os.path.realpath(os.path.join(space_root, clean_path))
    if not full_path.startswith(space_root + os.sep) and full_path != space_root:
        raise HTTPException(status_code=400, detail="Path escapes space root")
    if not os.path.exists(full_path):
        logger.error(f"File not found: {full_path}")
        raise HTTPException(status_code=404, detail="File not found")

    # Debounce: return cached result if checked recently.
    now = time.monotonic()
    cached = _cache.get(clean_path)
    if cached and now - cached[0] < DEBOUNCE_SECONDS:
        return cached[1]

    try:
        logger.info(f"Checking links for: {full_path}")
        # --format json — JSON stream (one object per line)
        # --max-concurrency caps outbound parallelism
        # --timeout is per-link, in seconds
        # --no-progress suppresses the bar in non-interactive output
        result = subprocess.run(
            [
                "lychee",
                "--format", "json",
                "--max-concurrency", LYCHEE_CONCURRENCY,
                "--timeout", LYCHEE_TIMEOUT,
                "--no-progress",
                full_path,
            ],
            capture_output=True,
            text=True,
            timeout=SUBPROCESS_TIMEOUT,
        )

        # Lychee returns 0 on success, 2 when broken links found. Anything
        # else (1, 127, ...) is a real failure we should surface.
        if result.returncode not in (0, 2):
            logger.error(f"Lychee returncode={result.returncode} stderr={result.stderr}")
            raise HTTPException(
                status_code=500,
                detail=f"lychee exited {result.returncode}: {result.stderr.strip()[:200]}",
            )

        issues = []
        for line in result.stdout.strip().split("\n"):
            if not line:
                continue
            try:
                data = json.loads(line)
                if data.get("status") in ["Error", "Timeout", "Fail"]:
                    issues.append({
                        "uri": data.get("uri"),
                        "status": data.get("status"),
                        "message": data.get("message"),
                    })
            except Exception as e:
                logger.error(f"Error parsing line: {line} - {e}")
                continue

        payload = {"path": clean_path, "issues": issues}
        _cache[clean_path] = (now, payload)
        return payload
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="lychee timed out")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Execution error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8030)
