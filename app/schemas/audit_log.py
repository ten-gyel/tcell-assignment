from datetime import datetime

from pydantic import BaseModel


class AuditLogOut(BaseModel):
    id: int
    user_id: int
    action: str
    entity: str
    entity_id: int
    old_data: dict | None
    new_data: dict | None
    timestamp: datetime

    class Config:
        from_attributes = True
