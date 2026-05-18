def chunk_text(text, chunk_size=200):
    """
    Break long text into small chunks.
    Useful for storing in vector DB.
    """
    words = text.split()
    chunks = []

    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i+chunk_size])
        chunks.append(chunk)

    return chunks