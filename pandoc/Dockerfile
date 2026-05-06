# Path PDF/Word compile sidecar
#
# Rebased on pandoc/latex (Ubuntu + TinyTeX) rather than python:slim + apt texlive.
# TinyTeX is a minimal TeX distribution (~200 MB vs ~1.5 GB for full texlive).
# We add Python for the FastAPI layer and Liberation fonts for the default template.

FROM pandoc/latex:latest

# Add Python runtime and Liberation Serif/Sans (used by portfolio-default.tex).
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    fonts-liberation \
 && rm -rf /var/lib/apt/lists/*

# Ensure the LaTeX packages used by the default template are available in TinyTeX.
# tlmgr may already have these; the || true makes the step non-fatal if it can't reach CTAN.
RUN tlmgr install titling titlesec 2>/dev/null || true

WORKDIR /app

COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

COPY main.py .
COPY templates ./templates
COPY lua-filters ./lua-filters

# space/ is mounted read-only at runtime; exports/ is mounted read-write
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
