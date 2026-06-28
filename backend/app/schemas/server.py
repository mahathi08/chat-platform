from pydantic import BaseModel


class ServerCreate(BaseModel):
    name: str


class ServerResponse(BaseModel):

    id: int

    name: str

    owner_id: int

    class Config:
        from_attributes = True