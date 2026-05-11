FROM python:3.12-alpine
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV SPACE_DIR=/space
ENV MCP_PORT=3001
EXPOSE 3001
CMD ["python", "server.py"]
