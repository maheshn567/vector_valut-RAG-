from fastapi import APIRouter,Depends
import time
from app.models.requests import GenerateRequest
from app.providers.llm.openai_provider import OpenAILLMProvider
from app.utility.security import validate_api_key

router = APIRouter()

# Initialize the provider (client loads lazily on first request)
openai_llm = OpenAILLMProvider()

@router.post("/generate")
async def generate_answer(request: GenerateRequest,api_key: str = Depends(validate_api_key)):
    start_time = time.time()
    
    try:
        # Validate Provider
        if request.provider.lower() != "openai":
            raise ValueError(f"Provider '{request.provider}' is not supported yet.")

        # Convert Pydantic context chunks to dicts
        context_dicts = [chunk.model_dump() for chunk in request.context]
        
        # Call the LLM provider
        llm_response = openai_llm.generate(
            query=request.query,
            context=context_dicts,
            system_prompt=request.system_prompt
        )
        
        processing_time_ms = int((time.time() - start_time) * 1000)
        
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
                "processing_time_ms": processing_time_ms
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