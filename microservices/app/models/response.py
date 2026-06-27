from pydantic import BaseModel
from typing import List, Dict, Any

# EXTRACTION RESPONSE
class ExtractedPage(BaseModel):
    page_number: int
    text: str

class ExtractionResponse(BaseModel):
    document_name: str
    content_type: str
    pages: List[ExtractedPage]
    metadata: Dict[str, Any]

# CHUNK RESPONSE
class ChunkMetadata(BaseModel):
    page: int
    start: int
    end: int

class ExtractedChunk(BaseModel):
    chunk_id: str
    text: str
    metadata: ChunkMetadata

class ChunkingResponse(BaseModel):
    chunks: List[ExtractedChunk]

#EMBEDDING RESPONSE

class ChunkEmbedding(BaseModel):
    chunk_id: str
    vector: List[float]

class EmbeddingResponse(BaseModel):
    embeddings: List[ChunkEmbedding]