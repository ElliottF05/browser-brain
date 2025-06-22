from fastapi import APIRouter, BackgroundTasks

from fast_api.models import PageUpload
from fast_api.services import process_uploaded_page

# create the router that will expose all api endpoints
router = APIRouter()

# basic health test
@router.get("/")
async def root():
    return {"message": "Welcome to Browser Brain's backend!"}

# endpoint to upload a page
@router.post("/pages/upload")
def upload_page(page: PageUpload):
    process_uploaded_page(page)
    return {"message": "Page received successfully."}
