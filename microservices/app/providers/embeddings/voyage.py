import voyageai
import os
from typing import List
from .base import EmbeddingProvider # Import the interface

class VoyageEmbeddingProvider(EmbeddingProvider):
    def __init__(self):
        self.client = None
        self.model = "voyage-3" 

    def _get_client(self) -> voyageai.Client:
        if self.client is None:
            api_key = os.getenv("VOYAGE_API_KEY") or os.getenv("VOYAGEAI_API_KEY")
            if not api_key:
                raise ValueError("VOYAGE_API_KEY environment variable is not set. Please add it to your .env file.")
            self.client = voyageai.Client(api_key=api_key)
        return self.client

    def embed(self, texts: List[str]) -> List[List[float]]:
        client = self._get_client()
        response = client.embed(texts, model=self.model)
        return response.embeddings