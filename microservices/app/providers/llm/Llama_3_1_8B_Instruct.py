from openai import OpenAI
import os
import re
from typing import List, Dict, Any
from .base import LLMProvider

class Llama318BInstructProvider(LLMProvider):
    def __init__(self):
        # Lazily initialize client to prevent startup failure when NVIDIA_API_KEY is missing
        self.client = None
        self.model = "meta/llama-3.1-8b-instruct"

    def _get_client(self) -> OpenAI:
        if self.client is None:
            api_key = os.getenv("NVIDIA_API_KEY")
            if not api_key:
                raise ValueError("NVIDIA_API_KEY environment variable is not set. Please add it to your .env file.")
            self.client = OpenAI(
                base_url="https://integrate.api.nvidia.com/v1",
                api_key=api_key
            )
        return self.client

    def generate(self, query: str, context: List[Dict[str, Any]], system_prompt: str, history: List[Dict[str, str]] = None) -> Dict[str, Any]:
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

        # 3. Compile the messages payload with system, history context, and latest prompt
        messages = [{"role": "system", "content": augmented_system_prompt}]
        if history:
            for item in history:
                messages.append({"role": item["role"], "content": item["content"]})
        messages.append({"role": "user", "content": final_prompt})

        # 4. Call the NVIDIA Chat Completions API
        response = client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.2,
            top_p=0.7,
            max_tokens=1024,
            stream=False
        )
        
        # 4. Extract the answer and usage statistics
        answer = response.choices[0].message.content
        print("=== [Stage 8: Raw LLM Response] ===")
        print(answer)

        # Retrieve token count safely from response usage
        prompt_tokens = response.usage.prompt_tokens if hasattr(response, 'usage') and hasattr(response.usage, 'prompt_tokens') else 0
        completion_tokens = response.usage.completion_tokens if hasattr(response, 'usage') and hasattr(response.usage, 'completion_tokens') else 0

        usage = {
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens
        }
        
        # 5. Extract citations using regex matching UUID pattern in the LLM answer text
        uuid_pattern = r'[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
        cited_uuids = set(re.findall(uuid_pattern, answer))
        
        citations = []
        for item in context:
            cid = item["chunk_id"]
            if cid in cited_uuids:
                citations.append({"chunk_id": cid})

        # 6. Clean up raw UUID citation IDs from the answer text
        cleaned_answer = re.sub(rf'\[{uuid_pattern}\]', '', answer)
        cleaned_answer = re.sub(rf'\({uuid_pattern}\)', '', cleaned_answer)
        cleaned_answer = re.sub(uuid_pattern, '', cleaned_answer)
        cleaned_answer = re.sub(r' +', ' ', cleaned_answer).replace(" .", ".").strip()

        print("=== [Stage 9: Parsed Citations] ===")
        print(citations)
        return {
            "answer": cleaned_answer,
            "citations": citations,
            "usage": usage
        }
