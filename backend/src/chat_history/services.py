import os

from config.config import settings
from chat_history.models import ChatMessage

MAX_CHAT_HISTORY_SIZE = 100

# store chat history in a jsonl file
chat_file = os.path.join(settings.main_dir, "chat_history.jsonl")

def append_message(message: ChatMessage) -> None:
    with open(chat_file, "a", encoding="utf-8") as f:
        f.write(message.model_dump_json() + "\n")

    # remove old messages if the chat history exceeds the maximum size
    messages = read_messages()
    if len(messages) > MAX_CHAT_HISTORY_SIZE:
        messages = messages[-MAX_CHAT_HISTORY_SIZE:]
        with open(chat_file, "w", encoding="utf-8") as f:
            for msg in messages:
                f.write(msg.model_dump_json() + "\n")

def read_messages() -> list[ChatMessage]:
    messages = []
    if os.path.exists(chat_file):
        with open(chat_file, "r", encoding="utf-8") as f:
            for line in f:
                messages.append(ChatMessage.model_validate_json(line))
        
    print(f"Retrieved {len(messages)} messages: {messages}")
    return messages