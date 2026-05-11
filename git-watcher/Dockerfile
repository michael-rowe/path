FROM python:3.12-alpine

RUN apk add --no-cache git

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set git identity
RUN git config --global user.email "path-bot@local" && \
    git config --global user.name "Path Time Machine" && \
    git config --global init.defaultBranch main

CMD ["python", "main.py"]
