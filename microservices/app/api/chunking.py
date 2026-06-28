from fastapi import APIRouter,Depends
from app.models.response import ExtractionResponse
from app.models.requests import ChunkingRequest
from typing import List
import uuid
import time
from app.utility.security import validate_api_key

router = APIRouter()

def generate_fixed_chunks(text: str, page_number: int, chunk_size: int, chunk_overlap: int) -> List[dict]:
    chunks = []
    step = chunk_size - chunk_overlap
    
    # Failsafe: if overlap is mistakenly set greater than or equal to size, default to size
    if step <= 0:
        step = chunk_size
        
    for i in range(0, len(text), step):
        # Slice the text for the current chunk
        chunk_text = text[i : i + chunk_size]
        
        # We don't want to save empty chunks if the text ends unexpectedly
        if not chunk_text.strip():
            continue
            
        chunks.append({
            "chunk_id": str(uuid.uuid4()), # Generate a unique UUID for the chunk
            "text": chunk_text,
            "metadata": {
                "page": page_number,
                "start": i,
                "end": i + len(chunk_text)
            }
        })
        
    return chunks

@router.post("/chunk")
async def chunk_document(request: ChunkingRequest, api_key: str = Depends(validate_api_key)):
    start_time = time.time()
    all_chunks = []
    
    try:
        # Iterate through the pages from the extracted document
        for page in request.document.pages:
            # Apply the fixed chunking strategy
            page_chunks = generate_fixed_chunks(
                text=page.text,
                page_number=page.page_number,
                chunk_size=request.chunk_size,
                chunk_overlap=request.chunk_overlap
            )
            all_chunks.extend(page_chunks)
            
        # Calculate processing time for standard metadata
        processing_time_ms = int((time.time() - start_time) * 1000)
        
        # Standard Success Response Schema
        return {
            "success": True,
            "data": {
                "chunks": all_chunks
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
                "code": "CHUNKING_FAILED",
                "message": str(e)
            },
            "metadata": {}
        }