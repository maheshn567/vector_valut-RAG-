from abc import ABC, abstractmethod
from typing import List, Dict, Any

class RerankerProvider(ABC):
    @abstractmethod
    def rerank(self, query: str, results: List[Dict[str, Any]], top_k: int) -> List[Dict[str, Any]]:
        pass