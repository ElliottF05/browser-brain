from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import StreamingResponse

from fast_api.models import PageUpload, Query
from fast_api.services import process_query_streaming, process_uploaded_page

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
@router.post("/chat/query/stream")
def query_llm_streaming(query: Query):
    return StreamingResponse(
        process_query_streaming(query),
        media_type="text/event-stream",
    )