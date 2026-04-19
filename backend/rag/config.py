import os
from pathlib import Path

# backend/rag/config.py
# this file stores the main settings for the rag system

# backend folder
BACKEND_DIR = Path(__file__).resolve().parent.parent

# project root folder (Stable.AI/)
PROJECT_ROOT = BACKEND_DIR.parent

# folder where your barn/resource documents live
RESOURCES_DIR = PROJECT_ROOT / "resources"

# folder where chroma will store the vector database
CHROMA_DIR = BACKEND_DIR / "chroma_db"

# model names
LLM_MODEL = os.getenv("LLM_MODEL", "qwen2.5:3b")
EMBED_MODEL = os.getenv("EMBED_MODEL", "nomic-embed-text:latest")

# retrieval settings
TOP_K = int(os.getenv("RAG_TOP_K", "5"))
MAX_CONTEXT_CHUNKS = int(os.getenv("MAX_CONTEXT_CHUNKS", "5"))