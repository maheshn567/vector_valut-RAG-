from sentence_transformers import CrossEncoder
from typing import List, Dict, Any
from .base import RerankerProvider

class BGERerankerProvider(RerankerProvider):
    def __init__(self):
        # Lazily load the cross-encoder model to prevent server startup delay
        self.model = None

    def _get_model(self) -> CrossEncoder:
        if self.model is None:
            self.model = CrossEncoder('BAAI/bge-reranker-base')
        return self.model

    def rerank(self, query: str, results: List[Dict[str, Any]], top_k: int) -> List[Dict[str, Any]]:
        if not results:
            return []

        model = self._get_model()

        # CrossEncoders expect input as pairs: [[query, text1], [query, text2], ...]
        sentence_pairs = [[query, item["text"]] for item in results]
        
        # Predict the relevance scores
        scores = model.predict(sentence_pairs)
        
        # Attach the new scores to the original results
        for i, item in enumerate(results):
            item["score"] = float(scores[i])
            
        # Sort by the new score in descending order
        reranked_results = sorted(results, key=lambda x: x["score"], reverse=True)
        
        # Return only the top_k requested
        return reranked_results[:top_k]