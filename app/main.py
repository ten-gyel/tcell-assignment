from fastapi import FastAPI

from app.api import audit, auth, tasks, users
from app.db.session import Base, engine
from app.models import audit_log, task, user  # noqa: F401

app = FastAPI(title="Task Management API")

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(tasks.router)
app.include_router(audit.router)


@app.get("/")
def health() -> dict[str, str]:
    return {"status": "ok"}
