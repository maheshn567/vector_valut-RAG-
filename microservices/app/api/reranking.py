from fastapi import APIRouter,Depends
import time
from app.models.requests import RerankRequest
from app.providers.rerankers.voyage import VoyageRerankerProvider
from app.utility.security import validate_api_key

router = APIRouter()

# Initialize the provider (client loads lazily on first request)
voyage_reranker = VoyageRerankerProvider()

@router.post("/rerank")
async def rerank_chunks(request: RerankRequest,api_key: str = Depends(validate_api_key)):
    start_time = time.time()
    
    try:
        # Convert Pydantic models to dicts for the provider
        results_dicts = [result.model_dump() for result in request.results]
        
        # Perform the reranking
        reranked_data = voyage_reranker.rerank(
            query=request.query, 
            results=results_dicts, 
            top_k=request.top_k
        )
        
        processing_time_ms = int((time.time() - start_time) * 1000)
        
        # Standard Success Response Schema
        return {
            "success": True,
            "data": {
                "results": reranked_data
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
                "code": "RERANKING_FAILED",
                "message": str(e)
            },
            "metadata": {}
        }