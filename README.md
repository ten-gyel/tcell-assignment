# FastAPI Task Management API

A role-based task management backend using FastAPI, SQLAlchemy, and JWT authentication.

## Features
- JWT auth (`/api/auth/register`, `/api/auth/login`)
- Role-based authorization (Admin, Manager, Member, Viewer)
- Task CRUD with status transition checks
- Audit logging on task create/update/delete

## Run locally
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Default database is SQLite (`app.db`). Override in `app/core/config.py` if needed.
