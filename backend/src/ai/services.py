import os

from openai import AsyncOpenAI

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def embed_uploaded_page(content: list[str]):
    text = "\n".join(content)

    response = await client.embeddings.create(
        input=text,
        model="text-embedding-3-small",
    )
    print("Embedding received successfully.")