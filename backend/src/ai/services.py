from openai import OpenAI
import tiktoken

from config.config import settings

client = OpenAI(api_key=settings.openai_api_key)

# helper to chunk text content into smaller pieces for embedding
# input: list of strings (one string per html element)
# output: tuple containing list of tokenized chunks and list of original strings
def chunk_text(content: list[str], chunk_size: int = 8191) -> tuple[list[list[int]], list[str]]:

    encoding = tiktoken.encoding_for_model("text-embedding-3-small")
    tokens = [
        encoding.encode(element, disallowed_special=()) 
        for element in content if element.strip()
        ] # dont include empty strings

    chunks: list[list[int]] = []
    current_chunk: list[int] = []
    current_length = 0

    strings: list[str] = []
    current_string: list[str] = []

    # build chunks of size <= chunk_size
    for element, tokenized in zip(content, tokens):
        if current_length + len(tokenized) > chunk_size:
            chunks.append(current_chunk)
            current_chunk = []
            current_length = 0

            strings.append("".join(current_string))
            current_string = []
        
        if len(tokenized) > chunk_size:
            print("ERROR: Element exceeds chunk size limit, skipping element.")
            continue

        current_chunk.extend(tokenized)
        current_length += len(tokenized)
        current_string.append(element)

    if current_chunk:
        chunks.append(current_chunk)
        strings.append("".join(current_string))
    return chunks, strings


def get_chunk_embedding(tokens: list[int]) -> list[float]:
    response = client.embeddings.create(
        input=tokens,
        model="text-embedding-3-small",
    )
    
    return response.data[0].embedding