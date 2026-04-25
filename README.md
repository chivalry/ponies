# Ponies

Full-stack pony tracker: React + TypeScript frontend,
Flask + PostgreSQL backend.

## Local development (Docker)

```sh
docker-compose up --build
```

Open <http://localhost:5173>. The frontend proxies `/api` and `/uploads` to the
Flask backend on port 5000.

## Local development (without Docker)

### Backend

```sh
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
flask db upgrade
flask run
```

### Frontend

```sh
npm install
npm run dev
```

## Environment variables

Copy `.env` and set these before running in any non-development environment:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | Flask secret key (required outside `FLASK_ENV=development`) |
| `UPLOAD_FOLDER` | Path for uploaded images (default: `src_back/uploads`) |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed CORS origins (default: `*`) |

## Tests

```sh
pytest                  # backend
npm test -- --run       # frontend
```
