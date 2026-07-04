from fastapi import APIRouter,Depends
import time
from app.models.requests import GenerateRequest
from app.providers.llm.openai_provider import OpenAILLMProvider
from app.providers.llm.Llama_3_1_8B_Instruct import Llama318BInstructProvider
from app.utility.security import validate_api_key

router = APIRouter()

# Initialize the providers (clients load lazily on first request)
openai_llm = OpenAILLMProvider()
llama_llm = Llama318BInstructProvider()

@router.post("/generate")
async def generate_answer(request: GenerateRequest,api_key: str = Depends(validate_api_key)):
    start_time = time.time()
    
    try:
        # Validate and Select Provider
        prov_lower = request.provider.lower()
        
        # Convert Pydantic context chunks to dicts
        context_dicts = [chunk.model_dump() for chunk in request.context]
        
        llm_response = None
        used_provider = prov_lower
        
        if prov_lower in ("nvidia", "llama", "llama-3.1-8b-instruct", "llama-3.3-70b-instruct"):
            try:
                print("Attempting RAG generation via Llama 3.1 (NVIDIA)...")
                llm_response = llama_llm.generate(
                    query=request.query,
                    context=context_dicts,
                    system_prompt=request.system_prompt,
                    history=request.history
                )
                used_provider = "nvidia (llama-3.1-8b-instruct)"
            except Exception as nvidia_error:
                print(f"Llama 3.1 (NVIDIA) generation failed: {str(nvidia_error)}. Falling back to OpenAI...")
                llm_response = openai_llm.generate(
                    query=request.query,
                    context=context_dicts,
                    system_prompt=request.system_prompt,
                    history=request.history
                )
                used_provider = "openai (fallback)"
        elif prov_lower == "openai":
            llm_response = openai_llm.generate(
                query=request.query,
                context=context_dicts,
                system_prompt=request.system_prompt,
                history=request.history
            )
            used_provider = "openai"
        else:
            raise ValueError(f"Provider '{request.provider}' is not supported yet.")
        
        processing_time_ms = int((time.time() - start_time) * 1000)
        
        # Print active provider when response comes
        print("=== [LLM Response Generated] ===")
        print(f"LLM Provider: {used_provider}")
        print(f"Processing Time: {processing_time_ms} ms")
        
        # Standard Success Response Schema
        return {
            "success": True,
            "data": {
                "answer": llm_response["answer"],
                "citations": llm_response["citations"],
                "usage": llm_response["usage"]
            },
            "error": None,
            "metadata": {
                "processing_time_ms": processing_time_ms,
                "provider": used_provider
            }
        }
        
    except Exception as e:
        # Standard Error Response Schema
        return {
            "success": False,
            "data": None,
            "error": {
                "code": "GENERATION_FAILED",
                "message": str(e)
            },
            "metadata": {}
        }