import faiss
import numpy as np

class FAISSStore:
    def __init__(self, dimension=384):
        self.dimension = dimension
        
        # Flat index (simple cosine/L2 search)
        self.index = faiss.IndexFlatL2(self.dimension)
        
        # To store original text chunks
        self.text_chunks = []

    def add(self, vectors, chunks):
        """
        Add vector embeddings + their text chunks.
        """
        vectors = np.array(vectors).astype("float32")
        self.index.add(vectors)
        self.text_chunks.extend(chunks)

    def search(self, query_vector, top_k=5):
        """
        Return the top matching chunks.
        """
        query_vector = np.array([query_vector]).astype("float32")
        distances, indices = self.index.search(query_vector, top_k)

        results = []
        for i in indices[0]:
            if i < len(self.text_chunks):
                results.append(self.text_chunks[i])

        return results