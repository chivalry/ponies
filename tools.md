# Project Tool Analysis: Ponies

This document catalogs every tool and library used in the ponies
project — both runtime app dependencies and developer tooling —
with an explanation of why each one is needed.

---

## Project Overview

A full-stack web application with:

- **Backend:** Python / Flask REST API (`src_back/`)
- **Frontend:** React / TypeScript SPA (`src_front/`)
- **Database:** PostgreSQL
- **Deployment:** Railway (backend), Vite dev server (frontend dev)

---

## Python Runtime Dependencies

### Flask (`flask` 3.1.3)

The core web framework. Handles HTTP routing, request/response
lifecycle, and application configuration. The backbone of the
backend API server.

### Flask-RESTful (`flask-restful` 0.3.10)

Extension that adds Resource-based routing to Flask. Makes it easy
to define REST API endpoints as classes with `get()`, `post()`,
`put()`, `delete()` methods, reducing boilerplate versus raw Flask
route functions.

### Flask-SQLAlchemy (`flask-sqlalchemy` 3.1.1)

Bridges Flask's application context with SQLAlchemy's ORM. Manages
database connection lifecycle tied to the Flask app, provides the
`db` object used for model definitions and queries.

### Flask-Migrate (`flask-migrate` 4.1.0)

Integrates Alembic (database migration tool) with Flask's CLI.
Enables `flask db init`, `flask db migrate`, and `flask db upgrade`
commands to manage schema changes over time without dropping and
recreating tables.

### Flask-CORS (`flask-cors` 6.0.2)

Handles Cross-Origin Resource Sharing headers. Required because the
React frontend (on port 5173 in dev) makes requests to the Flask
backend (on port 5000) — browsers block cross-origin requests
without proper CORS headers.

### marshmallow (`marshmallow` 4.3.0)

Serialization/deserialization and validation library. Used to
convert SQLAlchemy model instances to JSON for API responses, and
to validate and deserialize incoming JSON request bodies. Keeps
data-layer objects separate from API contract objects.

### psycopg2-binary (`psycopg2-binary` 2.9.12)

PostgreSQL database adapter for Python. The low-level driver that
SQLAlchemy uses to talk to PostgreSQL. The "binary" variant includes
pre-compiled C extensions so no local PostgreSQL dev headers are
needed for installation.

### python-dotenv (`python-dotenv` 1.2.2)

Loads environment variables from `.env` files into `os.environ`.
Allows the app to read `DATABASE_URL`, `SECRET_KEY`, etc. from a
local file during development without hard-coding credentials.

### gunicorn (`gunicorn` 25.3.0)

Production WSGI server. Flask's built-in development server is
single-threaded and not suitable for production. Gunicorn is a
multi-worker HTTP server that runs the Flask app in deployment
(both Docker and Railway).

### Pillow (`pillow` 12.2.0)

Python imaging library. Used to process uploaded image files —
resizing, format conversion, or validation of pony images before
saving them to the upload folder.

### requests (`requests` 2.33.1)

HTTP client library. Used in the backend to make outbound HTTP
requests (e.g., to external APIs or services). More ergonomic than
Python's built-in `urllib`.

---

## Python Transitive Dependencies (auto-installed)

### SQLAlchemy (`sqlalchemy` 2.0.49)

The underlying ORM that Flask-SQLAlchemy wraps. Provides the model
class system, query builder, and connection pool. Flask-SQLAlchemy
requires it.

### alembic (`alembic` 1.18.4)

Database migration engine that Flask-Migrate wraps. Generates
migration scripts by comparing SQLAlchemy models to the live
database schema, then applies them in order.

### Werkzeug (`werkzeug` 3.1.8)

WSGI utility library that Flask is built on. Handles
request/response objects, URL routing internals, dev server, and
security utilities. Flask requires it.

### Jinja2 (`jinja2` 3.1.6)

Template engine used by Flask for rendering HTML templates (if any)
and by Alembic for generating migration script files from the
`script.py.mako` template.

### Mako (`mako` 1.3.11)

Another template engine, used specifically by Alembic to render
migration file templates (`script.py.mako`).

### click (`click` 8.3.2)

