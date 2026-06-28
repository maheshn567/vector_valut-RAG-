import voyageai
import os
from typing import List, Dict, Any
from .base import RerankerProvider

class VoyageRerankerProvider(RerankerProvider):
    def __init__(self):
        # Lazily initialize the client to prevent server startup issues when API keys are missing
        self.client = None
        self.model = "rerank-2.5"

    def _get_client(self) -> voyageai.Client:
        if self.client is None:
            api_key = os.getenv("VOYAGE_API_KEY") or os.getenv("VOYAGEAI_API_KEY")
            if not api_key:
                raise ValueError("VOYAGE_API_KEY environment variable is not set. Please add it to your .env file.")
            self.client = voyageai.Client(api_key=api_key)
        return self.client

    def rerank(self, query: str, results: List[Dict[str, Any]], top_k: int) -> List[Dict[str, Any]]:
        if not results:
            return []

        client = self._get_client()

        # Extract only the text fields for reranking
        documents = [item["text"] for item in results]

        # Call Voyage Rerank API
        response = client.rerank(
            query=query,
            documents=documents,
            model=self.model,
            top_k=top_k
        )

        # Map scores back to the original objects using the results index mapping
        reranked_results = []
        for res in response.results:
            original_item = results[res.index]
            original_item["score"] = float(res.relevance_score)
            reranked_results.append(original_item)

        return reranked_results
