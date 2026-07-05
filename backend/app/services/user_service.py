from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.enums import UserStatus

from app.models.user import User
from app.schemas.user import (
    UserUpdate,
    UserStatusUpdate,
    UserListResponse,
)

def get_user(
    db: Session,
    user_id: int,
) -> User:

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    return user


def get_user_by_username(
    db: Session,
    username: str,
) -> User | None:

    return (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

def get_user_profile(
    db: Session,
    user_id: int,
) -> User:

    return get_user(
        db,
        user_id,
    )

def update_user_profile(
    db: Session,
    user_id: int,
    data: UserUpdate,
) -> User:

    user = get_user(
        db,
        user_id,
    )

    if (
        data.username
        and data.username != user.username
    ):

        existing = get_user_by_username(
            db,
            data.username,
        )

        if existing:

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username already exists.",
            )

        user.username = data.username

    if data.bio is not None:

        user.bio = data.bio

    if data.avatar_url is not None:

        user.avatar_url = data.avatar_url

    db.commit()

    db.refresh(user)

    return user

def update_user_status(
    db: Session,
    user_id: int,
    data: UserStatusUpdate,
) -> User:

    user = get_user(
        db,
        user_id,
    )

    user.status = data.status

    user.last_seen = datetime.now(datetime.UTC).replace(tzinfo=None)

    db.commit()

    db.refresh(user)

    return user

def search_users(
    db: Session,
    username: str,
) -> UserListResponse:

    users = (
        db.query(User)
        .filter(
            User.username.ilike(
                f"%{username}%"
            )
        )
        .order_by(User.username.asc())
        .all()
    )

    return UserListResponse(
        users=users,
    )

def delete_account(
    db: Session,
    user_id: int,
) -> None:

    user = get_user(
        db,
        user_id,
    )

    db.delete(user)

    db.commit()

def update_last_seen(
    db: Session,
    user_id: int,
) -> User:

    user = get_user(
        db,
        user_id,
    )

    user.last_seen = datetime.now(datetime.UTC).replace(tzinfo=None)

    db.commit()

    db.refresh(user)

    return user


def set_user_online(
    db: Session,
    user_id: int,
) -> User:

    user = get_user(
        db,
        user_id,
    )

    user.status = UserStatus.ONLINE

    db.commit()

    db.refresh(user)

    return user


def set_user_offline(
    db: Session,
    user_id: int,
) -> User:

    user = get_user(
        db,
        user_id,
    )

    user.status = UserStatus.ONLINE

    user.last_seen = atetime.now(datetime.UTC).replace(tzinfo=None)

    db.commit()

    db.refresh(user)

    return user


