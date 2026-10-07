# API Counter

A self-hosted mock API server with per-endpoint request counting and a management dashboard. Developers register custom API paths; each registered path that does not begin with `/management` and does not collide with a file in `public/` returns a mock JSON response containing the endpoint name, an incrementing call count, and a timestamp.

## Quick Start

```bash
git clone https://github.com/Babar-Meet/API-Counter.git
cd API-Counter
npm install
npm start
```

The dashboard is at <http://localhost:3000>. Register a path such as `/api/v1/users` there, then call it:

```bash
curl http://localhost:3000/api/v1/users
# {"message":"Mock response for /api/v1/users","count":1,"timestamp":"..."}
```

On Windows PowerShell, use `Invoke-RestMethod http://localhost:3000/api/v1/users` instead, or `curl.exe` where it is present: Windows PowerShell 5.1 aliases `curl` to `Invoke-WebRequest`, so bare `curl` does not run curl. Whether the alias then errors or prompts depends on the host and its patch level, so neither behaviour should be relied on; the two commands named here are unambiguous.

Node.js 18 or newer is the floor implied by the dependencies, not a repository-declared minimum: `package.json` has no `engines` field and nothing in this repository enforces a version, and the declared ranges `^5.2.1` and `^2.2.2` are not pinned to the installed `express` 5.2.1 and `body-parser` 2.2.2, which each declare `node >= 18`. Counts are written to `data.json` in the project folder. Before deploying anywhere, read [Deployment (Vercel)](#deployment-vercel) before relying on any count there.

## Purpose

API Counter solves the problem of needing ephemeral, countable mock API endpoints during development and testing. Instead of relying on external mock services or writing disposable endpoints, a developer can register a path (e.g. `/api/v1/users`, `/webhook/test`) and immediately receive a predictable JSON response, as long as the path does not begin with `/management` and does not collide with a file in `public/`. Each call increments a persistent counter, making it trivial to verify that a client is hitting the correct endpoint the expected number of times.

Intended for frontend developers, integration testers, and anyone who needs quick, observable mock endpoints without building a full backend.

## Features

- **Dynamic mock endpoint registration** — Create a path at runtime via the dashboard or `POST /management/apis`. A path under `/management`, or one that matches a file in `public/`, is accepted but not served as mock JSON by `GET` or `HEAD`; see [Catch-all mock handler](#catch-all-mock-handler)
- **Per-endpoint request counter** — Each mock call increments an integer counter, written to disk on every change; a write that cannot be performed throws and the request returns `500`
- **Management dashboard** — Dark-themed web UI listing all registered endpoints, their call counts, creation dates, and action buttons
- **Management API** — Create, list and delete endpoints, and reset an individual count or all counts. A registered path cannot be changed: delete the endpoint and create it again, which starts its count at 0
- **One-click copy URL** — Copy the full absolute URL of any endpoint to the clipboard
- **Auto-polling dashboard** — The frontend refreshes every 2 seconds to reflect live counter changes
- **Vercel-deployable** — Configured for serverless deployment via `@vercel/node`. Counts live in one instance's memory and are written to `data.json` on every change; when that write cannot be performed the change has already been applied in memory and the request still returns `500`, so the caller is not told the new count, while a later `GET /management/apis` can still show it. Whether a deployed filesystem accepts the write was not verified here; see [Deployment (Vercel)](#deployment-vercel)

## Tech Stack

| Category | Technology | Evidence |
|----------|------------|----------|
| Language | JavaScript (Node.js) | `server.js`, `public/script.js` |
| Runtime | Node.js (CommonJS) | `package.json` `"type": "commonjs"`, `"start": "node server.js"` |
| Web Framework | Express 5 | `package.json` dependency `express: ^5.2.1` |
| Middleware | `cors` `^2.8.6` | `package.json` dependency `cors: ^2.8.6` |
| Middleware | `body-parser` `^2.2.2` | `package.json` dependency `body-parser: ^2.2.2` |
| Frontend | Vanilla HTML/CSS/JS | `public/index.html`, `style.css`, `script.js` |
| Icons | Lucide | `public/index.html` imports `unpkg.com/lucide@latest` |
| Fonts | Google Fonts (Inter, Outfit) | `public/index.html` imports from `fonts.googleapis.com` |
| Storage | Flat JSON file | `data.json`, written via `fs.writeFileSync` on every change; see [State management](#state-management) for what happens when that write fails |
| Deployment | Vercel (configured, not deployed here) | `vercel.json` with `@vercel/node` build; see [Deployment (Vercel)](#deployment-vercel) |

## Project Structure

```
API-Counter/
├── .gitignore                # Ignores node_modules, .DS_Store, data.json, package-lock.json
├── .playwright-mcp/          # Committed Playwright session logs and page snapshots (tool output)
├── LICENSE                   # Proprietary, all rights reserved
├── README.md                 # This file
├── THIRD-PARTY-LICENSES.md   # Licences and copyright holders for the third-party components the dashboard loads
├── data.json                 # Persistent store for endpoint definitions and counters
├── package.json              # Node.js manifest and dependency declarations
├── package-lock.json         # Dependency lock file (gitignored)
├── remotion-video/           # Committed Remotion/React showcase-video subproject (own package.json)
├── server.js                 # Express application — management API + mock handler + static file server
├── vercel.json               # Vercel serverless deployment configuration
├── public/
│   ├── index.html            # Dashboard UI — list view, add modal, stats overview
│   ├── script.js             # Frontend logic — fetching, rendering, modals, polling
│   └── style.css             # Dark-themed stylesheet with responsive layout
└── node_modules/             # Installed dependencies (gitignored)
```

### Key files explained

- **`server.js`** — The entire backend. Sets up Express, CORS, body-parser, serves the `public/` directory as static files, adds an explicit `GET /` handler that sends `public/index.html`, exposes the management API under `/management/`, and registers a catch-all middleware that compares an incoming request path against the registered endpoints and, on an exact match, returns a mock JSON response with an incrementing count.
- **`data.json`** — A flat JSON file containing an `endpoints` array. Each endpoint object has `id`, `path`, `count`, and `createdAt`. Written to synchronously after every mutation. According to `.gitignore` this file is not committed to version control.
- **`vercel.json`** — Routes all paths (`/management/(.*)`, `/api/(.*)`, `/(.*)`) to the Express serverless function via `@vercel/node`.
- **`remotion-video/`** — A separate Remotion/React subproject (`api-counter-showcase`, `react`/`react-dom` `^18.3.1`, `remotion` `^4.0.245`) that renders a showcase video of the dashboard with `npm run build`. It is not needed to run the server: the root `package.json` never references it and `server.js` never loads anything from it. Six dashboard screenshots, the generator that inlines them into `src/ShowcaseVideo/images.js`, and the rendered `out/api-counter-showcase.mp4` are all committed to git.
- **`public/index.html`** — Single-page application with a header (logo, "Reset All" and "Add API" buttons), statistic cards (Total APIs, Total Calls), a grid of API cards, and a modal for creating new endpoints.
- **`public/script.js`** — Fetches endpoints from `/management/apis`, renders them as cards, handles add/delete/reset/reset-all/copy-URL actions, and polls every 2 seconds.
- **`public/style.css`** — Full dark theme using CSS custom properties, glassmorphism, gradient accents, responsive grid layout, and modal animation.

## Architecture

### Request flow

```
┌─────────┐    HTTP     ┌─────────────────────────────────────┐
│ Browser │ ──────────> │         Express Server              │
│  Client │             │                                     │
└─────────┘             │  ┌─────────────────────────────┐    │
                        │  │ 1. Static Files (public/)   │    │
                        │  │   index.html, script.js,    │    │
                        │  │   style.css: a registered   │    │
                        │  │   path equal to one of them │    │
                        │  │   gets the file, not a mock │    │
                        │  └─────────────────────────────┘    │
                        │                                     │
                        │  ┌─────────────────────────────┐    │
                        │  │ 2. Root Route               │    │
                        │  │   GET / sends public/       │    │
                        │  │   index.html                │    │
                        │  └─────────────────────────────┘    │
                        │                                     │
                        │  ┌─────────────────────────────┐    │
                        │  │ 3. Management API           │    │
                        │  │   /management/apis          │    │
                        │  │   /management/apis/:id      │    │
                        │  │   /management/apis/:id/reset│    │
                        │  │   /management/apis/reset-all│    │
                        │  └─────────────────────────────┘    │
                        │                                     │
                        │  ┌─────────────────────────────┐    │
                        │  │ 4. Catch-all Mock Handler   │    │
                        │  │   skips /management*, then  │    │
                        │  │   compares req.path exactly:│    │
                        │  │   count++ and JSON, else 404│    │
                        │  └─────────────────────────────┘    │
                        │                                     │
                        │  ┌─────────────────────────────┐    │
                        │  │ 5. Express default 404      │    │
                        │  └─────────────────────────────┘    │
                        └─────────────────────────────────────┘
                                     │
                                     ▼
                          ┌────────────────────┐
                          │     data.json      │
                          │  (persistent       │
                          │   endpoint store)  │
                          └────────────────────┘
```

### Data flow

1. **Create endpoint**: POST `/management/apis` with `{ path: "/some/path" }` → endpoint is appended to `apiConfig.endpoints` array → `data.json` is written to disk → 201 JSON response with the new endpoint object.
2. **Mock call**: A registered path that does not begin with `/management` and does not collide with a file in `public/` is hit (e.g. `GET /api/v1/users`) → the catch-all middleware finds the matching endpoint → `endpoint.count++` → `data.json` is written → JSON response `{ message, count, timestamp }` is returned. A `GET` to a path that collides with a file in `public/` is answered by `express.static` with that file and gets no count; every other unmatched path falls through to Express's default 404.
3. **Dashboard poll**: `script.js` calls `GET /management/apis` every 2 seconds → re-renders all cards and stats.

### State management

All state lives in a single in-memory `apiConfig` object loaded from `data.json` at startup. Every mutation (create, delete, reset, count increment) synchronously writes the full array back to `data.json`. There is no database and no caching layer, and while the write succeeds the in-memory state and the file cannot drift apart.

`saveData()` is an unguarded `fs.writeFileSync` with no try/catch, so a write that cannot be performed throws out of the handler that called it rather than resetting anything silently. Two further facts come straight from the repository: `saveData()` writes to `path.join(__dirname, 'data.json')`, with no fallback location, and `data.json` is gitignored and untracked, so no build of this repository contains it — with no file present, `apiConfig` stays at `{ "endpoints": [] }` and a cold start serves an empty endpoint list. How a deployed serverless filesystem handles that write is a platform behaviour that could not be verified from this repository. The flat-file persistence is effectively **single-process local development only**.

### Authentication flow

Not applicable. The server has no authentication or authorization. Any client that can reach the server can read, create, delete, and reset endpoints.

## Core Components

### Express server (`server.js`)

| Aspect | Detail |
|--------|--------|
| Responsibility | HTTP server, management API, static file serving, catch-all mock handler |
| Inputs | HTTP requests via Express router |
| Outputs | JSON responses, static files, writes to `data.json` |
| Dependencies | `express`, `cors`, `body-parser`, `fs`, `path` |
| Exported symbol | `app` (Express instance, exported for Vercel serverless compatibility) |

### Management API

Five routes under `/management/`:

| Method | Route | Purpose | Response |
|--------|-------|---------|----------|
| `GET` | `/management/apis` | List all registered endpoints | `200` + array of endpoint objects |
| `POST` | `/management/apis` | Create a new endpoint | `201` + new endpoint object, or `400` on missing path or duplicate path. A non-string `path` (e.g. `{"path": 123}`) is not rejected with `400`: it throws inside the handler and returns `500` |
| `DELETE` | `/management/apis/:id` | Delete an endpoint by ID | `200` + success message, or `404` if not found |
| `POST` | `/management/apis/:id/reset` | Reset one endpoint's count to 0 | `200` + updated endpoint, or `404` if not found |
| `POST` | `/management/apis/reset-all` | Reset all endpoints' counts to 0 | `200` + confirmation message |

There is no update or rename operation: the five routes above are the whole surface, and the only field ever changed on an existing endpoint is `count`.

### Catch-all mock handler

Registered via `app.use()` after the management routes. It:

1. Skips requests under `/management` (delegates to `next()`)
2. Looks up `req.path` in the `apiConfig.endpoints` array by exact, case-sensitive string comparison, so a trailing slash or a different case does not match
3. If found: increments `endpoint.count`, saves to `data.json`, returns `{ message, count, timestamp }`
4. If not found: calls `next()` (which eventually results in Express's default 404)

It runs after `express.static`, which serves only `GET` and `HEAD` and passes every other method through. So a registered path that collides with a file in `public/` gets that file back for `GET` or `HEAD` and never reaches step 2, but a `POST`, `PUT` or `DELETE` to the same path falls through to the catch-all and is counted and answered with mock JSON like any other match.

Creation does not check either condition. A path under `/management`, or one matching a file in `public/`, is created and stored with `201`. A `GET` to a `/management` path then returns a 404, and a `GET` to a `public/` path returns the static file, instead of mock JSON, with the count left at 0.

### Dashboard frontend (`public/script.js`)

| Function | Responsibility |
|----------|---------------|
| `fetchApis()` | GET `/management/apis`, updates local state, calls `renderApis()` and `updateStats()` |
| `renderApis()` | Builds HTML for each endpoint card, calls `lucide.createIcons()` to hydrate icons |
| `updateStats()` | Computes total API count and total call sum, updates stat cards |
| `addNewApi()` | POST to `/management/apis` with the path from the modal input |
| `deleteApi(id)` | DELETE `/management/apis/:id` |
| `resetCount(id)` | POST `/management/apis/:id/reset` |
| `resetAll()` | Confirms with user then POST `/management/apis/reset-all` |
| `copyFullUrl(event, path)` | Writes `window.location.origin + path` to clipboard, shows a checkmark for 2 seconds |
| `openAddModal()` | Adds `.active` to the modal and focuses the path input; the only handler bound to the "Add API" button |
| `closeAddModal()` | Removes `.active` from the modal; bound to the close and cancel controls and to a click on the backdrop, and called after a successful create |
| Polling | `setInterval(fetchApis, 2000)` — refreshes every 2 seconds |

## APIs

### Internal management API

- **Base path**: `/management/apis`
- **Authentication**: None
- **Content-Type**: `application/json` (body-parser JSON)
- **Error format**: `{ error: "message" }` with appropriate HTTP status code

### Mock endpoint API

- **Any registered path that does not begin with `/management` and does not collide with a file in `public/`** (e.g. `/api/v1/users`, `/webhook/test`). Matching is an exact, case-sensitive string comparison against `req.path`, so a trailing slash or a different case does not match.
- **Authentication**: None
- **Response format**:
  ```json
  {
    "message": "Mock response for /api/v1/users",
    "count": 3,
    "timestamp": "2026-04-23T21:07:18.328Z"
  }
  ```
- **Error handling**: Paths that were never registered fall through to Express's default 404 with no count change. A path that collides with a file in `public/` returns that static file instead of a mock response, for `GET` and `HEAD` only; other methods on that path are counted and answered with mock JSON as usual.

## Environment Variables

| Variable | Purpose | Required | Default |
|----------|---------|----------|---------|
| `PORT` | Port the Express server listens on | No | `3000` |

No other environment variables are required.

## Database

**Not applicable.** The project uses a flat JSON file (`data.json`) for persistence, not a database. See [Architecture](#architecture) for limitations of this approach in serverless contexts.

## Configuration

### `package.json`

- **name**: `api-counter`
- **version**: `1.0.0`
- **main**: `index.js` — no `index.js` exists in this repository; the real entry point is `server.js`, which exports the Express `app` for serverless use
- **type**: `commonjs` (uses `require`/`module.exports`)
- **license**: `ISC` — this contradicts the [License](#license) section and the `LICENSE` file; see the known conflict noted there
- **scripts**:
  - `start` — `node server.js`
  - `dev` — `nodemon server.js`
  - `test` — Placeholder, exits 1
- **dependencies**:
  - `express ^5.2.1` — HTTP framework (routing, middleware, static files)
  - `cors ^2.8.6` — Cross-Origin Resource Sharing middleware
  - `body-parser ^2.2.2` — JSON request body parsing

### `vercel.json`

- **version**: 2
- **builds**: `server.js` → `@vercel/node`
- **routes**:
  - `/management/(.*)` → `server.js`
  - `/api/(.*)` → `server.js`
  - `/(.*)` → `server.js`

All routes map to the same serverless function. The Express application handles routing internally.

### `.gitignore`

Ignores `node_modules`, `.DS_Store`, `data.json`, and `package-lock.json` from version control.

## Dependencies

### Runtime dependencies

| Package | Why it exists |
|---------|---------------|
| `express` ^5.2.1 | Core HTTP framework — routing, middleware, static file serving |
| `cors` ^2.8.6 | Loaded as global middleware with no environment condition, so it is enabled for every request in every environment. Because the management API is unauthenticated, that makes it readable and writable cross-origin from any site that can reach the deployment |
| `body-parser` ^2.2.2 | Parses JSON request bodies for management API POST requests |

### Dev / implicit dependencies

- `nodemon` is referenced in the `dev` script but is **not declared in `package.json`**. It must be installed globally or added as a dev dependency before `npm run dev` works.

## Installation

```bash
git clone https://github.com/Babar-Meet/API-Counter.git
cd API-Counter
npm install
```

If you intend to use the dev script with auto-reload, install nodemon:

```bash
npm install --save-dev nodemon
```

## Running

```bash
# Production
npm start

# Development (with auto-reload via nodemon)
npm run dev
```

The server starts on the port specified by the `PORT` environment variable, or `3000` by default. Open `http://localhost:3000` in a browser to access the dashboard.

### Deployment (Vercel)

The `vercel.json` file configures serverless deployment. Deploy with the Vercel CLI:

```bash
npm i -g vercel
vercel login
vercel
```

`vercel login` and the first `vercel` run are interactive and are the CLI's own behaviour rather than something this repository configures: they establish a session and prompt for project linking.

**Important**: do not rely on `data.json` persistence after deploying. What the repository shows is that `saveData()` is an unguarded `fs.writeFileSync` with no try/catch, so a write that fails throws instead of resetting silently and turns create, delete, reset and mock calls into 500s, and that `data.json` is gitignored and untracked, so it is not part of a build of this repository. Whether a deployed function filesystem accepts that write is platform behaviour that was not verified here. Counts also live in one instance's memory. See [State management](#state-management) for the full picture.

### Build

Not applicable to the server: `npm start` runs `server.js` directly from source, and the root `package.json` declares no `build` script.

The tracked `remotion-video/` subproject does have a build. Its `npm run build` renders the showcase video to `out/api-counter-showcase.mp4` with Remotion. That is a showcase-video toolchain and is not needed to run this server.

### Test

```bash
npm test
```

The test script is a placeholder (`echo "Error: no test specified" && exit 1`). No test framework is configured.

### Lint / Format

No linting or formatting tools are configured in `package.json` or the repository.

## How It Works

1. A developer starts the server (`npm start` or `npm run dev`).
2. The server reads `data.json` (or creates an empty endpoint list if the file does not exist).
3. The dashboard loads at `http://localhost:3000` — it lists any existing endpoints and shows stats.
4. The developer clicks "Add API", enters a path (e.g. `api/v1/users`), and submits.
5. The server creates the endpoint and returns it; the dashboard re-renders immediately.
6. Any HTTP request to the registered path (from a browser, curl, Postman, or code) triggers the catch-all middleware. The server responds with:
   ```json
   { "message": "Mock response for /api/v1/users", "count": 1, "timestamp": "..." }
   ```
   This holds for paths outside `/management` that do not collide with a file in `public/`; see [Mock endpoint API](#mock-endpoint-api) for the cases that are not counted, including a `GET` to a path that collides with a file in `public/`.
7. Each subsequent call increments the count. The dashboard polls `/management/apis` every 2 seconds and updates the displayed count.
8. The developer can reset individual counters, reset all counters, or delete endpoints entirely.
9. All mutations are written to `data.json` immediately; a write that cannot be performed throws and turns the request into a 500 (see [State management](#state-management)).

## License

This project is proprietary. See the [LICENSE](./LICENSE) file for details.

Copyright (c) 2026 Babariya Meet. All rights reserved.

No permission is granted to use, copy, modify, merge, publish, distribute, sublicense, create derivative works from, reference, reverse engineer for replication, or otherwise exploit this project, in whole or in part, for any purpose without prior written permission from the copyright holder.

**Known conflict**: the terms above grant nothing without prior written permission, while `package.json` declares `"license": "ISC"`, a permissive grant. `LICENSE` is the licence of record for this repository. `package.json` declares `ISC`, which contradicts it. Which of the two is intended is the owner's decision and has not been resolved here. Until that field is corrected, do not publish this package to a registry: npm reads the `license` field, so a published copy would be presented as ISC-licensed.

**Third-party components**: the dashboard loads Lucide icons and the Inter and Outfit fonts from CDNs. Their licences and copyright holders are recorded in [THIRD-PARTY-LICENSES.md](./THIRD-PARTY-LICENSES.md).

---

*Documentation note*: this README was generated by AI from static analysis of the source tree and describes the implementation as of that pass. Where it disagrees with the code, the code wins. The unresolved discrepancy is the `license` field in `package.json`; see [License](#license).
