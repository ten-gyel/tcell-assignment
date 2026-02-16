from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr


RoleLiteral = Literal["Admin", "Manager", "Member", "Viewer"]


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str
    role: RoleLiteral = "Member"


class UserRoleUpdate(BaseModel):
    role: RoleLiteral


class UserOut(UserBase):
    id: int
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
