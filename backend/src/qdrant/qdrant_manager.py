import subprocess
import os
import sys
import time

from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PayloadSchemaType

_qdrant_proc = None
qdrant_client: QdrantClient = None # type: ignore

def get_qdrant_client() -> QdrantClient:
    global qdrant_client
    if qdrant_client is None:
        raise RuntimeError("Qdrant client is not initialized. Call initialize_qdrant_client() first.")
    return qdrant_client

def start_qdrant_server():
    global _qdrant_proc
    if _qdrant_proc is None:
        qdrant_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'bin', 'qdrant'))

        home_dir = os.path.expanduser("~")
        storage_path = os.path.join(home_dir, ".qdrant_storage")

        os.makedirs(storage_path, exist_ok=True)

        _qdrant_proc = subprocess.Popen(
            [qdrant_path],
            cwd=storage_path,
            stdout=subprocess.DEVNULL,
            stderr=sys.stderr
        )
        
        print("Qdrant launched...", flush=True)
        time.sleep(2)  # wait for qdrant to be ready
        initialize_qdrant_client()

def stop_qdrant_server():
    global _qdrant_proc
    if _qdrant_proc is not None:
        _qdrant_proc.terminate()
        _qdrant_proc.wait()
        print("Qdrant stopped.", flush=True)

def initialize_qdrant_client():
    global qdrant_client
    if qdrant_client is None:
        qdrant_client = QdrantClient(
            url="http://localhost:6333",
        )
        print("Qdrant client initialized.", flush=True)
        print(qdrant_client.info(), flush=True)

def ensure_collections_exists():
    if qdrant_client is None:
        raise RuntimeError("Qdrant client is not initialized. Call initialize_qdrant_client() first.")
    
    # Ensure the 'chunks' collection exists
    if not qdrant_client.collection_exists("chunks"):
        qdrant_client.create_collection(
            collection_name="chunks",
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE)
        )
        qdrant_client.create_payload_index(
            collection_name="chunks",
            field_name="timestamp",
            field_schema=PayloadSchemaType.DATETIME,
            wait=True
        )
        print("Collection 'chunks' created.", flush=True)
    else:
        print("Collection 'chunks' already exists.", flush=True)