# Task Management System (FastAPI + Next.js)

This project is a full-stack task management application built with:

- **Backend:** FastAPI + SQLAlchemy + JWT authentication
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Database:** SQLite (`app.db`)
- **Containerization:** Dockerfiles for backend/frontend + Docker Compose

---

## 1) Prerequisites

Choose one of these approaches:

### Local development
- Python **3.11+**
- Node.js **20+**
- npm

### Containerized development/run
- Docker
- Docker Compose (v2)

---

## 2) Project setup (local)

### Backend setup
From repository root:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will run at:
- `http://localhost:8000`

Health check:
- `GET /` returns `{"status": "ok"}`

### Frontend setup
In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:
- `http://localhost:3000`

---

## 3) Environment variables

### Backend
The backend currently uses default settings from `app/core/config.py`.

Defaults include:
- `secret_key`: `change-me-in-production`
- `algorithm`: `HS256`
- `access_token_expire_minutes`: `60`
- `database_url`: `sqlite:///./app.db`

> Note: for production, update secret handling and database configuration.

### Frontend
The frontend API base URL is:

```bash
NEXT_PUBLIC_API_URL
```

If not set, it defaults to:

```text
http://localhost:8000
```

Example when running locally:

```bash
cd frontend
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

---

## 4) Run with Docker Compose

From repository root:

```bash
docker compose up --build
```

Services:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

The compose file mounts the SQLite database file so data persists between container restarts:
- Host: `./app.db`
- Container: `/app/app.db`

Stop services:

```bash
docker compose down
```

---

## 5) Authentication and basic usage

### Register a user
Use the backend API route:

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123","role":"Admin"}'
```

### Login
The UI login page is at:
- `http://localhost:3000/login`

Or via API:

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@example.com&password=admin123"
```

Use the returned JWT in `Authorization: Bearer <token>` for protected API calls.

---

## 6) Main frontend routes

- `/login`
- `/dashboard`
- `/tasks`
- `/users` (Admin only)
- `/audit` (Admin/Manager/Member)

---

## 7) Notes for evaluators

- Role-based access control is implemented on backend routes and mirrored in the frontend navigation/components.
- Audit logs are written for task create/update/delete actions.
- SQLite is used for simplicity in evaluation and local setup.
