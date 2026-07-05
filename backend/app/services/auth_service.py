from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from fastapi import HTTPException, status

from app.models.user import User

from app.schemas.user import (
    UserCreate,
)

from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest,
    ChangePasswordRequest,
)

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_refresh_token,
)

def get_user_by_email(
    db: Session,
    email: str,
) -> User | None:

    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


def get_user_by_username(
    db: Session,
    username: str,
) -> User | None:

    return (
        db.query(User)
        .filter(User.username == username)
        .first()
    )


def get_user_by_id(
    db: Session,
    user_id: int,
) -> User | None:

    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

def register_user(
    db: Session,
    data: UserCreate,
) -> User:

    if get_user_by_email(db, data.email):

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered.",
        )

    if get_user_by_username(db, data.username):

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken.",
        )

    user = User(
        username=data.username,
        email=data.email,
        password_hash=hash_password(
            data.password
        ),
    )

    try:

        db.add(user)

        db.commit()

        db.refresh(user)

        return user

    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Unable to create user.",
        )

def login_user(
    db: Session,
    data: LoginRequest,
) -> TokenResponse:

    user = get_user_by_email(
        db,
        data.email,
    )

    if user is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not verify_password(
        data.password,
        user.password_hash,
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    access_token = create_access_token(
        subject=user.id,
    )

    refresh_token = create_refresh_token(
        subject=user.id,
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )

def refresh_access_token(
    db: Session,
    data: RefreshTokenRequest,
) -> TokenResponse:

    try:

        payload = verify_refresh_token(
            data.refresh_token,
        )

        user_id = int(
            payload["sub"]
        )

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token.",
        )

    user = get_user_by_id(
        db,
        user_id,
    )

    if user is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
        )

    access_token = create_access_token(
        subject=user.id,
    )

    refresh_token = create_refresh_token(
        subject=user.id,
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )

def change_password(
    db: Session,
    current_user: User,
    data: ChangePasswordRequest,
):

    if not verify_password(
        data.current_password,
        current_user.password_hash,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect.",
        )

    current_user.password_hash = hash_password(
        data.new_password,
    )

    db.commit()

    db.refresh(current_user)

    return {
        "message": "Password updated successfully."
    }

