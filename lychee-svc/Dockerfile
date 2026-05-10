FROM lycheeverse/lychee:latest AS lychee

FROM python:3.12-slim
COPY --from=lychee /usr/local/bin/lychee /usr/local/bin/lychee

# Install dependencies for lychee (needs openssl/libssl)
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "main.py"]
