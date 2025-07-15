import os
from pydantic_settings import BaseSettings
import dotenv

class Settings(BaseSettings):
    openai_api_key: str

    @property
    def main_dir(self) -> str:
        return os.path.abspath(os.path.expanduser("~/.browser-brain"))

dotenv.load_dotenv(".env")
settings = Settings() # type: ignore (fields provided by .env file)