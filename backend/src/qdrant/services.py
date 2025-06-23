from qdrant_client import QdrantClient, models

from fast_api.models import Chunk
from config.config import settings

# Qdrant client setup:
    # PUT collections/chunks 
    # {
    #     "vectors": {
    #       "size": 1536,
    #       "distance": "Cosine"
    #     }
    # }

    # PUT collections/chunks/index 
    # {
    #   "field_name": "user_id",
    #   "field_schema": "uuid"
    # }

    # PUT collections/chunks/index 
    # {
    #   "field_name": "timestamp",
    #   "field_schema": "datetime"
    # }

qdrant_client = QdrantClient(
    url=settings.qdrant_url,
    api_key=settings.qdrant_api_key,
)

def upload_chunk(chunk: Chunk):
    qdrant_client.upsert(
        collection_name="chunks",
        points=[
            models.PointStruct(
                id=chunk.chunk_id,
                vector=chunk.embedding,
                payload={
                    "content": chunk.content,
                    "user_id": chunk.user_id,
                    "timestamp": chunk.timestamp.isoformat(timespec="minutes").replace("+00:00", "Z")
                },
            )
        ],
    )