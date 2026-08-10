# AGENTS.md

## Git workflow — environment `friendly-bets-FULLSTACK` (телефон / Cloud Agent)

**Это главное правило для этого окружения. Не игнорировать.**

- **Окружение:** `friendly-bets-FULLSTACK` (Friendly Bets: backend + frontend). Запросы с телефона через это окружение всегда следуют этим правилам.
- **Единственная рабочая ветка:** `dev` на remote (`origin/dev`). Вся работа — только в `dev`.
- **Перед началом:** `git checkout dev && git pull origin dev`.
- **Коммиты и пуш:** сразу в `dev` — `git commit` и `git push origin dev`.
- **НЕ создавать** feature-ветки (`cursor/...`, `feature/...` и любые другие).
- **НЕ открывать** pull request'ы. Изменения попадают в репозиторий только через прямой push в `origin/dev`.
- **НЕ пушить** в `main` и не мержить в `main` из этого окружения.
- Исключение только если пользователь **явно** попросил другую ветку или PR — в обычной работе с телефона через `friendly-bets-FULLSTACK` это не применяется.

## Cursor Cloud specific instructions

React 18 + TypeScript + Vite SPA for the "Friendly Bets" app. The REST API lives in a separate repo (`friendly-bets-backend`).

### Services / how to run
- Dev server: `npm run dev` → Vite on port `5173`. In `development` mode Vite proxies `/api` → `http://localhost:8080`, so the backend must be running for API calls to work.
- Build: `npm run build` (`tsc && vite build`, output in `build/`).
- Type-check: `npm run type-check`.
- Lint: `npm run lint` (`tsc --noEmit` + eslint). Note: the current codebase reports many pre-existing prettier/eslint errors; lint is not clean on `main`.
- Tests: `npm test` / `npx vitest run`. The single template test `src/App.test.tsx` is a leftover from the vite-template-redux starter (checks for a "learn react" link) and fails under jsdom with `ReferenceError: Worker is not defined` (from `heic2any`). This is a pre-existing failure, not caused by env setup.

### Config (non-obvious)
- Requires a git-ignored `.env` at the repo root with `VITE_PRODUCT_SERVER=localhost`. The literal string `localhost` makes API calls use relative `/api` paths through the Vite dev proxy; any other value is treated as a full backend origin.
