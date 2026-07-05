from datetime import datetime

from fastapi import (
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.schemas.notification import NotificationListResponse


def get_notification(
    db: Session,
    notification_id: int,
) -> Notification:

    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
        )
        .first()
    )

    if notification is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found.",
        )

    return notification


def create_notification(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    notification_type,
) -> Notification:

    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        notification_type=notification_type,
    )

    db.add(notification)

    db.commit()

    db.refresh(notification)

    return notification


def get_notifications(
    db: Session,
    user_id: int,
    page: int = 1,
    page_size: int = 20,
) -> NotificationListResponse:

    notifications = (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
        )
        .order_by(
            Notification.created_at.desc(),
        )
        .offset(
            (page - 1) * page_size,
        )
        .limit(
            page_size,
        )
        .all()
    )

    return NotificationListResponse(
        notifications=notifications,
    )


def mark_as_read(
    db: Session,
    notification_id: int,
    user_id: int,
) -> Notification:

    notification = get_notification(
        db,
        notification_id,
    )

    if notification.user_id != user_id:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied.",
        )

    notification.is_read = True
    notification.read_at = datetime.utcnow()

    db.commit()

    db.refresh(notification)

    return notification


def mark_all_as_read(
    db: Session,
    user_id: int,
):

    (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read.is_(False),
        )
        .update(
            {
                Notification.is_read: True,
                Notification.read_at: datetime.utcnow(),
            },
            synchronize_session=False,
        )
    )

    db.commit()

    return {
        "message": "All notifications marked as read."
    }


def delete_notification(
    db: Session,
    notification_id: int,
    user_id: int,
):

    notification = get_notification(
        db,
        notification_id,
    )

    if notification.user_id != user_id:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied.",
        )

    db.delete(notification)

    db.commit()

    return {
        "message": "Notification deleted successfully."
    }


def get_unread_count(
    db: Session,
    user_id: int,
) -> int:

    return (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read.is_(False),
        )
        .count()
    )