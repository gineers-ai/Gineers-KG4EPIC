"""
OpenAI Ada-002 Embeddings Service for KG4EPIC
Provides text-embedding-ada-002 embeddings (1536 dimensions)
"""

import os
import time
import logging
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="KG4EPIC Ada-002 Embeddings Service", version="1.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY_ADA_002')
if not openai.api_key:
    logger.error("OPENAI_API_KEY_ADA_002 not found in environment")
    raise ValueError("OpenAI API key not configured")

logger.info("OpenAI API configured successfully")

# Rate limiting configuration (3 req/sec for free tier)
RATE_LIMIT = 3  # requests per second
last_request_time = 0
request_interval = 1.0 / RATE_LIMIT

# Models
class EmbeddingRequest(BaseModel):
    text: str
    model: Optional[str] = "text-embedding-ada-002"

class BatchEmbeddingRequest(BaseModel):
    texts: List[str]
    model: Optional[str] = "text-embedding-ada-002"

class EmbeddingResponse(BaseModel):
    embedding: List[float]
    dimension: int
    model: str
    tokens: int

class BatchEmbeddingResponse(BaseModel):
    embeddings: List[List[float]]
    dimension: int
    model: str
    total_tokens: int
    count: int

# Rate limiting helper
def rate_limit():
    """Enforce rate limiting to avoid hitting OpenAI limits"""
    global last_request_time
    current_time = time.time()
    time_since_last = current_time - last_request_time
    
    if time_since_last < request_interval:
        sleep_time = request_interval - time_since_last
        logger.info(f"Rate limiting: sleeping for {sleep_time:.2f}s")
        time.sleep(sleep_time)
    
    last_request_time = time.time()

# Endpoints
@app.get("/")
async def root():
    return {
        "service": "KG4EPIC Ada-002 Embeddings",
        "model": "text-embedding-ada-002",
        "dimensions": 1536,
        "endpoints": {
            "/health": "Service health check",
            "/embed": "Generate single embedding",
            "/embed/batch": "Generate batch embeddings"
        },
        "rate_limit": f"{RATE_LIMIT} req/sec",
        "max_tokens": 8191
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model": "text-embedding-ada-002",
        "dimension": 1536,
        "api_key_configured": bool(openai.api_key),
        "rate_limit": f"{RATE_LIMIT} req/sec"
    }

@app.post("/embed", response_model=EmbeddingResponse)
async def generate_embedding(request: EmbeddingRequest):
    try:
        # Apply rate limiting
        rate_limit()
        
        # Call OpenAI API
        logger.info(f"Generating embedding for text of length {len(request.text)}")
        response = openai.Embedding.create(
            input=request.text,
            model=request.model
        )
        
        # Extract results
        embedding = response['data'][0]['embedding']
        tokens = response['usage']['total_tokens']
        
        logger.info(f"Generated embedding: {len(embedding)} dimensions, {tokens} tokens")
        
        return EmbeddingResponse(
            embedding=embedding,
            dimension=len(embedding),
            model=request.model,
            tokens=tokens
        )
        
    except openai.error.RateLimitError as e:
        logger.error(f"Rate limit exceeded: {e}")
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Please retry later.")
    
    except openai.error.AuthenticationError as e:
        logger.error(f"Authentication failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    except openai.error.InvalidRequestError as e:
        logger.error(f"Invalid request: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/embed/batch", response_model=BatchEmbeddingResponse)
async def generate_batch_embeddings(request: BatchEmbeddingRequest):
    try:
        embeddings = []
        total_tokens = 0
        
        for text in request.texts:
            # Apply rate limiting for each request
            rate_limit()
            
            logger.info(f"Processing batch item {len(embeddings) + 1}/{len(request.texts)}")
            response = openai.Embedding.create(
                input=text,
                model=request.model
            )
            
            embeddings.append(response['data'][0]['embedding'])
            total_tokens += response['usage']['total_tokens']
        
        logger.info(f"Batch complete: {len(embeddings)} embeddings, {total_tokens} total tokens")
        
        return BatchEmbeddingResponse(
            embeddings=embeddings,
            dimension=1536,
            model=request.model,
            total_tokens=total_tokens,
            count=len(embeddings)
        )
        
    except openai.error.RateLimitError as e:
        logger.error(f"Rate limit exceeded: {e}")
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Please retry later.")
    
    except Exception as e:
        logger.error(f"Batch processing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/embed/compare")
async def compare_embeddings(text1: str, text2: str):
    """Compare similarity between two texts using cosine similarity"""
    try:
        # Generate embeddings for both texts
        rate_limit()
        response1 = openai.Embedding.create(input=text1, model="text-embedding-ada-002")
        
        rate_limit()
        response2 = openai.Embedding.create(input=text2, model="text-embedding-ada-002")
        
        emb1 = response1['data'][0]['embedding']
        emb2 = response2['data'][0]['embedding']
        
        # Calculate cosine similarity
        import numpy as np
        similarity = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))
        
        return {
            "text1_preview": text1[:100],
            "text2_preview": text2[:100],
            "similarity": float(similarity),
            "interpretation": "Very similar" if similarity > 0.9 else "Similar" if similarity > 0.7 else "Somewhat related" if similarity > 0.5 else "Different"
        }
        
    except Exception as e:
        logger.error(f"Comparison error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv('ADA002_PORT', 8001))
    logger.info(f"Starting Ada-002 embeddings service on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)