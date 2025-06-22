from fastapi import APIRouter

from api.models import PageUpload

# add routes to the global fastpi app
def get_router() -> APIRouter:

    router = APIRouter()

    @router.get("/")
    async def root():
        return {"message": "Welcome to Browser Brain's backend!"}
    
    @router.post("/pages/upload")
    async def upload_page(page: PageUpload):
        return {"message": "Page uploaded successfully!"}


    return router