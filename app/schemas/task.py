from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class TaskStatus(str, Enum):
    todo = "Todo"
    doing = "Doing"
    done = "Done"


class TaskBase(BaseModel):
    title: str
    description: str | None = None
    assignee_id: int | None = None


class TaskCreate(TaskBase):
    status: TaskStatus = TaskStatus.todo


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: TaskStatus | None = None
    assignee_id: int | None = None


class TaskOut(BaseModel):
    id: int
    title: str
    description: str | None
    status: TaskStatus
    assignee_id: int | None
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True
