from fastapi import APIRouter,Depends
import time
from app.providers.embeddings.voyage import VoyageEmbeddingProvider
from app.models.requests import EmbedRequest
from app.models.response import ChunkEmbedding
from app.utility.security import validate_api_key

router = APIRouter()

# In a real app, you might initialize providers at startup and inject them
voyage_provider = VoyageEmbeddingProvider()

@router.post("/embed")
async def generate_embeddings(request: EmbedRequest,api_key: str = Depends(validate_api_key)):
    start_time = time.time()
    
    try:
        # Validate Provider
        if request.provider.lower() != "voyage":
            raise ValueError(f"Provider '{request.provider}' is not currently implemented.")

        # 1. Extract just the text from the chunks to send to Voyage
        texts_to_embed = [chunk.text for chunk in request.chunks]
        
        # 2. Call the Voyage provider
        vectors = voyage_provider.embed(texts_to_embed)
        
        # 3. Map the generated vectors back to their chunk_ids using the internal model[cite: 1]
        embeddings_result = []
        for chunk, vector in zip(request.chunks, vectors):
            chunk_embedding = ChunkEmbedding(
                chunk_id=chunk.chunk_id,
                vector=vector
            )
            embeddings_result.append(chunk_embedding.model_dump())
            
        processing_time_ms = int((time.time() - start_time) * 1000)
        
        # Standard Success Response Schema[cite: 1]
        return {
            "success": True,
            "data": {
                "embeddings": embeddings_result
            },
            "error": None,
            "metadata": {
                "processing_time_ms": processing_time_ms
            }
        }
        
    except Exception as e:
        # Standard Error Response Schema[cite: 1]
        return {
            "success": False,
            "data": None,
            "error": {
                "code": "EMBEDDING_FAILED",
                "message": str(e)
            },
            "metadata": {}
        }