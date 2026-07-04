from pydantic import BaseModel
from typing import List, Dict, Any, Optional

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

# EMBEDDING RESPONSE
class ChunkEmbedding(BaseModel):
    chunk_id: str
    vector: List[float]

class EmbeddingResponse(BaseModel):
    embeddings: List[ChunkEmbedding]

# RERANK RESPONSE
class RerankedResult(BaseModel):
    chunk_id: str
    text: str
    score: float

class RerankingResponse(BaseModel):
    results: List[RerankedResult]

# LLM GENERATION RESPONSE
class Citation(BaseModel):
    chunk_id: str

class TokenUsage(BaseModel):
    prompt_tokens: int
    completion_tokens: int

class GenerateResponse(BaseModel):
    answer: str
    citations: List[Citation]
    usage: TokenUsage

# VOICE ASSISTANT RESPONSE
class VoiceChatResponse(BaseModel):
    answer: str
    audio: Optional[bytes] = None