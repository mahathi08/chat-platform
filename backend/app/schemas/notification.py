from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import NotificationType


class NotificationResponse(BaseModel):
    id: int

    user_id: int

    title: str
    message: str

    notification_type: NotificationType

    is_read: bool

    created_at: datetime
    read_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


class NotificationUpdate(BaseModel):
    is_read: bool = True


class NotificationListResponse(BaseModel):
    notifications: list[NotificationResponse]

    model_config = ConfigDict(from_attributes=True)