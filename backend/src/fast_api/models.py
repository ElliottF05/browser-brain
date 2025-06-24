from pydantic import BaseModel
from datetime import datetime

class PageUpload(BaseModel):
    url: str
    content: list[str]
    user_id: str

class Chunk(BaseModel):
    content: str
    embedding: list[float]
    chunk_id: str
    url: str
    user_id: str
    timestamp: datetime

class Query(BaseModel):
    content: str
    user_id: str