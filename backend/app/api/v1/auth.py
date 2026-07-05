from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.database import get_db

from app.models.user import User

from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest,
)

from app.schemas.user import (
    UserCreate,
    UserResponse,
    ChangePasswordRequest,
)

from app.services.auth_service import (
    register_user,
    login_user,
    refresh_access_token,
    change_password,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

@router.post(
    "/token",
    response_model=TokenResponse,
)
def oauth_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    credentials = LoginRequest(
        email=form_data.username,
        password=form_data.password,
    )

    return login_user(
        db,
        credentials,
    )

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    return register_user(
        db,
        user,
    )


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    credentials: LoginRequest,
    db: Session = Depends(get_db),
):
    return login_user(
        db,
        credentials,
    )


@router.post(
    "/refresh",
    response_model=TokenResponse,
)
def refresh_token(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    return refresh_access_token(
        db,
        request,
    )


@router.post(
    "/change-password",
    status_code=status.HTTP_200_OK,
)
def update_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return change_password(
        db,
        current_user,
        request,
    )


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user