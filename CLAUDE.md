# CLAUDE.md — ea-sc-dash ("personal dashboard")

Manish's **personal** organizer dashboard for both backends: **EA** (`../EA`) and **SC** (`../EVC-web`).
Default target for any "dashboard" work. (The team dashboard is `../ea-web-frontend` — only on request.)
Workspace map: `../CLAUDE.md`.

## Start here

1. `AI_INDEX.md` — human index (entry points, feature table, task → files).
2. `AI_FILE_MAP.yaml` — machine map (`tasks`, `features`, `critical_paths`, `glossary`).
3. `src/features/<Name>/README.md` for the feature you touch.
4. For new EA/SC API screens: `.claude/skills/ea-dash-api-feature/SKILL.md`.

**Update `AI_INDEX.md` + `AI_FILE_MAP.yaml` (+ feature README) whenever you add/move/remove files** — never add a third map format.

## Run

Docker (local-only files, listed in `.git/info/exclude`):

```bash
docker compose up -d          # http://localhost:5173
docker compose logs -f
docker compose build && docker compose up -d -V   # after package.json changes
```

Without Docker: Node 24 (`.nvmrc`) via nvm, `npm install`, `npm run dev`.
Check: `npm run lint`, `npx eslint src/features/<X>`, `npx vite build`. Deploy = GitHub Pages on push to main (`.github/workflows/deploy-pages.yml`).

## Stack

React 19, react-router 7, Vite 7, Tailwind 3, plain JS/JSX. State via React Context (`src/contexts/`). HTTP mostly `fetch` (some axios).

## Layout

- `src/features/<Name>/{api,domain,hooks,ui}` — feature-sliced; build order api → domain → hooks → ui.
- `src/pages/` thin pages, `src/components/`, `src/layouts/`, `src/services/` (legacy shared clients), `src/sc/` SC-only screens.
- Routes: `src/App.jsx` (`/ea/...`, `/sc/...`, `/event/:id/*`).

## EA vs SC, envs, auth

- `src/config.js`: `getProject()` (URL prefix `/ea` | `/sc` → legacy `?mode=` → stored `dashboard_mode` → EA) and `getEnv()` (LOCAL / STAGE / PROD, default STAGE).
- `ENV_CONFIG[env][project].BASE_URL` — never share a base URL between EA and SC. Build URLs with `getApiUrl()`.
- LOCAL: EA `http://reconnect.localhost:8000` (the `../EA` Docker app), SC `http://localhost:8010` (the `../EVC-web` Docker app). Override per project via `LoginLocal`.
- Auth: `Authorization: Token <token>` built in each api file. EA login `/organizers/signin/` (+ `/organizers/verify_2fa/`), SC login `/user/login/` (`src/services/auth.js`). Sessions per project+env in `src/contexts/authSession.js`.
- EA tenant = the `reconnect.` subdomain in the base URL (no tenant switcher).
- `ea-api-docs/` → symlink to `../EA/docs` (EA feature/API docs). Read the backend urlconf for real paths — never guess.

## Rules (from `.cursor/rules`, `.agents/`)

- Files ≤ 200 lines, functions ≤ 60 lines; split big legacy files before adding to them (`src/services/eventService.js`, `src/pages/AdditionalRequirementsOrders.jsx`, `src/pages/event-settings/index.jsx`…).
- Every screen/tab is in the URL (`?tab=`) and survives refresh.
- API errors via `readApiError`; 401 → logout, 403 → hide controls, 400 → field errors.
- Naming: `PascalCase.jsx` components, `camelCase.js` hooks/functions, `UPPER_SNAKE` constants.
- Tailwind: use `text-status-success` etc.; `/10` opacity doesn't work on CSS-variable colors.
- API date/times without a timezone must not go through `Date`.
- Raw HTML email content is kept exactly as authored (no sanitizing/reformatting).
- Working tree often has unrelated uncommitted work — don't revert or commit unless asked.
