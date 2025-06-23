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


def get_chunk_embedding_from_tokens(tokens: list[int]) -> list[float]:
    response = client.embeddings.create(
        input=tokens,
        model="text-embedding-3-small",
    )
    
    return response.data[0].embedding

def get_chunk_embedding_from_str(chunk: str) -> list[float]:
    response = client.embeddings.create(
        input=chunk,
        model="text-embedding-3-small",
    )
    
    return response.data[0].embedding

def query_llm(query: str, context: list[str]) -> str:
    context_block = "\n\n".join(context)

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a memory assistant that helps the user find and recall information "
                    "from their past web browsing history. You will be given relevant raw context extracted "
                    "from previously visited pages. Use this context to answer the user's question as accurately as possible."
                    "\n\n"
                    "If you don't find the answer in the provided context, you should respond: "
                    "“I couldn't find anything in your browsing history that directly answers your question.”"
                )
            },
            {
                "role": "user",
                "content": (
                    f"Here is your browsing history context:\n\n{context_block}\n\n"
                    f"Now answer the following question:\n{query}"
                )
            }
        ],
        max_tokens=1000,
    )

    if response.choices[0].message.content:
        return response.choices[0].message.content.strip()
    else:
        raise ValueError("No content in response from LLM")

