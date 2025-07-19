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
# input: string representing the content to be chunked
# output: tuple containing list of tokenized chunks and list of original strings
def chunk_text(content: str, chunk_size: int, overlap: int) -> tuple[list[list[int]], list[str]]:

    encoding = tiktoken.encoding_for_model("text-embedding-3-small")
    all_tokens = encoding.encode(content, disallowed_special=())

    chunks = []
    strings = []

    i = 0
    reached_end = False
    while not reached_end:
        current_chunk = all_tokens[i:i + chunk_size]

        chunks.append(current_chunk)
        strings.append(encoding.decode(current_chunk))

        if len(current_chunk) < chunk_size:
            reached_end = True

        i += chunk_size - overlap

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

# creates a prompt for the LLM to answer a user's query based on their browsing history context.
def create_query_prompt_messages(
        chunk_contents: list[str], 
        chunk_urls: list[str], 
        chunk_timestamps: list[str],
        query: str
) -> Iterable[ChatCompletionMessageParam]:

    blocks = []
    for content, url, timestamp in zip(chunk_contents, chunk_urls, chunk_timestamps):
        blocks.append(
            f"# ---START NEXT PAGE CONTENT---\nURL: {url}\nTimestamp: {timestamp}\n\n{content}\n# ---END PREVIOUS PAGE CONTENT---"
        )
    context_block = "\n\n".join(blocks)

    messages = [
        ChatCompletionSystemMessageParam(
            role="system",
            content=(
                "You are a memory assistant that helps the user find and recall information from their past web browsing history. "
                "You will be given relevant raw context extracted from previously visited pages, including URLs and timestamps. "
                "Your goal is to answer the user's question as accurately and concisely as possible, using the provided context."
                "\n\n"
                "When relevant, cite your sources by listing the most relevant URLs as clickable markdown links (using [title](url) syntax). "
                "Shorten URLs by removing unnecessary query strings or fragments, and use descriptive link text if possible."
                "\n\n"
                "For each relevant source, write a brief sentence summarizing the information found there. "
                "If appropriate and if you mentioned many sources such that a summary is needed, provide a short summary sentence at the end. If a source is not relevant, please fully ignore it."
                "\n\n"
                "Format your response using markdown for readability: use headings, bullet points, and markdown links where appropriate. "
                "Avoid long, verbose paragraphs; keep your answers concise and easy to scan. BE MORE CONCISE THAN YOU THINK, ESPECIALLY FOR SIMPLE QUERIES. "
                "The user will let you know if they want a longer response, in general be on the more concise side always. Ideally, unless otherwise prompted, your response's total length SHOULD NOT EXCEED 2 SENTENCES TOTAL UNLESS ASKED."
                "\n\n"
                "If you cannot find an answer in the provided context, respond: "
                "“I couldn't find anything in your browsing history that directly answers your question.”"
            )
        ),
        ChatCompletionUserMessageParam(
            role="user",
            content=(
                f"Here is your browsing history context:\n\n{context_block}\n\n"
                f"Now, use this browsing history context to answer the question below while following your system instructions:\n{query}"
            )
        )
    ]
    return messages

def query_llm_streaming(query: str, chunk_contents: list[str], chunk_urls: list[str], chunk_timestamps: list[str], max_tokens: int = 1000) -> Iterable[str]:
    messages = create_query_prompt_messages(chunk_contents, chunk_urls, chunk_timestamps, query)
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=messages,
        max_tokens=max_tokens,
        stream=True,
    )

    for chunk in response:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content