from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import Role, get_current_user, require_roles
from app.db.session import get_db
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskOut, TaskUpdate
from app.services.audit_service import log_action
from app.services.task_service import create_task, delete_task, list_tasks, update_task

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskOut])
def get_tasks(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> list[TaskOut]:
    return list_tasks(db, current_user)


@router.post("", response_model=TaskOut)
def add_task(
    payload: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(Role.admin, Role.manager)),
) -> TaskOut:
    task = create_task(db, payload, current_user.id)
    log_action(
        db,
        user_id=current_user.id,
        action="CREATE",
        entity="Task",
        entity_id=task.id,
        old_data=None,
        new_data={
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "assignee_id": task.assignee_id,
        },
    )
    return task


@router.put("/{task_id}", response_model=TaskOut)
def edit_task(
    task_id: int,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TaskOut:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if current_user.role not in {"Admin", "Manager", "Member"}:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    old_data = {
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "assignee_id": task.assignee_id,
    }
    task = update_task(db, task, payload, current_user)
    new_data = {
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "assignee_id": task.assignee_id,
    }

    log_action(
        db,
        user_id=current_user.id,
        action="UPDATE",
        entity="Task",
        entity_id=task.id,
        old_data=old_data,
        new_data=new_data,
    )
    return task


@router.delete("/{task_id}")
def remove_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(Role.admin)),
) -> dict[str, str]:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    old_data = {
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "assignee_id": task.assignee_id,
    }
    delete_task(db, task)
    log_action(
        db,
        user_id=current_user.id,
        action="DELETE",
        entity="Task",
        entity_id=task_id,
        old_data=old_data,
        new_data=None,
    )
    return {"detail": "Task deleted"}
