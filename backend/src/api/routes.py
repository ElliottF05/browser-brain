from fastapi import APIRouter, BackgroundTasks

from api.models import PageUpload
from ai.services import embed_uploaded_page

# create the router that will expose all api endpoints
router = APIRouter()

# basic health test
@router.get("/")
async def root():
    return {"message": "Welcome to Browser Brain's backend!"}

# endpoint to upload a page
@router.post("/pages/upload")
async def upload_page(page: PageUpload, background_tasks: BackgroundTasks):
    # run the embedding task in the background
    background_tasks.add_task(embed_uploaded_page, page.content)
    return {"message": "Page received successfully."}
