from datetime import datetime, timezone
import uuid
import ai
import ai.services
import aws
import aws.services
from fast_api.models import Chunk, PageUpload
import time

# service to orchestrate the entire process of handing an uploaded page
def process_uploaded_page(page: PageUpload):

    # chunk the content into manageable pieces
    _start_time = time.time()
    token_lists, str_chunks = ai.services.chunk_text(page.content)
    _elapsed_time = time.time() - _start_time
    print(f"chunk_text took {_elapsed_time:.4f} seconds")

    # iterate over the token lists and corresponding text chunks
    for tokens, text in zip(token_lists, str_chunks):

        # get the embedding
        embedding = ai.services.get_chunk_embedding(tokens)

        # create a chunk object
        chunk = Chunk(
            content=text,
            embedding=embedding,
            chunk_id=str(uuid.uuid4()),
            user_id=page.user_id,
            timestamp=datetime.now(timezone.utc),
        )

        # upload to s3
        aws.services.upload_chunk(chunk)

        # upload to qdrant


