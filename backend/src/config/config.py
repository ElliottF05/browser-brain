from pydantic_settings import BaseSettings
import dotenv

class Settings(BaseSettings):
    openai_api_key: str

    aws_region: str
    aws_s3_bucket: str

    aws_access_key_id: str
    aws_secret_access_key: str

    qdrant_api_key: str
    qdrant_url: str

dotenv.load_dotenv(".env")
settings = Settings() # type: ignore (fields provided by .env file)