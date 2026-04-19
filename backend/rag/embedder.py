import ollama

from .config import EMBED_MODEL

def embed_text(text: str) -> list[float]:
    """
    create an embedding for a single text string
    """

    response = ollama.embeddings(
        model=EMBED_MODEL,
        prompt=text
    )

    return response["embedding"]


def embed_many(texts: list[str]) -> list[list[float]]:
    """
    create embeddings for multiple text strings
    """

    embeddings = []

    for text in texts:
        response = ollama.embeddings(
            model=EMBED_MODEL,
            prompt=text
        )
        embeddings.append(response["embedding"])

    return embeddings