from fastapi import FastAPI
import uvicorn
from contextlib import asynccontextmanager

from fast_api.routes import router
from qdrant.qdrant_manager import start_qdrant, stop_qdrant

# define the lifetime events (startup and shutdown) for the fastapi app
@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    start_qdrant()
    yield
    # shutdown
    stop_qdrant()

# create the global fastapi app and include the router
app = FastAPI(lifespan=lifespan)

app.include_router(router)


# run the app with uvicorn
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
