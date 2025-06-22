import boto3

from fast_api.models import Chunk
from config.config import settings

# global session
session = boto3.Session(
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_secret_access_key,
    region_name=settings.aws_region
)

def upload_chunk(chunk: Chunk):
    s3_client = session.client('s3')
    s3_client.put_object(
        Bucket=settings.aws_s3_bucket,
        Key=f"chunks/{chunk.chunk_id}",
        Body=chunk.content.encode('utf-8'),
    )