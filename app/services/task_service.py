from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskUpdate

VALID_MEMBER_TRANSITIONS = {
    "Todo": "Doing",
    "Doing": "Done",
}


def list_tasks(db: Session, user: User) -> list[Task]:
    if user.role in {"Admin", "Manager", "Viewer"}:
        return db.query(Task).all()
    return db.query(Task).filter(Task.assignee_id == user.id).all()


def create_task(db: Session, payload: TaskCreate, creator_id: int) -> Task:
    task = Task(
        title=payload.title,
        description=payload.description,
        status=payload.status,
        assignee_id=payload.assignee_id,
        created_by=creator_id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, task: Task, payload: TaskUpdate, actor: User) -> Task:
    update_data = payload.model_dump(exclude_unset=True)

    if actor.role == "Member":
        if task.assignee_id != actor.id:
            raise HTTPException(status_code=403, detail="Members can only update their own tasks")
        if "status" in update_data:
            next_status = VALID_MEMBER_TRANSITIONS.get(task.status)
            if update_data["status"] != next_status:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid status transition for member: {task.status} -> {update_data['status']}",
                )
        disallowed = set(update_data.keys()) - {"status"}
        if disallowed:
            raise HTTPException(status_code=403, detail="Members can only update task status")

    if actor.role == "Viewer":
        raise HTTPException(status_code=403, detail="Viewers cannot update tasks")

    for key, value in update_data.items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()
