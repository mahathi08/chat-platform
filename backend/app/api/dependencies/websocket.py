from fastapi import (
    WebSocket,
    WebSocketException,
    status,
)

from jose import JWTError
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.user import User
from app.core.security import verify_access_token


async def authenticate_websocket(
    websocket: WebSocket,
) -> User:
    """
    Authenticate websocket using JWT.

    Client:

    ws://localhost:8000/ws?token=<access_token>
    """

    token = websocket.query_params.get("token")

    print("WS TOKEN:", token)

    if not token:

        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION,
            reason="Missing access token",
        )

    try:

        payload = verify_access_token(token)

        print("WS PAYLOAD:", payload)

        user_id = int(payload["sub"])

    except Exception as e:

        print("JWT ERROR:", repr(e))

        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION,
            reason="Invalid access token",
        )

    db: Session = SessionLocal()

    try:

        user = (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

        print("WS USER:", user)

        if user is None:

            raise WebSocketException(
                code=status.WS_1008_POLICY_VIOLATION,
                reason="User not found",
            )

        return user

    finally:

        db.close()