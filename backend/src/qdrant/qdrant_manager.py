import subprocess
import os
import sys
import time

from qdrant_client import QdrantClient

_qdrant_proc = None
qdrant_client: QdrantClient = None # type: ignore

def start_qdrant():
    global _qdrant_proc
    if _qdrant_proc is None:
        qdrant_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'bin', 'qdrant'))

        home_dir = os.path.expanduser("~")
        storage_path = os.path.join(home_dir, "qdrant_storage")

        _qdrant_proc = subprocess.Popen(
            [qdrant_path],
            cwd=storage_path,
            stdout=subprocess.DEVNULL,
            stderr=sys.stderr
        )
        
        print("Qdrant launched...", flush=True)
        time.sleep(2)  # wait for qdrant to be ready

def stop_qdrant():
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