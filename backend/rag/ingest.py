import uuid
from pathlib import Path

from pypdf import PdfReader

from .chunking import chunk_text
from .config import RESOURCES_DIR
from .vector_store import add_documents


def read_file(path: Path) -> str:
    """
    read supported file types and return their text
    """

    suffix = path.suffix.lower()

    if suffix in [".txt", ".md"]:
        return path.read_text(encoding="utf-8")

    if suffix == ".pdf":
        reader = PdfReader(str(path))
        pages = []

        for page in reader.pages:
            pages.append(page.extract_text() or "")

        return "\n".join(pages)

    return ""


def ingest_resources() -> dict:
    """
    scan the resources folder, chunk files, and load them into the vector store
    """

    documents = []

    for path in RESOURCES_DIR.rglob("*"):
        if path.suffix.lower() not in [".txt", ".md", ".pdf"]:
            continue

        raw_text = read_file(path)

        if not raw_text.strip():
            continue

        chunks = chunk_text(raw_text)

        for i, chunk in enumerate(chunks):
            documents.append({
                "id": f"{path.stem}-{i}-{uuid.uuid4()}",
                "text": chunk,
                "metadata": {
                    "file_name": path.name,
                    "source_type": "resource_file",
                    "chunk_index": i,
                }
            })

    add_documents(documents)

    return {
        "ingested_count": len(documents),
        "resources_dir": str(RESOURCES_DIR)
    }


if __name__ == "__main__":
    result = ingest_resources()
    print(result)