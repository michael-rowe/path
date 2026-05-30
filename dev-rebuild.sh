#!/usr/bin/env bash
# Rebuild and restart locally-built Path sidecar(s) from source.
#
# The shipped docker-compose.yml references published GHCR images and has no
# build contexts; docker-compose.dev.yml supplies them. This helper wires the
# two together so a code change in a sidecar can be rebuilt and run with one
# command — without affecting end users (who never use the dev override).
#
# Usage:
#   ./dev-rebuild.sh git-watcher          # rebuild + restart one service
#   ./dev-rebuild.sh pandoc-svc git-watcher   # several
#   ./dev-rebuild.sh                       # all locally-built services
#
# Profiled services (pandoc-svc, meili-indexer, lychee-svc, rclone-svc,
# path-mcp) are activated automatically by naming them explicitly.

set -euo pipefail
cd "$(dirname "$0")"

ALL=(pandoc-svc path-mcp meili-indexer git-watcher lychee-svc rclone-svc)

if [ "$#" -eq 0 ]; then
  SERVICES=("${ALL[@]}")
else
  SERVICES=("$@")
fi

echo "Rebuilding from source: ${SERVICES[*]}"
docker compose -f docker-compose.yml -f docker-compose.dev.yml \
  up -d --build --no-deps "${SERVICES[@]}"
echo "Done. Running containers:"
docker compose ps --format '  {{.Name}}\t{{.Status}}'
