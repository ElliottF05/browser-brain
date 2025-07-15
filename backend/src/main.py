from fastapi import FastAPI
import uvicorn
from contextlib import asynccontextmanager

from fast_api.routes import router
from qdrant.qdrant_manager import ensure_collections_exists, start_qdrant_server, stop_qdrant_server, initialize_qdrant_client
from setup import ensure_directories, ensure_chat_history


# define the lifetime events (startup and shutdown) for the fastapi app
@asynccontextmanager
async def lifespan(app: FastAPI):

    # startup
    ensure_directories()
    ensure_chat_history()
    start_qdrant_server()
    initialize_qdrant_client()
    ensure_collections_exists()

    yield

    # shutdown
    stop_qdrant_server()

# create the global fastapi app and include the router
app = FastAPI(lifespan=lifespan)
app.include_router(router)

# run the app with uvicorn
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
