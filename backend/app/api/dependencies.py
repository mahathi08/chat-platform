from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.orm import Session

from app.db.session import SessionLocal

from app.services.auth_service import get_user_by_id

from app.core.security import decode_token

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


def get_current_user(

    token: str = Depends(oauth2_scheme),

    db: Session = Depends(get_db),

):

    payload = decode_token(token)

    if payload is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )

    user_id = payload.get("sub")

    if user_id is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )

    user = get_user_by_id(
        db,
        int(user_id)
    )

    if user is None:

        raise HTTPException(
            status_code=401,
            detail="User not found",
        )

    return user