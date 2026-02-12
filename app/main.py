from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import audit, auth, tasks, users
from app.db.session import Base, engine
from app.models import audit_log, task, user  # noqa: F401

app = FastAPI(title="Task Management API")

# --- Create database tables ---
Base.metadata.create_all(bind=engine)

# --- CORS configuration ---
origins = [
    "http://localhost:3000",  # Next.js frontend
    "http://127.0.0.1:3000",
    # You can add more origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # For dev you could also use ["*"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include routers ---
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(tasks.router)
app.include_router(audit.router)

# --- Health check endpoint ---
@app.get("/")
def health() -> dict[str, str]:
    return {"status": "ok"}
