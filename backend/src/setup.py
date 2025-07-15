import os
from config.config import settings

def ensure_directories():
    os.makedirs(settings.main_dir, exist_ok=True)

def ensure_chat_history():
    chat_file = os.path.join(settings.main_dir, "chat_history.jsonl")
    if not os.path.exists(chat_file):
        with open(chat_file, "w", encoding="utf-8") as _:
            pass