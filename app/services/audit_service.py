from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


def log_action(
    db: Session,
    user_id: int,
    action: str,
    entity: str,
    entity_id: int,
    old_data: dict | None,
    new_data: dict | None,
) -> AuditLog:
    log = AuditLog(
        user_id=user_id,
        action=action,
        entity=entity,
        entity_id=entity_id,
        old_data=old_data,
        new_data=new_data,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log
