from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from app.api.extraction import router as extraction_router
from app.api.chunking import router as chunking_router
from app.api.embedding import router as embedding_router


app = FastAPI(
    title="RAG Search Engine Microservice",
    description="A standalone, provider-agnostic RAG (Retrieval-Augmented Generation) microservice.",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(extraction_router)
app.include_router(chunking_router)
app.include_router(embedding_router)

@app.get("/")
async def root():
    return {
        "success": True,
        "data": {
            "message": "RAG Search Engine Microservice is running"
        },
        "error": None,
        "metadata": {}
    }
