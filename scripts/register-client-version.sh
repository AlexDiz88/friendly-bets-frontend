#!/usr/bin/env bash
set -euo pipefail

# Registers the frontend buildId in the backend (single source of truth).
#
# Required env:
#   VITE_APP_BUILD_ID  — same value used for `npm run build`
#   DEPLOY_TOKEN       — must match backend app.deploy.token / DEPLOY_TOKEN
#
# Optional env:
#   BACKEND_URL        — default https://friendly-bets-9fph3.ondigitalocean.app
#
# Typical CI order:
#   export VITE_APP_BUILD_ID=$(date +%s%3N)
#   npm run build
#   ./scripts/register-client-version.sh
#   # deploy build/ to static hosting

BUILD_ID="${VITE_APP_BUILD_ID:-}"
DEPLOY_TOKEN="${DEPLOY_TOKEN:-}"
BACKEND_URL="${BACKEND_URL:-https://friendly-bets-9fph3.ondigitalocean.app}"

if [[ -z "$BUILD_ID" ]]; then
	echo "VITE_APP_BUILD_ID is required" >&2
	exit 1
fi

if [[ -z "$DEPLOY_TOKEN" ]]; then
	echo "DEPLOY_TOKEN is required" >&2
	exit 1
fi

URL="${BACKEND_URL%/}/api/client-version"
HTTP_CODE=$(curl -sS -o /tmp/client-version-response.json -w "%{http_code}" \
	-X PUT "$URL" \
	-H "Content-Type: application/json" \
	-H "X-Deploy-Token: $DEPLOY_TOKEN" \
	-d "{\"buildId\":\"$BUILD_ID\"}")

if [[ "$HTTP_CODE" != "200" ]]; then
	echo "Failed to register client version (HTTP $HTTP_CODE):" >&2
	cat /tmp/client-version-response.json >&2
	exit 1
fi

echo "Registered client version buildId=$BUILD_ID"
cat /tmp/client-version-response.json
