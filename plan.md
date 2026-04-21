# Full-Stack Pony Tracker Implementation Plan

## Overview

This plan details the implementation of a full-stack web application
for tracking ponies, their friendships, and hobbies. The stack includes:

- **Frontend:** TypeScript + React (Vite)
- **Backend:** Python + Flask + SQLAlchemy
- **Database:** PostgreSQL
- **Containerization:** Docker (local dev only)
- **Testing:** Jest (frontend), pytest (backend)
- **Project Structure:**
  - `src_back/` (backend)
  - `src_front/` (frontend)
  - `docker/` (Docker configs)
  - `migrations/` (DB migrations)

## Implementation Order (Dependency-Driven)

After completing each step below, create a git commit before
moving on to the next step.

1. **Project Structure & Tooling**
2. **Database Schema & Migrations**
3. **Backend Models & API**
4. **Frontend Bootstrapping**
5. **Dockerization**
6. **Testing Setup**
7. **Frontend Features**
8. **Backend Features**
9. **Integration & Finalization**

---

## 1. Project Structure & Tooling

- Create folders: `src_back/`, `src_front/`, `docker/`, `migrations/`
- Initialize Git, .gitignore, and README
- Set up Python virtual environment in `src_back/`
- Set up Node.js project in `src_front/`

## 2. Database Schema & Migrations

- Use Alembic for migrations
- All `id` fields are auto-incremented integers starting at 1
- All `uuid` fields are set on record creation (server-generated)
- Models:
  - **Ponies**: id (PK, auto-increment), name, image_path,
    uuid, created_timestamp, modified_timestamp
  - **Hobbies**: id (PK, auto-increment), name, pony_id (FK),
    uuid, created_timestamp, modified_timestamp
  - **Friendships**: id (PK, auto-increment),
    uuid, created_timestamp, modified_timestamp
  - **FriendshipHobbies**: id (PK, auto-increment),
    friendship_id (FK), hobby_id (FK),
    uuid, created_timestamp, modified_timestamp
  - **PonyFriendships**: id (PK, auto-increment),
    friendship_id (FK → friendships.id),
    pony_id (FK → ponies.id),
    uuid, created_timestamp, modified_timestamp
    (exactly 2 rows per friendship — one per pony)

  Notes:
  - `ponies.image_path` stores the server-side path to an uploaded
    image file
  - A hobby belongs to one pony (`hobbies.pony_id`) and may also be
    assigned to friendships via the `friendship_hobbies` join table
  - A friendship links exactly 2 ponies via the `pony_friendships`
    join table

  Example Alembic migration snippet:

  ```python
  op.create_table(
    'ponies',
    sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
    sa.Column('name', sa.String(80), nullable=False),
    sa.Column('image_path', sa.String(255)),
    sa.Column('uuid', sa.String(36), nullable=False, unique=True),
    sa.Column('created_timestamp', sa.DateTime, nullable=False),
    sa.Column('modified_timestamp', sa.DateTime, nullable=False),
  )
  ```

## 3. Backend Models & API

- `requirements.txt` packages:

  ```text
  Flask
  Flask-RESTful
  Flask-SQLAlchemy
  Flask-Migrate
  Flask-Cors
  marshmallow
  psycopg2-binary
  python-dotenv
  gunicorn
  Pillow
  ```

- `.env` (created directly — single developer, no `.env.example`):

  ```ini
  DATABASE_URL=postgresql://pony:pony@localhost:5432/ponies
  FLASK_ENV=development
  UPLOAD_FOLDER=src_back/uploads
  SECRET_KEY=change-me
  ```

- Use Flask, Flask-RESTful, SQLAlchemy, Marshmallow
- Implement models for each table
- Handle image uploads: accept multipart/form-data, store file on
  disk, save path in `ponies.image_path`
- Implement RESTful endpoints:
  - `/api/ponies/` [GET, POST]
  - `/api/ponies/<id>/` [GET, PUT, DELETE]
  - `/api/hobbies/` [GET, POST]
  - `/api/hobbies/<id>/` [GET, PUT, DELETE]
  - `/api/friendships/` [GET, POST]
  - `/api/friendships/<id>/` [GET, PUT, DELETE]
  - `/api/friendship_hobbies/` [GET, POST]
  - `/api/friendship_hobbies/<id>/` [GET, PUT, DELETE]
  - Assign hobbies to ponies: `/api/ponies/<id>/hobbies/` [POST]
  - Assign hobbies to friendships:
    `/api/friendships/<id>/hobbies/` [POST]

  Example endpoint:

  ```python
  @app.route('/api/ponies/', methods=['GET'])
  def list_ponies():
      ponies = Pony.query.all()
      return jsonify([pony.to_dict() for pony in ponies])
  ```

