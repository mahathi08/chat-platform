from fastapi import WebSocket, WebSocketException, status
from jose import JWTError
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import verify_access_token


async def authenticate_websocket(
    websocket: WebSocket,
) -> User:
    """
    Authenticate websocket using JWT.

    Client connects as:

    ws://localhost:8000/ws?token=<access_token>
    """

    token = websocket.query_params.get("token")

    if not token:
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION,
            reason="Missing access token",
        )

    try:
        payload = verify_access_token(token)

        user_id = int(payload["sub"])

    except (JWTError, KeyError, ValueError):
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

        if not user:

            raise WebSocketException(
                code=status.WS_1008_POLICY_VIOLATION,
                reason="User not found",
            )

        return user

    finally:

        db.close()