from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.audit_log import AuditLog
from app.models.user import User
from app.schemas.audit_log import AuditLogOut

router = APIRouter(prefix="/api/audit", tags=["audit"])


@router.get("", response_model=list[AuditLogOut])
def list_audit_logs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[AuditLogOut]:
    query = db.query(AuditLog).order_by(AuditLog.timestamp.desc())

    if current_user.role == "Admin":
        return query.all()
    if current_user.role in {"Manager", "Member"}:
        return query.filter(AuditLog.user_id == current_user.id).all()

    raise HTTPException(status_code=403, detail="Insufficient permissions")
