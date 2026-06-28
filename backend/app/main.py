from fastapi import FastAPI

app = FastAPI(
    title="Chat Platform API"
)


@app.get("/")
def root():
    return {
        "status": "running"
    }