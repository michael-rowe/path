FROM rclone/rclone:latest AS rclone

FROM python:3.12-alpine
COPY --from=rclone /usr/local/bin/rclone /usr/local/bin/rclone

RUN apk add --no-cache ca-certificates

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set up rclone config path
ENV RCLONE_CONFIG=/config/rclone/rclone.conf

CMD ["python", "main.py"]
