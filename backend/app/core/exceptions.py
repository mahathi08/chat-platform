from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse


class AppException(Exception):
    """
    Base application exception.
    """

    def __init__(
        self,
        detail: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
    ):
        self.detail = detail
        self.status_code = status_code


class AuthenticationException(AppException):
    def __init__(self, detail: str = "Authentication failed"):
        super().__init__(
            detail,
            status.HTTP_401_UNAUTHORIZED,
        )


class AuthorizationException(AppException):
    def __init__(self, detail: str = "Permission denied"):
        super().__init__(
            detail,
            status.HTTP_403_FORBIDDEN,
        )


class NotFoundException(AppException):
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(
            detail,
            status.HTTP_404_NOT_FOUND,
        )


class ConflictException(AppException):
    def __init__(self, detail: str = "Resource already exists"):
        super().__init__(
            detail,
            status.HTTP_409_CONFLICT,
        )


class ValidationException(AppException):
    def __init__(self, detail: str = "Validation failed"):
        super().__init__(
            detail,
            status.HTTP_422_UNPROCESSABLE_ENTITY,
        )


async def app_exception_handler(
    request: Request,
    exc: AppException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "detail": exc.detail,
        },
    )


async def http_exception_handler(
    request: Request,
    exc: HTTPException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "detail": exc.detail,
        },
    )


async def generic_exception_handler(
    request: Request,
    exc: Exception,
):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "detail": "Internal Server Error",
        },
    )


def register_exception_handlers(app: FastAPI):
    app.add_exception_handler(
        AppException,
        app_exception_handler,
    )

    app.add_exception_handler(
        HTTPException,
        http_exception_handler,
    )

    app.add_exception_handler(
        Exception,
        generic_exception_handler,
    )