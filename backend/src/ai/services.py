from openai import AsyncOpenAI

from config.config import settings

client = AsyncOpenAI(api_key=settings.openai_api_key)

async def embed_uploaded_page(content: list[str]):
    text = "\n".join(content)

    response = await client.embeddings.create(
        input=text,
        model="text-embedding-3-small",
    )
    print("Embedding received successfully.")