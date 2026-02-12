from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import Role, require_roles
from app.db.session import get_db
from app.models.audit_log import AuditLog
from app.models.user import User
from app.schemas.audit_log import AuditLogOut

router = APIRouter(prefix="/api/audit", tags=["audit"])


@router.get("", response_model=list[AuditLogOut])
def list_audit_logs(
    _: User = Depends(require_roles(Role.admin)),
    db: Session = Depends(get_db),
) -> list[AuditLogOut]:
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()
