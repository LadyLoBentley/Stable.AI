def chunk_text(text: str, chunk_size: int = 700, overlap: int = 120) -> list[str]:
    """
    split a large text into overlapping chunks

    args:
        text: the full raw text
        chunk_size: target size of each chunk in characters
        overlap: how much each chunk overlaps with the next one

    returns:
        list of text chunks
    """

    text = (text or "").strip()

    if not text:
        return []

    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        start += chunk_size - overlap

    return chunks