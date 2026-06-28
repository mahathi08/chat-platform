from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from app.api.dependencies import get_current_user

from app.models.user import User
from sqlalchemy.orm import Session

from app.schemas.user import (
    UserCreate,
    UserResponse,
)

from app.schemas.auth import (
    LoginRequest,
    Token,
)

from app.services.auth_service import *

from app.api.dependencies import get_db

from app.core.security import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
):

    existing = get_user_by_email(
        db,
        user.email
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    return create_user(
        db,
        user.username,
        user.email,
        user.password
    )


@router.post(
    "/login",
    response_model=Token
)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
):

    user = authenticate_user(
        db,
        data.email,
        data.password
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {
            "sub": str(user.id)
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get(
    "/me",
    response_model=UserResponse
)
def me(

    current_user: User = Depends(
        get_current_user
    ),

):

    return current_user