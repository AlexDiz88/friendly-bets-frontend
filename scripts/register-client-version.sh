#!/usr/bin/env bash
set -euo pipefail

# Registers the frontend buildId in the backend (single source of truth).
#
# Required env:
#   VITE_APP_BUILD_ID  — same value used for `npm run build`
#   DEPLOY_TOKEN       — must match backend app.deploy.token / DEPLOY_TOKEN
#
# API URL resolution (DO injects BACKEND_URL for static sites — do not use it):
#   1. CLIENT_VERSION_BACKEND_URL — recommended: direct DO backend URL
#   2. VITE_PRODUCT_SERVER        — runtime API origin (friendly-bets.net/backend)
#   3. https://friendly-bets-9fph3.ondigitalocean.app
#
# Typical DO build command:
#   export VITE_APP_BUILD_ID=$(date +%s%3N) && npm run build && npm run register-version

BUILD_ID="${VITE_APP_BUILD_ID:-}"
DEPLOY_TOKEN="${DEPLOY_TOKEN:-}"
MAX_ATTEMPTS="${CLIENT_VERSION_REGISTER_ATTEMPTS:-12}"
RETRY_DELAY_SECONDS="${CLIENT_VERSION_REGISTER_RETRY_SECONDS:-10}"

resolve_api_origin() {
	if [[ -n "${CLIENT_VERSION_BACKEND_URL:-}" ]]; then
		echo "${CLIENT_VERSION_BACKEND_URL%/}"
		return
	fi
	if [[ -n "${VITE_PRODUCT_SERVER:-}" && "${VITE_PRODUCT_SERVER}" != "localhost" ]]; then
		echo "${VITE_PRODUCT_SERVER%/}"
		return
	fi
	echo "https://friendly-bets-9fph3.ondigitalocean.app"
}

API_ORIGIN="$(resolve_api_origin)"

if [[ -z "$BUILD_ID" ]]; then
	echo "VITE_APP_BUILD_ID is required" >&2
	exit 1
fi

if [[ -z "$DEPLOY_TOKEN" ]]; then
	echo "DEPLOY_TOKEN is required" >&2
	exit 1
fi

URL="${API_ORIGIN}/api/client-version/deploy"
echo "Registering client version at ${URL}"

for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
	echo "Attempt ${attempt}/${MAX_ATTEMPTS}..."

	HTTP_CODE=$(curl -sS -o /tmp/client-version-response.json -w "%{http_code}" \
		-X POST "$URL" \
		-H "Content-Type: application/json" \
		-H "X-Deploy-Token: $DEPLOY_TOKEN" \
		-d "{\"buildId\":\"$BUILD_ID\"}" || echo "000")

	if [[ "$HTTP_CODE" == "200" ]]; then
		echo "Registered client version buildId=$BUILD_ID"
		cat /tmp/client-version-response.json
		exit 0
	fi

	if [[ "$HTTP_CODE" == "403" ]]; then
		echo "Failed to register client version (HTTP 403 — check DEPLOY_TOKEN):" >&2
		cat /tmp/client-version-response.json >&2
		exit 1
	fi

	echo "Register failed (HTTP ${HTTP_CODE}), waiting ${RETRY_DELAY_SECONDS}s..."
	cat /tmp/client-version-response.json 2>/dev/null || true

	if [[ "$attempt" -lt "$MAX_ATTEMPTS" ]]; then
		sleep "$RETRY_DELAY_SECONDS"
	fi
done

echo "Failed to register client version after ${MAX_ATTEMPTS} attempts (last HTTP ${HTTP_CODE}):" >&2
cat /tmp/client-version-response.json >&2
exit 1
