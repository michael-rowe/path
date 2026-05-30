# Path Word export sidecar
#
# Uses pandoc/core (pandoc only, no TeX) — Word (docx) export only.
# PDF export is not supported; use browser print (Ctrl-P) for PDF.
# Image size: ~100 MB vs ~350 MB for the previous pandoc/latex base.

FROM pandoc/core:latest

RUN apk add --no-cache python3 py3-pip

WORKDIR /app

COPY requirements.txt .
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

COPY main.py .

EXPOSE 8000

# pandoc/core sets ENTRYPOINT ["pandoc"], which would prepend onto CMD and
# run `pandoc uvicorn main:app --host ...` (pandoc then fails on --host).
# Reset it so CMD runs uvicorn directly.
ENTRYPOINT []

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
