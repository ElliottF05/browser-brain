from typing import Iterable

from openai import OpenAI
from openai.types.chat import (
    ChatCompletionMessageParam, 
    ChatCompletionUserMessageParam, 
    ChatCompletionSystemMessageParam
)
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

            strings.append("\n".join(current_string))
            current_string = []
        
        if len(tokenized) > chunk_size:
            print("WARNING: Element exceeds chunk size limit, truncating.")
            tokenized = tokenized[:chunk_size]

        current_chunk.extend(tokenized)
        current_length += len(tokenized)
        current_string.append(element)

    if current_chunk:
        chunks.append(current_chunk)
        strings.append("\n".join(current_string))
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

def create_query_prompt_messages(context: list[str], query: str) -> Iterable[ChatCompletionMessageParam]:
    start_page_msg = "### START NEXT PAGE CONTENT \n\n ###"
    end_page_msg = "### \n\n END PREVIOUS PAGE CONTENT ###"
    separator = f"{end_page_msg}\n\n\n{start_page_msg}"
    context_block = start_page_msg + separator.join(context) + end_page_msg

    messages = [
        ChatCompletionSystemMessageParam(
            role="system",
            content=(
                "You are a memory assistant that helps the user find and recall information "
                    "from their past web browsing history. You will be given relevant raw context extracted "
                    "from previously visited pages. Use this context to answer the user's question as accurately as possible."
                    "\n\n"
                    "If you don't find the answer in the provided context, you should respond: "
                    "“I couldn't find anything in your browsing history that directly answers your question.”"
            )
        ),
        ChatCompletionUserMessageParam(
            role="user",
            content=(
                f"Here is your browsing history context:\n\n{context_block}\n\n"
                f"Now answer the following question:\n{query}"
            )
        )
    ]
    return messages

def query_llm(query: str, context: list[str], max_tokens: int = 500) -> str:
    messages = create_query_prompt_messages(context, query)
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=messages,
        max_tokens=max_tokens,
    )

    if response.choices[0].message.content:
        return response.choices[0].message.content.strip()
    else:
        raise ValueError("No content in response from LLM")
    
def query_llm_streaming(query: str, context: list[str], max_tokens: int = 500) -> Iterable[str]:
    messages = create_query_prompt_messages(context, query)
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=messages,
        max_tokens=max_tokens,
        stream=True,
    )

    for chunk in response:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content

def get_response(messages: Iterable[ChatCompletionMessageParam], max_tokens: int = 500) -> str:
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=messages,
        max_tokens=max_tokens,
    )

    if response.choices[0].message.content:
        return response.choices[0].message.content.strip()
    else:
        raise ValueError("No content in response from LLM")

def get_response_streaming(messages: Iterable[ChatCompletionMessageParam], max_tokens: int = 500) -> Iterable[str]:
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=messages,
        max_tokens=max_tokens,
        stream=True,
    )

    for chunk in response:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content
