from fastapi import FastAPI
import uvicorn

from api.routes import get_router

# create and set up the global fastapi app instance
def create_app() -> FastAPI:
    app = FastAPI()
    app.include_router(get_router())

    return app
app = create_app()

def main():
    # Run the FastAPI app
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

if __name__ == "__main__":
    main()
