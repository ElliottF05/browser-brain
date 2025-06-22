from fastapi import APIRouter

from api.models import PageUpload

# create the router that will expose all api endpoints
router = APIRouter()

# basic health test
@router.get("/")
async def root():
    return {"message": "Welcome to Browser Brain's backend!"}

# endpoint to upload a page
@router.post("/pages/upload")
async def upload_page(page: PageUpload):
    return {"message": "Page uploaded successfully!"}
