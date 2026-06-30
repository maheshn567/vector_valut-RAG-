from openai import OpenAI
import os
import re
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
        
        # Augment system instructions to force citation tags
        citation_instructions = (
            "\n\nCRITICAL CITATION INSTRUCTION: You must cite the exact source Document ID for any facts or references you use. "
            "When you assert a detail from a context chunk, append the chunk's Document ID enclosed in brackets "
            "at the end of the sentence or statement, e.g. [2ea159be-1b9f-486f-a137-455a5c9132d8]. "
            "Only cite Document IDs that are present in the Context. Do not generate or fabricate any ID."
        )
        augmented_system_prompt = system_prompt + citation_instructions

        # 3. Call the Chat Completions API
        response = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": augmented_system_prompt},
                {"role": "user", "content": final_prompt}
            ]
        )
        
        # 4. Extract the answer and usage statistics
        answer = response.choices[0].message.content
        print("=== [Stage 8: Raw LLM Response] ===")
        print(answer)

        usage = {
            "prompt_tokens": response.usage.prompt_tokens,
            "completion_tokens": response.usage.completion_tokens
        }
        
        # 5. Extract citations using regex matching UUID pattern in the LLM answer text
        uuid_pattern = r'[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
        cited_uuids = set(re.findall(uuid_pattern, answer))
        
        citations = []
        for item in context:
            cid = item["chunk_id"]
            if cid in cited_uuids:
                citations.append({"chunk_id": cid})

        print("=== [Stage 9: Parsed Citations] ===")
        print(citations)
        
        return {
            "answer": answer,
            "citations": citations,
            "usage": usage
        }