## 4. Frontend Bootstrapping

- Use Vite (TypeScript template) with a **single root-level
  `package.json`** — no nested `package.json` inside `src_front/`
- `src_front/` contains only: `index.html`, `src/`, `public/`
- All config files live at the project root:
  - `vite.config.ts` — sets `root: 'src_front'`,
    `build.outDir: 'dist/public'`, and proxies `/api` to Flask
    on port 5000
  - `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` —
    `include` must be set to `["src_front/src"]` (not `["src"]`)

    Example `tsconfig.app.json` excerpt:

    ```json
    {
      "compilerOptions": {
        "target": "ES2023",
        "lib": ["ES2023", "DOM"],
        "module": "ESNext",
        "moduleResolution": "bundler",
        "jsx": "react-jsx",
        "strict": true,
        "noEmit": true
      },
      "include": ["src_front/src"]
    }
    ```

  - `eslint.config.js`, `.prettierrc` — already at root
- Install dependencies: React, React Router, Axios, Formik, Yup,
  Material UI
- Configure TypeScript strict mode

## 5. Dockerization

- Docker is for local development only (not production deployment)
- Backend Dockerfile: Python, install dependencies, expose port 5000
- Frontend Dockerfile: Node dev server, expose port 5173
- `docker-compose.yml`:
  - Services: db (Postgres), backend, frontend
  - Volumes for db persistence and source code hot-reload
  - Environment variables for secrets/config
  - **The backend service must set `FLASK_APP: src_back.app`** so that
    `flask db upgrade` in the startup command can locate the application
  - **The frontend service must set `VITE_API_URL: http://backend:5000`**
    so that the Vite dev-server proxy resolves the backend by its Docker
    service name rather than `localhost` (which refers to the frontend
    container itself inside Docker)
  - In `vite.config.ts` the proxy target must read this env var:
    `target: process.env.VITE_API_URL ?? 'http://localhost:5000'`
    so local `npm run dev` (outside Docker) still works

  Example service config:

  ```yaml
  services:
    db:
      image: postgres:16
      environment:
        POSTGRES_USER: pony
        POSTGRES_PASSWORD: pony
        POSTGRES_DB: ponies
      ports:
        - '5432:5432'

    backend:
      environment:
        FLASK_APP: src_back.app          # required for flask db upgrade
        DATABASE_URL: postgresql://pony:pony@db:5432/ponies

    frontend:
      environment:
        VITE_API_URL: http://backend:5000  # Docker service name, not localhost
  ```

## 6. Testing Setup

- Backend: pytest, pytest-flask, coverage
- Frontend: Jest, React Testing Library
- Add sample test files for each major module/component

## 7. Frontend Features

- Pony List & Profile pages
- Pony creation/edit form with image file upload
- Hobby list and assignment UI
- Friendship list and creation UI
- Assign hobbies to friendships UI
- Use Axios for API calls

  Example PonyCard component:

  ```tsx
  export const PonyCard = ({ pony }) => (
    <Card>
      <img src={pony.image_path} alt={pony.name} />
      <h2>{pony.name}</h2>
      {/* ...hobbies, friends... */}
    </Card>
  )
  ```

## 8. Backend Features

- CRUD logic for all models
- Image upload handling (multipart/form-data, disk storage)
- Input validation (Marshmallow schemas)
- Error handling (404, 400, etc.)
- CORS setup for frontend-backend communication

## 9. Integration & Finalization

- End-to-end test: create ponies, assign hobbies, create friendships
- Lint all code, ensure no lines >90 chars
- Build Docker images, run with docker-compose

---

## Deployment

### Option A: Mac laptop (Docker)

The user runs the app locally via Docker Compose. No hosting cost.

```sh
docker-compose up
```

- Postgres data persists in a named Docker volume across restarts
- Data is only lost if the user explicitly runs `docker-compose down -v`
- Uploaded images persist via a bind-mounted `src_back/uploads/` folder

### Option B: Railway (cloud)

Target host: **Railway** (railway.app)

- Single-user load — will comfortably fit within Railway's free credit
  (~$5/month); expected cost $1-3/month
- Deploy backend as a Railway service from the Git repo
- Use Railway's managed Postgres add-on (data persists in Railway's
  infrastructure)
- Build and serve the Vite frontend as static files via the Flask backend
  (Flask serves `dist/public/` in production)
- Uploaded images: store in the `src_back/uploads/` directory; note that
  Railway's filesystem is ephemeral — for persistent image storage on
  Railway, use an S3-compatible bucket (e.g., Cloudflare R2 free tier)

### railway.json

