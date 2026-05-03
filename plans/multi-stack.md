# Multi-Stack URL Routing

## Context
The app is both a pony tracker for the user's daughter and a personal learning project. The goal is to support multiple frontend/backend technology combinations selectable by URL prefix — e.g., `/ts/py/` for the current React/TypeScript + Flask stack, `/js/py/` for plain JS + Flask, `/ts/node/` for React/TS + Express, etc. The database (PostgreSQL) stays unchanged and is shared by all backends. This lets the user compare how different stacks solve the same problem side-by-side.

## Recommended Architecture: nginx as top-level router

An nginx reverse proxy sits in front of all backends and serves all static frontend files. It routes by URL prefix:

```
/ts/py/api/*    →  proxy to Flask (port 5000)
/ts/py/*        →  serve dist/ts/ static files (SPA catch-all)
/ts/node/api/*  →  proxy to Express (port 3000)
/ts/node/*      →  serve dist/ts/ static files (same TS build)
/js/py/*        →  serve dist/js/ static files
```

Flask no longer serves static files in this setup — nginx handles that. Flask still serves `/uploads/`.

## Three-phase implementation

### Phase 1: Restructure the existing stack (enables the pattern, no new variants yet)

**Goal**: Get the current app working under `/ts/py/` with nginx routing it. All existing functionality preserved.

#### 1a. Update `vite.config.ts`
- Change `build.outDir` from `../dist/public` to `../dist/ts`
- Add `base: '/ts/py/'` — this makes Vite emit asset URLs like `/ts/py/assets/main.js` in the built HTML
- Update dev server proxy paths: proxy `/ts/py/api` and `/ts/py/uploads` to Flask (in addition to keeping `/api` and `/uploads` for direct dev server access)

#### 1b. Update `src_front/src/main.tsx`
Add runtime `basename` detection for `BrowserRouter` so React Router generates correct links:
```tsx
const base = window.location.pathname.match(/^\/(ts|js)\/(py|node)\//)?.[0] ?? '/'
// ...
<BrowserRouter basename={base}>
```

#### 1c. Update `src_front/src/api/client.ts`
Detect prefix at runtime so the same build works under any stack prefix:
```ts
function detectApiBase(): string {
  const match = window.location.pathname.match(/^\/(ts|js)\/(py|node)\//)
  return match ? `/${match[0]}api` : '/api'
}
const client = axios.create({ baseURL: detectApiBase(), timeout: 15000 })
```

#### 1d. Add `nginx/nginx.conf`
```nginx
server {
  listen 80;
  location = / { return 301 /ts/py/; }

  location /ts/py/api/ {
    proxy_pass http://backend:5000/api/;
  }
  location /ts/py/uploads/ {
    proxy_pass http://backend:5000/uploads/;
  }
  location /ts/py/ {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /ts/py/index.html;
  }
}
```

#### 1e. Update `docker-compose.yml`
- Add `nginx` service (image: nginx:alpine, mounts `nginx/nginx.conf` and `dist/`)
- No rename of existing `backend` service needed yet

#### 1f. Update `package.json` build scripts
```json
"build": "tsc -b && vite build"
```
(already works; `build.outDir` change in vite.config handles output location)

#### 1g. Rename directories and update import paths
- Rename `src_front/` → `src_front_ts/`
- Rename `src_back/` → `src_back_py/`
- Update all Python imports from `src_back.` → `src_back_py.` (in `app.py`, all route files, `models.py`, `migrations/env.py`, `docker-compose.yml` `FLASK_APP` env var, `railway.json` start command, `docker/entrypoint.sh`)
- Update `vite.config.ts`: `root: 'src_front_ts'` (already set; confirm)
- Update `tsconfig.app.json`: `include` path `src_front/src` → `src_front_ts/src`

#### 1h. Update `src_back_py/app.py`
The `serve_frontend` catch-all and static file setup can remain for backward compat / Railway use, but update `static_folder` from `dist/public` to `dist/ts`.

**Verification**: `npm run build` → `docker compose up` → `http://localhost/ts/py/` loads the app

---

### Phase 2: Add a plain JavaScript frontend (new `src_front_js/`)

**Goal**: A second frontend that uses no build framework — plain HTML + JS calling the same Flask API at `/js/py/api/`.

- Create `src_front_js/` with `index.html` and vanilla JS files
- Create `vite.config.js.ts` (Vite can bundle plain JS): `root: 'src_front_js'`, `build.outDir: '../dist/js'`, `base: '/js/py/'`
- Add `"build:js": "vite build --config vite.config.js.ts"` to `package.json`
- Add `/js/py/` location block to `nginx/nginx.conf` (routes to same Flask backend)

**Verification**: `npm run build:js` → restart nginx → `http://localhost/js/py/` loads plain JS version

---

### Phase 3: Add a Node.js/Express backend (new `src_back_node/`)

**Goal**: An Express server that implements the same REST API (`/api/ponies/`, `/api/hobbies/`, etc.) connecting to the same PostgreSQL database.

- Create `src_back_node/` with `package.json`, `server.js`, and route files mirroring Flask blueprints
- Create `docker/backend_node.Dockerfile`
- Add `backend_node` service to `docker-compose.yml` (port 3000, same `DATABASE_URL`)
- Add `/ts/node/api/` and `/js/node/api/` location blocks to `nginx/nginx.conf` routing to `backend_node:3000`

**Verification**: `docker compose up` → `http://localhost/ts/node/` uses same TS frontend but hits Express

---

## Critical files

| File | Change |
|------|--------|
| `vite.config.ts` | `base`, `build.outDir`, proxy paths |
| `src_front/src/main.tsx` | BrowserRouter `basename` detection |
| `src_front/src/api/client.ts` | API base URL runtime detection |
| `nginx/nginx.conf` | NEW — the router |
| `docker-compose.yml` | Add nginx service |
| `src_back/app.py` | Update `static_folder` path |
| `package.json` | Add `build:js` script (Phase 2) |

## Key constraint: three things must agree on the prefix

`vite.config.ts build.base` + `BrowserRouter basename` + `nginx location block` must all use the same prefix string (`/ts/py/`). If any one is wrong, assets load from wrong paths or navigation breaks.

## Dev workflow

For hot-reload development, continue using Vite dev server directly (`npm run dev` at port 5173) — the prefix detection falls back to `/api` when no prefix is detected. The nginx setup is for production-style multi-stack comparison. A `docker compose up` runs both.
