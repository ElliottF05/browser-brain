from pydantic_settings import BaseSettings
import dotenv

class Settings(BaseSettings):
    openai_api_key: str

dotenv.load_dotenv(".env")
settings = Settings() # type: ignore (fields provided by .env file)