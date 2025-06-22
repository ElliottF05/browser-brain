from pydantic import BaseModel

class PageUpload(BaseModel):
    url: str
    content: list[str]
    user_id: str