import chromadb

from .config import CHROMA_DIR
from .embedder import embed_text


# create/open a persistent chroma database on disk
client = chromadb.PersistentClient(path=str(CHROMA_DIR))

# create one collection for your stable.ai project knowledge
collection = client.get_or_create_collection(name="stable_ai_knowledge")


def add_documents(documents: list[dict]) -> None:
    """
    add or update documents in the vector store

    each document should look like:
    {
        "id": "unique-id",
        "text": "chunk text here",
        "metadata": {"file_name": "rules.pdf", "chunk_index": 0}
    }
    """

    if not documents:
        return

    ids = [doc["id"] for doc in documents]
    texts = [doc["text"] for doc in documents]
    metadatas = [doc["metadata"] for doc in documents]

    embeddings = [embed_text(text) for text in texts]

    collection.upsert(
        ids=ids,
        documents=texts,
        metadatas=metadatas,
        embeddings=embeddings
    )


def search_documents(query: str, top_k: int = 5) -> list[dict]:
    """
    search the vector store for the most relevant chunks
    """

    query_embedding = embed_text(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    matches = []

    ids = results.get("ids", [[]])[0]
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]

    for doc_id, doc_text, metadata in zip(ids, documents, metadatas):
        matches.append({
            "id": doc_id,
            "text": doc_text,
            "metadata": metadata
        })

    return matches