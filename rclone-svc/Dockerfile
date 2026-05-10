FROM rclone/rclone:latest AS rclone

FROM python:3.12-slim
COPY --from=rclone /usr/local/bin/rclone /usr/local/bin/rclone

# Install dependencies
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set up rclone config path
ENV RCLONE_CONFIG=/config/rclone/rclone.conf

CMD ["python", "main.py"]
