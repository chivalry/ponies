# Full-Stack Pony Tracker Implementation Plan

## Overview

This plan details the implementation of a full-stack web application for tracking ponies, their friendships, and hobbies. The stack includes:

- **Frontend:** TypeScript + React
- **Backend:** Python + Flask + SQLAlchemy
- **Database:** PostgreSQL
- **Containerization:** Docker
- **Testing:** Jest (frontend), pytest (backend)
- **Project Structure:**
  - `src_back/` (backend)
  - `src_front/` (frontend)
  - `docker/` (Docker configs)
  - `migrations/` (DB migrations)

- Create folders: `src_back/`, `src_front/`, `docker/`, `migrations/`
- Initialize Git, .gitignore, and README
- Set up Python virtual environment in `src_back/`
- Set up Node.js project in `src_front/`

## Implementation Order (Dependency-Driven)

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
- Create folders: `src_back/`, `src_front/`, `docker/`, `migrations/`
- Initialize Git, .gitignore, and README
- Set up Python virtual environment in `src_back/`
- Set up Node.js project in `src_front/`

## 2. Database Schema & Migrations

- Use Alembic for migrations
- Models:
  - **Ponies**: id (PK), name, image, curr_friend_id (FK), uuid, created_by, created_timestamp, modified_by, modified_timestamp
  - **Hobbies**: id (PK), name, pony_id (FK), uuid, created_by, created_timestamp, modified_by, modified_timestamp
  - **Friendships**: id (PK), key, uuid, created_by, created_timestamp, modified_by, modified_timestamp
  - **FriendshipHobbies**: id (PK), friendship_id (FK), hobby_id (FK), uuid, created_by, created_timestamp, modified_by, modified_timestamp

  Example Alembic migration snippet:

  ```python
  op.create_table(
    'ponies',
    sa.Column('id', sa.Integer, primary_key=True),
    sa.Column('name', sa.String(80), nullable=False),
    sa.Column('image', sa.String(255)),
    sa.Column('curr_friend_id', sa.Integer, sa.ForeignKey('ponies.id')),
    # ...housekeeping fields...
  )
  ```

## 3. Backend Models & API

- Use Flask, Flask-RESTful, SQLAlchemy, Marshmallow
- Implement models for each table
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
  - Assign hobbies to friendships: `/api/friendships/<id>/hobbies/` [POST]

  Example endpoint:

  ```python
  @app.route('/api/ponies/', methods=['GET'])
  def list_ponies():
      ponies = Pony.query.all()
      return jsonify([pony.to_dict() for pony in ponies])
  ```

## 4. Frontend Bootstrapping

- Use Create React App or Vite (TypeScript template)
- Install dependencies: React, React Router, Axios, Formik, Yup, Material UI
- Set up linting (ESLint, Prettier) with 90-character line limit
- Configure TypeScript strict mode

## 5. Dockerization

- Backend Dockerfile: Python, install dependencies, expose port 5000
- Frontend Dockerfile: Node, build static files, serve with nginx
- `docker-compose.yml`:
  - Services: db (Postgres), backend, frontend
  - Volumes for db persistence
  - Environment variables for secrets/config

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
  ```

## 6. Testing Setup

- Backend: pytest, pytest-flask, coverage
- Frontend: Jest, React Testing Library
- Add sample test files for each major module/component

## 7. Frontend Features

- Pony List & Profile pages
- Pony creation/edit form
- Hobby list and assignment UI
- Friendship list and creation UI
- Assign hobbies to friendships UI
- Use Axios for API calls

  Example PonyCard component:

  ```tsx
  export const PonyCard = ({ pony }) => (
    <Card>
      <img src={pony.image} alt={pony.name} />
      <h2>{pony.name}</h2>
      {/* ...hobbies, friends... */}
    </Card>
  )
  ```

## 8. Backend Features

- CRUD logic for all models
- Input validation (Marshmallow schemas)
- Error handling (404, 400, etc.)
- CORS setup for frontend-backend communication
- Authentication (optional, for created_by fields)

## 9. Integration & Finalization

- End-to-end test: create ponies, assign hobbies, create friendships
- Lint all code, ensure no lines >90 chars
- Build Docker images, run with docker-compose
- Deploy to free/cheap host (e.g., Render, Railway, Fly.io)

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
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── migrations/
├── docker/
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── README.md
└── plan.md
```

## Example API Endpoint Table

<!-- markdownlint-disable MD033 -->
| Endpoint                         | Method | Description                   |
|----------------------------------|--------|-------------------------------|
| /api/ponies/                     | GET    | List all ponies               |
| /api/ponies/                     | POST   | Create a new pony             |
| /api/ponies/<id>/                | GET    | Get pony by id                |
| /api/ponies/<id>/                | PUT    | Update pony                   |
| /api/ponies/<id>/                | DELETE | Delete pony                   |
| /api/hobbies/                    | GET    | List all hobbies              |
| /api/hobbies/                    | POST   | Create a new hobby            |
| /api/hobbies/<id>/               | GET    | Get hobby by id               |
| /api/hobbies/<id>/               | PUT    | Update hobby                  |
| /api/hobbies/<id>/               | DELETE | Delete hobby                  |
| /api/friendships/                | GET    | List all friendships          |
| /api/friendships/                | POST   | Create a new friendship       |
| /api/friendships/<id>/           | GET    | Get friendship by id          |
| /api/friendships/<id>/           | PUT    | Update friendship             |
| /api/friendships/<id>/           | DELETE | Delete friendship             |
| /api/friendship_hobbies/         | GET    | List all friendship hobbies   |
| /api/friendship_hobbies/         | POST   | Create a new friendship hobby |
| /api/friendship_hobbies/<id>/    | GET    | Get friendship hobby by id    |
| /api/friendship_hobbies/<id>/    | PUT    | Update friendship hobby       |
| /api/friendship_hobbies/<id>/    | DELETE | Delete friendship hobby       |
| /api/ponies/<id>/hobbies/        | POST   | Assign hobby to pony          |
| /api/friendships/<id>/hobbies/   | POST   | Assign hobby to friendship    |
<!-- markdownlint-enable MD033 MD060 -->

- All code must have no lines >90 chars
- Use single quotes for strings unless escaping is required
- No linting errors allowed (ESLint, Flake8, etc.)

## Linting & Formatting

- All code must have no lines >90 chars
- Use single quotes for strings unless escaping is required
- No linting errors allowed (ESLint, Flake8, etc.)
- All code must have no lines >90 chars
- Use single quotes for strings unless escaping is required
- No linting errors allowed (ESLint, Flake8, etc.)

## Deployment

- Build and push Docker images
- Use docker-compose for local dev
- Deploy to Render, Railway, or Fly.io (free/cheap tier)

---

This plan provides a step-by-step, dependency-ordered path from an empty repo to a working, tested, and deployable full-stack pony tracker app. Review and adjust as needed before implementation.
