from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.servers import router as server_router

app = FastAPI(
    title="Chat Platform API",
    version="1.0.0",
)

app.include_router(auth_router)
app.include_router(server_router)


@app.get("/")
def root():
    return {
        "message": "Chat Platform API",
        "status": "running",
    }