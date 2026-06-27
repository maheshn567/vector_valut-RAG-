from openai import OpenAI
import os
from typing import List, Dict, Any
from .base import LLMProvider

class OpenAILLMProvider(LLMProvider):
    def __init__(self):
        # Lazily initialize client to prevent startup failure when OPENAI_API_KEY is missing
        self.client = None
        self.model = "gpt-4o-mini" # Can be made configurable

    def _get_client(self) -> OpenAI:
        if self.client is None:
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("OPENAI_API_KEY environment variable is not set. Please add it to your .env file.")
            self.client = OpenAI(api_key=api_key)
        return self.client

    def generate(self, query: str, context: List[Dict[str, Any]], system_prompt: str) -> Dict[str, Any]:
        client = self._get_client()

        # 1. Format the context so the LLM can read it and attribute it
        context_strings = []
        for item in context:
            context_strings.append(f"Document ID: {item['chunk_id']}\nContent: {item['text']}")
        
        compiled_context = "\n\n".join(context_strings)
        
        # 2. Construct the prompt
        final_prompt = f"Context:\n{compiled_context}\n\nUser Query: {query}"
        
        # 3. Call the Chat Completions API
        response = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": final_prompt}
            ]
        )
        
        # 4. Extract the answer and usage statistics
        answer = response.choices[0].message.content
        usage = {
            "prompt_tokens": response.usage.prompt_tokens,
            "completion_tokens": response.usage.completion_tokens
        }
        
        # 5. Extract citations (A simple pass-through of provided chunks)
        citations = [{"chunk_id": item["chunk_id"]} for item in context]
        
        return {
            "answer": answer,
            "citations": citations,
            "usage": usage
        }