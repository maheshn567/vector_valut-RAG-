from pydantic import BaseModel
from fastapi import UploadFile
from typing import Optional, Dict, Any, List
from app.models.response import ExtractionResponse

# EXTRACTION REQUEST
class ExtractionRequest(BaseModel):
    file: Optional[UploadFile] = None
    url: Optional[str] = None
    text: Optional[str] = None

# CHUNK REQUEST
class ChunkingRequest(BaseModel):
    document: ExtractionResponse
    chunk_size: int = 1000
    chunk_overlap: int = 200
    strategy: str = "recursive"

# EMBEDDING REQUEST
class ChunkInput(BaseModel):
    chunk_id: str
    text: str

# Main Request Schema
class EmbedRequest(BaseModel):
    chunks: List[ChunkInput]
    provider: str = "voyage"

# RERANKING REQUEST
# Represents a chunk retrieved from the previous step
class RetrievedResult(BaseModel):
    chunk_id: str
    text: str
    score: Optional[float] = None  # The initial score from the vector database

# The incoming request schema for /rerank
class RerankRequest(BaseModel):
    query: str
    results: List[RetrievedResult]
    top_k: int = 5
