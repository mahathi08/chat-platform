from fastapi import Depends

from app.api.dependencies.server import get_server_member


def require_channel_access(
    member=Depends(get_server_member),
):
    return member