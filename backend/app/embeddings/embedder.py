from sentence_transformers import SentenceTransformer
import numpy as np

class Embedder:
    def __init__(self):
        # Simple, powerful embedding model
        self.model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

    def embed_text(self, text: str):
        """Convert a single text into a vector (float32 array)."""
        vector = self.model.encode([text])[0]
        return np.array(vector, dtype="float32")

    def embed_texts(self, texts: list):
        """Convert list of texts into vectors."""
        vectors = self.model.encode(texts)
        return np.array(vectors, dtype="float32")