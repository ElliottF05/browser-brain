from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import uuid
import time

import ai.services
import aws.services
import qdrant.services
from fast_api.models import Chunk, PageUpload

# service to orchestrate the entire process of handing an uploaded page
def process_uploaded_page(page: PageUpload):

    # chunk the content into manageable pieces
    _start_time = time.time()
    token_lists, str_chunks = ai.services.chunk_text(page.content)
    _elapsed_time = time.time() - _start_time
    print(f"chunk_text took {_elapsed_time:.4f} seconds")

    # subroutine to process each chunk
    # this is used to parallelize the network io processing of chunks
    def process_chunk(tokens: list[int], text: str):
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
        qdrant.services.upload_chunk(chunk)


    with ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(process_chunk, tokens, text) for tokens, text in zip(token_lists, str_chunks)
        ]
        for future in as_completed(futures):
            future.result()  # raises exceptions if any

    print(f"Successfully processed page ({len(futures)} chunks)")

