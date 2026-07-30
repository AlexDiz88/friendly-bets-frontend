# AGENTS.md

## Git workflow (Cursor Cloud — environment `friendly-bets-FULLSTACK`)

- **Environment:** `friendly-bets-FULLSTACK` (Friendly Bets fullstack: backend + frontend).
- **Default branch:** `dev`. Always work on `origin/dev` unless the user explicitly asks otherwise.
- **Before starting work:** `git checkout dev && git pull origin dev`.
- **Commits:** commit and push directly to `dev` (`git push origin dev`). Do not accumulate work only on feature branches.
- **Do not** create feature branches (`cursor/...`) or open PRs into `main` by default in this environment.
- **PRs:** if a PR is needed, target `dev` as the base branch, not `main`.

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