```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "docker/backend.Dockerfile"
  },
  "deploy": {
    "startCommand": "flask db upgrade && gunicorn app:app",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

---

## Example File Structure

```text
ponies/
├── src_back/
│   ├── app.py
│   ├── models.py
│   ├── api/
│   ├── tests/
│   └── requirements.txt
├── src_front/
│   ├── index.html
│   ├── src/
│   └── public/
├── migrations/
├── docker/
│   ├── backend.Dockerfile
│   └── frontend.Dockerfile
├── docker-compose.yml
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── .prettierrc
├── .editorconfig
├── pyproject.toml
├── README.md
└── plan.md
```

## Example API Endpoint Table

<!-- markdownlint-disable MD033 -->
| Endpoint                         | Method | Description                   |
|----------------------------------|--------|-------------------------------|
| /api/ponies/                     | GET    | List all ponies               |
| /api/ponies/                     | POST   | Create a new pony             |
| /api/ponies/\<id\>/              | GET    | Get pony by id                |
| /api/ponies/\<id\>/              | PUT    | Update pony                   |
| /api/ponies/\<id\>/              | DELETE | Delete pony                   |
| /api/hobbies/                    | GET    | List all hobbies              |
| /api/hobbies/                    | POST   | Create a new hobby            |
| /api/hobbies/\<id\>/             | GET    | Get hobby by id               |
| /api/hobbies/\<id\>/             | PUT    | Update hobby                  |
| /api/hobbies/\<id\>/             | DELETE | Delete hobby                  |
| /api/friendships/                | GET    | List all friendships          |
| /api/friendships/                | POST   | Create a new friendship       |
| /api/friendships/\<id\>/         | GET    | Get friendship by id          |
| /api/friendships/\<id\>/         | PUT    | Update friendship             |
| /api/friendships/\<id\>/         | DELETE | Delete friendship             |
| /api/friendship_hobbies/         | GET    | List all friendship hobbies   |
| /api/friendship_hobbies/         | POST   | Create a new friendship hobby |
| /api/friendship_hobbies/\<id\>/  | GET    | Get friendship hobby by id    |
| /api/friendship_hobbies/\<id\>/  | PUT    | Update friendship hobby       |
| /api/friendship_hobbies/\<id\>/  | DELETE | Delete friendship hobby       |
| /api/ponies/\<id\>/hobbies/      | POST   | Assign hobby to pony          |
| /api/friendships/\<id\>/hobbies/ | POST   | Assign hobby to friendship    |
| /api/pony_friendships/           | GET    | List all pony-friendship links|
| /api/pony_friendships/           | POST   | Add pony to a friendship      |
| /api/pony_friendships/\<id\>/    | DELETE | Remove pony from friendship   |
<!-- markdownlint-enable MD033 -->

## Linting & Formatting

**Linting and formatting are enforced for all code.**

### Directory Structure & Placement

All linting and formatting config files at the **project root**:

- `.editorconfig`
- `package.json`
- `.prettierrc`
- `eslint.config.js`
- `pyproject.toml`

### Config Files to Create

All at the project root:

- `.editorconfig` — Basic code style (indentation, line endings, charset)
- `.prettierrc` — Prettier formatting rules (JS/TS/React, JSON, Markdown,
  YAML)
- `eslint.config.js` — ESLint flat config (JS/TS/React), scoped to
  `src_front/src`
- `pyproject.toml` — ruff config (Python)

### Required Packages

All frontend and tooling deps in the single root `package.json`:

```sh
npm install react react-dom react-router-dom axios formik yup \
  @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install --save-dev vite @vitejs/plugin-react typescript \
  @types/react @types/react-dom eslint prettier husky \
  eslint-plugin-react-hooks eslint-plugin-react-refresh \
  typescript-eslint
```

**Backend (in `src_back/`):**

```sh
pip install ruff
```

### Example Scripts (package.json)

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint src_front/src",
  "format": "prettier --write src_front/src",
  "lint:py": "ruff check src_back",
  "format:py": "ruff format src_back",
  "prepare": "husky install"
}
```

### Husky Setup

In the repository root:

1. Run `npx husky install`

2. Add a pre-commit hook:

  ```sh
  #!/bin/sh
  . "$(dirname "$0")/_/husky.sh"

  npm run lint
  npm run format
  ruff check src_back
  ruff format src_back
  ```

### Enforcement

- All lint/format scripts must pass before commit (husky pre-commit hook)
- Integrate lint/format checks in CI (e.g., GitHub Actions)
- Recommend VS Code extensions for auto-format on save

### Rules (All Code)

- No lines >90 chars
- Use single quotes for strings unless escaping is required
- No linting errors allowed (ESLint, ruff)

---

This plan provides a step-by-step, dependency-ordered path from an empty
repo to a working, tested, and locally runnable full-stack pony tracker.