CLI framework that Flask's command-line interface is built on.
Enables `flask run`, `flask db migrate`, etc.

### itsdangerous (`itsdangerous` 2.2.0)

Cryptographic signing library used by Flask for securely signing
session cookies and tokens (uses `SECRET_KEY`).

### blinker (`blinker` 1.9.0)

Signal/event system used by Flask for its internal signaling
(e.g., `request_started`, `request_finished`). Required by Flask.

### aniso8601 (`aniso8601` 10.0.1)

ISO 8601 date/time parsing, required by Flask-RESTful for parsing
date fields in request arguments.

### MarkupSafe (`markupsafe` 3.0.3)

HTML-safe string handling, required by Jinja2 to prevent XSS when
rendering templates.

### certifi (`certifi` 2026.2.25)

Mozilla's CA certificate bundle, used by the `requests` library to
verify HTTPS connections.

### charset-normalizer (`charset-normalizer` 3.4.7)

Character encoding detection, used by `requests` to handle response
body encoding.

### idna (`idna` 3.12)

Internationalized Domain Names (IDNA) encoding support, used by
`requests` for non-ASCII hostnames.

### urllib3 (`urllib3` 2.6.3)

Low-level HTTP connection pooling library, used internally by
`requests`.

### six (`six` 1.17.0)

Python 2/3 compatibility shim. Present as a transitive dependency
of older packages (likely Flask-RESTful).

### pytz (`pytz` 2026.1.post1)

Timezone database and conversions. Used by Flask-RESTful or other
packages for timezone-aware datetime handling.

### typing_extensions (`typing_extensions` 4.15.0)

Backports of newer `typing` module features to older Python
versions. Required by SQLAlchemy and other packages.

### packaging (`packaging` 26.1)

PEP 440 version parsing and comparison. Used by pip and various
tools to handle version constraints.

---

## Python Development & Testing Dependencies

### ruff (`ruff` 0.15.11)

Fast Python linter and formatter (written in Rust). Replaces
flake8, isort, and black in a single tool. Configured in
`pyproject.toml` to enforce error rules (E), pyflakes (F),
warnings (W), import sorting (I), and upgrade hints (UP) with a
90-character line limit.

### pytest (`pytest` 9.0.3)

Python test framework. Runs test files in `src_back/tests/`
matching `test_*.py`. Provides fixtures, assertions, test
discovery, and reporting.

### pytest-flask (`pytest-flask` 1.3.0)

pytest plugin providing Flask-specific fixtures like `client` (test
HTTP client) and `app` (Flask app instance). Simplifies writing
tests for Flask routes without starting a real server.

### coverage (`coverage` 7.13.5)

Test coverage measurement tool. Tracks which lines of Python code
are executed during tests, reporting what percentage of the
codebase is covered by tests.

### iniconfig (`iniconfig` 2.3.0)

INI file parser used by pytest to read its configuration section
in `pyproject.toml`.

### pluggy (`pluggy` 1.6.0)

Plugin management system that pytest is built on. Handles pytest's
extensible hook architecture.

### Pygments (`pygments` 2.20.0)

Syntax highlighting library. Used by pytest to colorize tracebacks
and code snippets in test output.

---

## JavaScript Runtime Dependencies

### react (`react` 18.3.1) + react-dom (`react-dom` 18.3.1)

The core UI library. React provides the component model and
rendering engine; react-dom connects it to the browser DOM.
Everything in the frontend is built on these.

### react-router-dom (`react-router-dom` 7.1.5)

Client-side routing library. Enables the SPA to render different
components for different URL paths without full page reloads.
Provides `<BrowserRouter>`, `<Route>`, `<Link>`, `useNavigate`,
etc.

### @mui/material + @mui/icons-material (6.4.8)

Material Design component library (MUI v6). Provides pre-built,
accessible UI components (buttons, forms, dialogs, tables, etc.)
and a large icon set. Eliminates the need to build common UI
components from scratch.

### @emotion/react + @emotion/styled (11.13.5)

CSS-in-JS styling engine that MUI is built on. `@emotion/react`
provides the core `css` prop and keyframes; `@emotion/styled`
provides the `styled()` API for creating component-scoped styles.
Required by MUI.

