FROM lycheeverse/lychee:latest-alpine AS lychee

FROM python:3.12-alpine
COPY --from=lychee /usr/local/bin/lychee /usr/local/bin/lychee

RUN apk add --no-cache ca-certificates openssl

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "main.py"]
