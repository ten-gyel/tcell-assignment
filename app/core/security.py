from datetime import datetime, timedelta, timezone
from enum import Enum

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class Role(str, Enum):
    admin = "Admin"
    manager = "Manager"
    member = "Member"
    viewer = "Viewer"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(subject: str, expires_minutes: int | None = None) -> str:
    expiry = datetime.now(timezone.utc) + timedelta(
        minutes=expires_minutes or settings.access_token_expire_minutes
    )
    payload = {"sub": subject, "exp": expiry}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email = payload.get("sub")
        if not email:
            raise credentials_exception
    except JWTError as exc:
        raise credentials_exception from exc

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise credentials_exception
    return user


def require_roles(*roles: Role):
    def dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in [role.value for role in roles]:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user

    return dependency
