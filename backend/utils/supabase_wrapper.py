import os

import dotenv
from supabase import Client, create_client

dotenv.load_dotenv()


class SupabaseWrapper:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(SupabaseWrapper, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        if not hasattr(self, "_initialized"):  # Avoid re-initialization
            self.url: str = os.environ.get("SUPABASE_URL")
            self.key: str = os.environ.get("SUPABASE_KEY")
            self.client: Client = create_client(self.url, self.key)
            self._initialized = True