### axios (`axios` 1.7.9)

HTTP client for the browser. Makes API requests from the frontend
to the Flask backend (`/api/*`). Provides a cleaner API than
`fetch` with automatic JSON serialization, response interceptors,
and error handling.

### formik (`formik` 2.4.6)

Form state management library for React. Handles form values,
validation triggering, touched/error state, and submission — the
repetitive plumbing that every form needs.

### yup (`yup` 1.6.1)

Schema-based validation library. Works with Formik to define
validation rules declaratively (e.g., `string().required().min(3)`).
Formik calls Yup's `validate()` and maps errors back to form
fields.

---

## JavaScript Development Dependencies

### vite (`vite` 6.0.7)

Frontend build tool and dev server. Extremely fast because it uses
native ES modules in development (no bundling step). Handles
TypeScript transpilation, JSX, hot module replacement (HMR), and
production bundling via Rollup. The `src_front` directory is the
Vite root.

### @vitejs/plugin-react (`@vitejs/plugin-react` 4.3.4)

Vite plugin that enables React support — JSX transform, Fast
Refresh (HMR for React components), and emotion babel transforms.
Required to use React with Vite.

### typescript (`typescript` 5.7.3)

The TypeScript compiler. Type-checks the frontend source code and
(during `npm run build`) compiles it. Configured via
`tsconfig.app.json` targeting ES2023 with strict mode.

### vitest (`vitest` 4.1.5)

Unit test framework built on top of Vite. Uses the same config as
Vite, making it fast and compatible with ESM. Configured with jsdom
as the test environment so React components can be tested without a
real browser.

### @vitest/ui (`@vitest/ui` 4.1.5)

A browser-based UI for Vitest. Shows test results in a graphical
interface when running `vitest --ui`, making it easier to browse
test suites and failures.

### @testing-library/react (`@testing-library/react` 16.3.2)

Testing utilities for rendering React components in tests. Provides
`render()`, `screen`, `fireEvent`, and query helpers that encourage
testing components from the user's perspective rather than
implementation details.

### @testing-library/jest-dom (`@testing-library/jest-dom` 6.9.1)

Custom DOM matchers for Vitest/Jest (e.g.,
`expect(el).toBeInTheDocument()`, `toHaveTextContent()`). Makes
assertions about DOM state more readable and meaningful.

### @testing-library/user-event (`@testing-library/user-event` 14.6.1)

Simulates real user interactions (typing, clicking, tabbing) in
tests. More realistic than `fireEvent` because it dispatches the
full sequence of events a real user would trigger.

### jsdom (`jsdom` 29.0.2)

JavaScript implementation of the browser DOM. Used by Vitest as
the test environment — provides `document`, `window`, etc. without
a real browser.

### eslint (`eslint` 9.18.0)

JavaScript/TypeScript linter. Statically analyzes code for bugs,
anti-patterns, and style issues. Uses the new "flat config" format
(`eslint.config.js`).

### typescript-eslint (`typescript-eslint` 8.20.0)

ESLint plugin and parser for TypeScript. Enables ESLint to
understand TypeScript syntax and adds TypeScript-specific lint
rules (e.g., no implicit `any`).

### eslint-plugin-react-hooks (`eslint-plugin-react-hooks` 5.1.0)

ESLint plugin enforcing the Rules of Hooks — e.g., hooks must be
called at the top level, not conditionally. Catches common React
hook misuse bugs.

### eslint-plugin-react-refresh (`eslint-plugin-react-refresh` 0.4.18)

ESLint plugin that warns when a component file exports non-component
values, which breaks Vite's Fast Refresh (HMR). Keeps hot reloading
working correctly during development.

### globals (`globals` 15.14.0)

Provides lists of global variables for different environments
(browser, Node.js, etc.). Used by ESLint to know which globals are
available without flagging them as undefined.

### prettier (`prettier` 3.4.2)

Opinionated code formatter. Enforces consistent style (single
quotes, no semicolons, 90-char lines, trailing commas) across all
TypeScript/JavaScript files. Configured in `.prettierrc`.

### husky (`husky` 9.1.7)

Git hooks manager. Installs `.husky/pre-commit` as a git pre-commit
hook. The `prepare` npm script installs it automatically after
`npm install`.

