from datetime import datetime

from pydantic import BaseModel


class TaskBase(BaseModel):
    title: str
    description: str | None = None
    assignee_id: int | None = None


class TaskCreate(TaskBase):
    status: str = "Todo"


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None
    assignee_id: int | None = None


class TaskOut(BaseModel):
    id: int
    title: str
    description: str | None
    status: str
    assignee_id: int | None
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True
