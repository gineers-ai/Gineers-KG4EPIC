"""
E5-large-v2 Embeddings Service for KG4EPIC
Simple FastAPI server to generate embeddings
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from sentence_transformers import SentenceTransformer
import logging
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="KG4EPIC Embeddings Service", version="1.0")

# Enable CORS for API container
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model (will download on first run)
logger.info("Loading E5-large-v2 model...")
model = SentenceTransformer('intfloat/e5-large-v2')
logger.info("Model loaded successfully!")

class EmbeddingRequest(BaseModel):
    text: str
    prefix: Optional[str] = None  # 'query' or 'passage'

class BatchEmbeddingRequest(BaseModel):
    texts: List[str]
    prefix: Optional[str] = None

class EmbeddingResponse(BaseModel):
    embedding: List[float]
    dimension: int

class BatchEmbeddingResponse(BaseModel):
    embeddings: List[List[float]]
    dimension: int
    count: int

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model": "intfloat/e5-large-v2",
        "dimension": 1024
    }

@app.post("/embed", response_model=EmbeddingResponse)
async def generate_embedding(request: EmbeddingRequest):
    try:
        # Add prefix if specified (E5 expects "query:" or "passage:")
        text = request.text
        if request.prefix:
            text = f"{request.prefix}: {text}"
        
        # Generate embedding
        embedding = model.encode(text, normalize_embeddings=True)
        embedding_list = embedding.tolist()
        
        return EmbeddingResponse(
            embedding=embedding_list,
            dimension=len(embedding_list)
        )
    except Exception as e:
        logger.error(f"Embedding generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/embed/batch", response_model=BatchEmbeddingResponse)
async def generate_batch_embeddings(request: BatchEmbeddingRequest):
    try:
        # Add prefix if specified
        texts = request.texts
        if request.prefix:
            texts = [f"{request.prefix}: {text}" for text in texts]
        
        # Generate embeddings
        embeddings = model.encode(texts, normalize_embeddings=True)
        embeddings_list = embeddings.tolist()
        
        return BatchEmbeddingResponse(
            embeddings=embeddings_list,
            dimension=embeddings.shape[1],
            count=len(embeddings_list)
        )
    except Exception as e:
        logger.error(f"Batch embedding generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {
        "service": "KG4EPIC Embeddings",
        "endpoints": {
            "/health": "Service health check",
            "/embed": "Generate single embedding",
            "/embed/batch": "Generate batch embeddings"
        },
        "model": "intfloat/e5-large-v2",
        "usage": {
            "query": "Use prefix='query' for search queries",
            "passage": "Use prefix='passage' for indexed content"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)