### lint-staged (`lint-staged` 16.4.0)

Runs linters only on git-staged files. Works with Husky so that the
pre-commit hook only lints changed files (fast) rather than the
entire codebase. Runs ESLint+Prettier on staged `.ts/.tsx` files
and Ruff on staged `.py` files.

### @types/react + @types/react-dom + @types/node

TypeScript type definitions for React, ReactDOM, and Node.js
built-ins. These are not runtime code — they provide type
information to the TypeScript compiler so it can type-check usage
of these libraries.

---

## Infrastructure & DevOps Tools

### Docker

Container runtime. Used to package the backend and frontend into
isolated, reproducible environments.

### Docker Compose

Multi-container orchestration tool. Defines and starts all three
services (PostgreSQL, Flask backend, React frontend) together with
a single `docker compose up` command, wiring them together on a
shared network.

**Services defined:**

- `db` — PostgreSQL 16 database server
- `backend` — Flask/Gunicorn API server (python:3.12-slim)
- `frontend` — Vite dev server (node:22-slim)

### PostgreSQL 16

Relational database. Stores ponies, hobbies, friendships, and their
relationships. Used via Docker in development and expected to be
provisioned externally in production (Railway provides a managed
PostgreSQL add-on).

### Alembic (via Flask-Migrate)

Database schema migration tool. Tracks schema changes as versioned
Python scripts in `migrations/versions/`. Enables incremental,
reversible schema changes (`upgrade`/`downgrade`) without data
loss.

### Railway

Cloud deployment platform (railway.app). Configured via
`railway.json` to deploy the backend using the backend Dockerfile.
Runs `flask db upgrade && gunicorn app:app` on start. Restart
policy is `ON_FAILURE`.

### Gunicorn

Production WSGI server (also listed under Python runtime above).
Configured to bind to `0.0.0.0:5000` with `--reload` in Docker
(for development) and without reload in Railway production.

---

## Editor & Workflow Tooling

### .editorconfig

Editor-agnostic configuration file read by most editors/IDEs.
Enforces consistent charset (UTF-8), line endings (LF), indentation
(4 spaces, 2 for YAML), and trailing whitespace behavior across all
editors.

### .vscode/settings.json

VS Code workspace settings. Currently only maps the LICENSE file to
plaintext syntax highlighting.

### npm scripts (package.json)

Shorthand commands for common developer tasks:

- `dev` — start Vite dev server
- `build` — type-check then bundle for production
- `lint` / `format` — lint/format frontend JS/TS
- `lint:py` / `format:py` — lint/format backend Python
- `test` / `test:watch` — run Vitest once or in watch mode
- `prepare` — auto-install Husky after `npm install`

---

## Configuration Files Summary

| File | Tool | Purpose |
| --- | --- | --- |
| `requirements.txt` | pip | Python runtime + dev dependencies |
| `pyproject.toml` | Ruff, pytest | Python linter/test config |
| `package.json` | npm | JS deps, scripts, lint-staged config |
| `package-lock.json` | npm | Lockfile for reproducible installs |
| `tsconfig.json` | TypeScript | Root tsconfig (references app + node) |
| `tsconfig.app.json` | TypeScript | Frontend TS config (ES2023, strict) |
| `tsconfig.node.json` | TypeScript | Vite config TS config (Node types) |
| `vite.config.ts` | Vite, Vitest | Build config, dev proxy, test env |
| `eslint.config.js` | ESLint | Lint rules for TS/React |
| `.prettierrc` | Prettier | Format rules |
| `.editorconfig` | EditorConfig | Editor-level consistency |
| `docker-compose.yml` | Docker Compose | Local dev environment |
| `docker/backend.Dockerfile` | Docker | Backend container definition |
| `docker/frontend.Dockerfile` | Docker | Frontend container definition |
| `railway.json` | Railway | Production deployment config |
| `migrations/alembic.ini` | Alembic | Migration engine config |
| `.husky/pre-commit` | Husky | Pre-commit hook script |
| `.env` | python-dotenv | Local dev environment variables |
| `.gitignore` | Git | Excludes build artifacts, secrets |
