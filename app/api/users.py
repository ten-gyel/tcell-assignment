from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import Role, get_current_user, require_roles
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserOut

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)) -> UserOut:
    return current_user


@router.get("", response_model=list[UserOut])
def list_users(
    _: User = Depends(require_roles(Role.admin)),
    db: Session = Depends(get_db),
) -> list[UserOut]:
    return db.query(User).all()
