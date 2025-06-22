from fastapi import FastAPI
import uvicorn

from api.routes import get_router

# create and set up the global fastapi app instance
def create_app() -> FastAPI:
    app = FastAPI()
    app.include_router(get_router())

    return app
app = create_app()

# run the app with uvicorn
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
