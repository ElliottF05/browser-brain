from qdrant_client import QdrantClient, models

from fast_api.models import Chunk
from qdrant.qdrant_manager import qdrant_client, initialize_qdrant_client

'''
qdrant client setup:

docker run -p 6333:6333 -p 6334:6334 \
    -v "$(pwd)/qdrant_storage:/qdrant/storage:z" \
    qdrant/qdrant

PUT collections/chunks 
{
    "vectors": {
        "size": 1536,
        "distance": "Cosine"
    }
}

PUT collections/chunks/index 
{
    "field_name": "timestamp",
    "field_schema": "datetime"
}
'''

# initialize the qdrant client before any service functions are called
initialize_qdrant_client()

def upload_chunk(chunk: Chunk):
    qdrant_client.upsert(
        collection_name="chunks",
        points=[
            models.PointStruct(
                id=chunk.chunk_id,
                vector=chunk.embedding,
                payload={
                    "content": chunk.content,
                    "url": chunk.url,
                    "timestamp": chunk.timestamp.isoformat()
                },
            )
        ],
    )

# returns a tuple of (chunk_contents, url's, timestamps)
def query_chunks(embedding: list[float], limit: int = 10) -> tuple[list[str], list[str], list[str]]:
    search_result = qdrant_client.search(
        collection_name="chunks",
        query_vector=embedding,
        limit=limit,
        score_threshold=0.0, # TODO: look into this
    )

    chunk_contents = [point.payload["content"] if point.payload else "No content available" for point in search_result]
    chunk_urls = [point.payload["url"] if point.payload else "No URL available" for point in search_result]
    chunk_timestamps = [point.payload["timestamp"] if point.payload else "No timestamp available" for point in search_result]
    return chunk_contents, chunk_urls, chunk_timestamps