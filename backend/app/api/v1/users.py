from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.database import get_db

from app.models.user import User

from app.schemas.user import (
    UserResponse,
    UserUpdate,
    UserProfile,
    UserStatusUpdate,
    UserListResponse,
)

from app.services.user_service import (
    get_user_profile,
    update_user_profile,
    update_user_status,
    search_users,
    delete_account,
)

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(get_current_user),
):
    """
    Return current authenticated user.
    """
    return current_user


@router.get(
    "/{user_id}",
    response_model=UserProfile,
)
def get_profile(
    user_id: int,
    db: Session = Depends(get_db),
):
    """
    Get public profile.
    """
    return get_user_profile(
        db,
        user_id,
    )


@router.put(
    "/me",
    response_model=UserResponse,
)
def update_profile(
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update profile.
    """
    return update_user_profile(
        db,
        current_user.id,
        data,
    )


@router.patch(
    "/me/status",
    response_model=UserResponse,
)
def update_status(
    data: UserStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update status.
    """
    return update_user_status(
        db,
        current_user.id,
        data,
    )


@router.get(
    "/",
    response_model=UserListResponse,
)
def search(
    username: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
):
    """
    Search users.
    """
    return search_users(
        db,
        username,
    )


@router.delete(
    "/me",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete account.
    """
    delete_account(
        db,
        current_user.id,
    )

    return None