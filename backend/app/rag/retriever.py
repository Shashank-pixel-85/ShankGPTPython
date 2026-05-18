from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

class RAGRetriever:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.dim = 384

        self.index = faiss.IndexFlatL2(self.dim)
        self.documents = []

    def add_document(self, text: str):
        embedding = self.model.encode([text])
        self.index.add(np.array(embedding).astype("float32"))
        self.documents.append(text)

    def retrieve(self, query: str, top_k=3):
        query_embedding = self.model.encode([query])
        distances, indices = self.index.search(
            np.array(query_embedding).astype("float32"), top_k
        )

        return [self.documents[i] for i in indices[0] if i < len(self.documents)]