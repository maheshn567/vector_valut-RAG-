from abc import ABC, abstractmethod
from typing import List, Dict, Any

class LLMProvider(ABC):
    @abstractmethod
    def generate(self, query: str, context: List[Dict[str, Any]], system_prompt: str, history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        pass