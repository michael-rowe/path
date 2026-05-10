FROM python:3.12-slim

# Install git
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set git identity
RUN git config --global user.email "path-bot@local" && \
    git config --global user.name "Path Time Machine" && \
    git config --global init.defaultBranch main

CMD ["python", "main.py"]
