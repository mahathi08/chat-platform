from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.servers import router as servers_router
from app.api.v1.channels import router as channels_router
from app.api.v1.messages import router as messages_router
from app.api.v1.dms import router as dms_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.invites import router as invites_router
from app.api.v1.attachments import router as attachments_router
from app.api.v1.websocket import router as websocket_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(servers_router)
api_router.include_router(channels_router)
api_router.include_router(messages_router)
api_router.include_router(dms_router)
api_router.include_router(notifications_router)
api_router.include_router(invites_router)
api_router.include_router(attachments_router)
api_router.include_router(websocket_router)