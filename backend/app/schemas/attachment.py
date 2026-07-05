from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AttachmentUpload(BaseModel):
    file_name: str
    mime_type: str
    file_size: int


class AttachmentResponse(BaseModel):
    id: int

    message_id: int

    file_name: str

    file_url: str

    mime_type: str

    file_size: int

    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AttachmentListResponse(BaseModel):
    attachments: list[AttachmentResponse]

    model_config = ConfigDict(from_attributes=True)