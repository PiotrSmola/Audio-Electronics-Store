#!/usr/bin/env bash
# Builds and starts Audio Electronics Store in Docker.
#
# Usage:
#   ./scripts/docker-setup.sh            # production build (nginx) on http://localhost:8080
#   ./scripts/docker-setup.sh --dev      # Vite dev server with hot reload on http://localhost:5173
#   ./scripts/docker-setup.sh --port 3000
#   ./scripts/docker-setup.sh --stop     # stop and remove containers
#   ./scripts/docker-setup.sh --logs     # follow container logs
set -euo pipefail

cd "$(dirname "$0")/.."

MODE="prod"
ACTION="start"
PORT=""

usage() {
  sed -n '2,9p' "$0" | sed 's/^# \{0,1\}//'
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dev) MODE="dev" ;;
    --port)
      [[ $# -ge 2 ]] || { echo "Error: --port requires a value" >&2; exit 1; }
      PORT="$2"; shift ;;
    --stop) ACTION="stop" ;;
    --logs) ACTION="logs" ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage; exit 1 ;;
  esac
  shift
done

info()  { printf '\033[1;34m==>\033[0m %s\n' "$*"; }
ok()    { printf '\033[1;32m✔\033[0m  %s\n' "$*"; }
fail()  { printf '\033[1;31m✘\033[0m  %s\n' "$*" >&2; exit 1; }

# --- Prerequisites ---
command -v docker >/dev/null 2>&1 \
  || fail "Docker is not installed. Get it from https://docs.docker.com/get-docker/"
docker info >/dev/null 2>&1 \
  || fail "Docker daemon is not running. Start Docker Desktop (or the docker service) and try again."
docker compose version >/dev/null 2>&1 \
  || fail "Docker Compose v2 is required ('docker compose'). Update Docker to a recent version."
ok "Docker $(docker version --format '{{.Server.Version}}') is ready"

COMPOSE=(docker compose --profile dev)

case "$ACTION" in
  stop)
    info "Stopping containers..."
    "${COMPOSE[@]}" down
    ok "Stopped"
    exit 0 ;;
  logs)
    exec "${COMPOSE[@]}" logs -f ;;
esac

# --- Start ---
if [[ "$MODE" == "dev" ]]; then
  SERVICE="dev"
  export DEV_PORT="${PORT:-${DEV_PORT:-5173}}"
  URL="http://localhost:${DEV_PORT}"
else
  SERVICE="app"
  export APP_PORT="${PORT:-${APP_PORT:-8080}}"
  URL="http://localhost:${APP_PORT}"
fi

info "Building and starting '${SERVICE}' (this can take a few minutes the first time)..."
"${COMPOSE[@]}" up -d --build "$SERVICE"

info "Waiting for ${URL} ..."
for _ in $(seq 1 60); do
  if curl -fsS -o /dev/null "$URL" 2>/dev/null; then
    ok "Audio Electronics Store is running at ${URL}"
    echo "   Logs: ./scripts/docker-setup.sh --logs"
    echo "   Stop: ./scripts/docker-setup.sh --stop"
    exit 0
  fi
  sleep 2
done

"${COMPOSE[@]}" logs --tail 50 "$SERVICE"
fail "The app did not respond at ${URL} within 2 minutes. See the logs above."
