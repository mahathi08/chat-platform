from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ConversationCreate(BaseModel):
    user_id: int


class ConversationResponse(BaseModel):
    id: int

    user1_id: int
    user2_id: int

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ConversationListResponse(BaseModel):
    conversations: list[ConversationResponse]

    model_config = ConfigDict(from_attributes=True)