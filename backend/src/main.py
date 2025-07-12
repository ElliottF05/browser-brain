from fastapi import FastAPI
import uvicorn

from fast_api.routes import router

# create the global fastapi app and include the router
app = FastAPI()
app.include_router(router)

# run the app with uvicorn
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
