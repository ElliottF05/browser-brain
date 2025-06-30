from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import uuid
import time

import ai.services
import aws.services
import qdrant.services
import supabase_db.services
from fast_api.models import Chunk, PageUpload, Query

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
        embedding = ai.services.get_chunk_embedding_from_tokens(tokens)

        # create a chunk object
        chunk = Chunk(
            content=text,
            embedding=embedding,
            chunk_id=str(uuid.uuid4()),
            url=page.url,
            user_id=page.user_id,
            timestamp=datetime.now(timezone.utc),
        )

        # upload to s3
        aws.services.upload_chunk(chunk)

        # upload to supabase
        supabase_db.services.upload_chunk(chunk)

        # upload to qdrant
        qdrant.services.upload_chunk(chunk)


    with ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(process_chunk, tokens, text) for tokens, text in zip(token_lists, str_chunks)
        ]
        for future in as_completed(futures):
            future.result()  # raises exceptions if any

    print(f"Successfully processed page ({len(futures)} chunks)")

def process_query_streaming(query: Query):
    # upload the user message to supabase
    supabase_db.services.upload_message(query.content, query.user_id, "user")

    # get the embedding for the query
    embedding = ai.services.get_chunk_embedding_from_str(query.content)

    # query qdrant for similar chunks
    chunk_ids, chunk_urls = qdrant.services.query_chunks(embedding, query.user_id)

    # download the chunks from s3
    chunk_contents = aws.services.download_chunks_parallel(chunk_ids)

    # use chunks as context for the query
    llm_response_iter = ai.services.query_llm_streaming(query.content, chunk_contents, chunk_urls)

    # use a generator to stream the response
    response_parts = []
    for packet in llm_response_iter:
        response_parts.append(packet)
        yield packet
    
    # upload the full response to supabase
    full_response = "".join(response_parts)
    supabase_db.services.upload_message(full_response, query.user_id, "assistant")

    print(f"Streaming LLM response. Used {len(chunk_contents)} results")

