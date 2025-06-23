from fastapi import APIRouter, BackgroundTasks

from fast_api.models import PageUpload, Query
from fast_api.services import process_query, process_uploaded_page

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

# endpoint to query llm
@router.post("/chat/query")
def query_llm(query: Query):
    response = process_query(query)
    return {"response": response}