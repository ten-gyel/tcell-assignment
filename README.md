# FastAPI + Next.js Task Management

This repository now contains:

- **Backend**: FastAPI API with JWT auth, RBAC, tasks, and audit logging (`app/`)
- **Frontend**: Next.js 14 + Tailwind dashboard UI (`frontend/`)

## Backend quick start

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Frontend quick start

```bash
cd frontend
npm install
npm run dev
```

Frontend expects backend API at `http://localhost:8000` by default. Override with:

```bash
NEXT_PUBLIC_API_URL=http://your-api-host:8000
```

## Docker setup (containerized deployment)

Build and run both services with Docker Compose:

```bash
docker compose up --build
```

After startup:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

To stop and remove containers:

```bash
docker compose down
```

The SQLite database file is mounted from `./app.db` into the backend container so data persists across restarts.

## Frontend routes

- `/login`
- `/dashboard`
- `/tasks`
- `/users` (Admin only)
- `/audit` (Admin only)
