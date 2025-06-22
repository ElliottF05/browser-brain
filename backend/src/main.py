# must import config before importing any other modules
from config.config import settings

from fastapi import FastAPI
import uvicorn

from fast_api.routes import router

# create the global fastapi app
app = FastAPI()

# include the api router in the app
app.include_router(router)

# run the app with uvicorn
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
