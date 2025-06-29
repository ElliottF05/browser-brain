from config.config import settings
from supabase import create_client, Client

# supabase client setup
supabase_client: Client = create_client(
    settings.supabase_url, 
    settings.supabase_service_role_key
)
