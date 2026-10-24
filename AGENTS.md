# AGENTS.md

## Cursor Cloud specific instructions

`ea-sc-dash` is a **frontend-only** React 19 + Vite 7 single-page app (organizer dashboard). There is no backend in this repo. The standard scripts live in `package.json` (`dev`, `build`, `lint`, `preview`); use those rather than reinventing commands.

### Services

| Service | Run | Notes |
|---------|-----|-------|
| Vite dev server | Configured in `.cursor/environment.json` `terminals` as `npm run dev -- --host 0.0.0.0` | Serves on port `5173` with HMR. If `:5173` is down after boot (some draft-build / subagent paths skip `terminals`), start that command yourself. |

- Lint: `npm run lint` — note the repo currently has many pre-existing lint errors, so this command exits non-zero. That is the existing state of the codebase, not an environment problem.
- Build: `npm run build` (Vite production build).
- Node: the app runs fine on the VM's Node 22 (Vite 7 needs Node `>=20.19` or `>=22.12`). `.nvmrc` pins 24, but 22 is sufficient for dev/build.

### Backend / auth (important, non-obvious)

- The API base URL is configured in `src/config.js`. The default environment (`STAGE`) and `PROD` point to remote `*.fairfest.in` hosts. **These remote APIs are not reachable from Cloud VMs** — the server resets the TLS connection (egress is open; the block is server-side). So the Staging/Production email + password + OTP login flow cannot be completed here.
- To reach the authenticated dashboard without a backend, use **Local environment login** at `/login-local`: enter any API base URL and any non-empty auth token, then "Connect to Local". The event fetch fails gracefully to an empty list and you land on the authenticated "Events Overview" dashboard. This is the practical way to develop/test authenticated screens in this environment.
