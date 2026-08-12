#!/usr/bin/env bash
set -euo pipefail

# Registers the frontend buildId in the backend (single source of truth).
#
# Required env:
#   VITE_APP_BUILD_ID  — same value used for `npm run build`
#   DEPLOY_TOKEN       — must match backend app.deploy.token / DEPLOY_TOKEN
#
# API URL resolution (DO injects BACKEND_URL for static sites — do not use it):
#   1. CLIENT_VERSION_BACKEND_URL — must include /backend path prefix, e.g.
#        https://friendly-bets.net/backend
#        https://friendly-bets-9fph3.ondigitalocean.app/backend
#      WITHOUT /backend the request hits the Static Site (Spaces) → HTTP 400 XML.
#   2. VITE_PRODUCT_SERVER — same as runtime API origin
#   3. https://friendly-bets.net/backend
#
# Typical DO build command:
#   export VITE_APP_BUILD_ID=$(date +%s%3N) && npm run build && npm run register-version

BUILD_ID="${VITE_APP_BUILD_ID:-}"
DEPLOY_TOKEN="${DEPLOY_TOKEN:-}"
MAX_ATTEMPTS="${CLIENT_VERSION_REGISTER_ATTEMPTS:-12}"
RETRY_DELAY_SECONDS="${CLIENT_VERSION_REGISTER_RETRY_SECONDS:-10}"

normalize_api_origin() {
	local origin="${1%/}"
	# Bare DO app URL serves the Static Site; API lives under /backend.
	if [[ "$origin" == "https://friendly-bets-9fph3.ondigitalocean.app" ]]; then
		origin="${origin}/backend"
	fi
	echo "$origin"
}

resolve_api_origin() {
	if [[ -n "${CLIENT_VERSION_BACKEND_URL:-}" ]]; then
		normalize_api_origin "${CLIENT_VERSION_BACKEND_URL}"
		return
	fi
	if [[ -n "${VITE_PRODUCT_SERVER:-}" && "${VITE_PRODUCT_SERVER}" != "localhost" ]]; then
		normalize_api_origin "${VITE_PRODUCT_SERVER}"
		return
	fi
	echo "https://friendly-bets.net/backend"
}

is_spring_json_response() {
	local file="$1"
	[[ -f "$file" ]] || return 1
	# Spaces/CDN errors are XML; SPA fallback is HTML.
	if head -c 64 "$file" | grep -qiE '<(!DOCTYPE|html|Error|\?xml)'; then
		return 1
	fi
	grep -q '"buildId"' "$file" 2>/dev/null
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

	if [[ "$HTTP_CODE" == "200" ]] && is_spring_json_response /tmp/client-version-response.json; then
		echo "Registered client version buildId=$BUILD_ID"
		cat /tmp/client-version-response.json
		exit 0
	fi

	if [[ "$HTTP_CODE" == "403" ]]; then
		echo "Failed to register client version (HTTP 403 — check DEPLOY_TOKEN):" >&2
		cat /tmp/client-version-response.json >&2
		exit 1
	fi

	if [[ -f /tmp/client-version-response.json ]] && head -c 64 /tmp/client-version-response.json | grep -qiE '<(!DOCTYPE|html|Error|\?xml)'; then
		echo "Response is HTML/XML, not the Spring API. Wrong API origin." >&2
		echo "Set CLIENT_VERSION_BACKEND_URL=https://friendly-bets.net/backend" >&2
		echo "(must include /backend — bare ondigitalocean.app URL hits the Static Site)." >&2
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
