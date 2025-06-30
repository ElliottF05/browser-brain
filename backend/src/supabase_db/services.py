from datetime import datetime, timezone
import uuid
from fast_api.models import Chunk
from config.config import settings
from supabase import create_client, Client

# supabase client setup
supabase_client: Client = create_client(
    settings.supabase_url, 
    settings.supabase_service_role_key
)

def upload_chunk(chunk: Chunk):
    json = {
        "chunk_id": chunk.chunk_id,
        "user_id": chunk.user_id,
        "timestamp": chunk.timestamp.isoformat(),
        "chunk_size": len(chunk.content),
    }
    response = supabase_client.table("chunks").insert(json).execute()

def upload_message(message: str, user_id: str, role: str):
    json = {
        "message_id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "user_id": user_id,
        "content": message,
        "role": role,
    }
    response = supabase_client.table("chat_messages").insert(json).execute()