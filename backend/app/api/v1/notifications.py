from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.database import get_db

from app.models.user import User

from app.schemas.notification import (
    NotificationResponse,
    NotificationListResponse,
)

from app.services.notification_service import (
    get_notifications,
    mark_as_read,
    mark_all_as_read,
    delete_notification,
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


@router.get(
    "/",
    response_model=NotificationListResponse,
)
def list_notifications(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get notifications of the authenticated user.
    """

    return get_notifications(
        db=db,
        user_id=current_user.id,
        page=page,
        page_size=page_size,
    )


@router.patch(
    "/{notification_id}/read",
    response_model=NotificationResponse,
)
def read_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Mark a notification as read.
    """

    return mark_as_read(
        db=db,
        notification_id=notification_id,
        user_id=current_user.id,
    )


@router.patch(
    "/read-all",
    status_code=status.HTTP_200_OK,
)
def read_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Mark all notifications as read.
    """

    return mark_all_as_read(
        db=db,
        user_id=current_user.id,
    )


@router.delete(
    "/{notification_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a notification.
    """

    delete_notification(
        db=db,
        notification_id=notification_id,
        user_id=current_user.id,
    )

    return None