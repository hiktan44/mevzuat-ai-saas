#!/usr/bin/env python3
"""
Web wrapper for MCP Server
HTTP API için MCP araçlarını expose eder
"""

import os
import asyncio
import logging
from typing import Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# MCP araçlarını import et
from mevzuat_client import MevzuatApiClient
from mevzuat_models import (
    MevzuatSearchRequest, MevzuatSearchResult,
    MevzuatTurEnum, SortFieldEnum, SortDirectionEnum,
    MevzuatArticleNode, MevzuatArticleContent
)

# Logging ayarla
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(
    title="Mevzuat MCP Server",
    description="HTTP API for Turkish Legislation Search",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production'da domain'leri belirt
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MCP client
mevzuat_client = MevzuatApiClient()

# Request models
class SearchRequest(BaseModel):
    phrase: str
    mevzuat_turleri: list = ["KANUN"]
    page_size: int = 20
    page_number: int = 1
    sort_field: str = "RELEVANCE"
    sort_direction: str = "DESC"

class ArticleTreeRequest(BaseModel):
    mevzuat_id: str

class ArticleContentRequest(BaseModel):
    mevzuat_id: str
    madde_id: str

# API Endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "mevzuat-mcp-server"}

@app.post("/search")
async def search_mevzuat(request: SearchRequest):
    """Mevzuat arama endpoint'i"""
    try:
        logger.info(f"Arama isteği: {request.phrase}")
        
        # MCP arama fonksiyonunu çağır
        search_request = MevzuatSearchRequest(
            phrase=request.phrase,
            mevzuat_tur_list=request.mevzuat_turleri,  # Literal'lar direkt kullanılır
            page_size=request.page_size,
            page_number=request.page_number,
            sort_field=request.sort_field,  # Literal'lar direkt kullanılır
            sort_direction=request.sort_direction  # Literal'lar direkt kullanılır
        )
        
        result = await mevzuat_client.search_documents(search_request)
        
        logger.info(f"Arama tamamlandı: {len(result.documents) if result.documents else 0} sonuç")
        
        return {
            "success": True,
            "data": result.model_dump()
        }
        
    except Exception as e:
        logger.error(f"Arama hatası: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/article-tree")
async def get_article_tree(request: ArticleTreeRequest):
    """Mevzuat madde ağacı endpoint'i"""
    try:
        logger.info(f"Madde ağacı isteği: {request.mevzuat_id}")
        
        result = await mevzuat_client.get_article_tree(request.mevzuat_id)
        
        logger.info(f"Madde ağacı alındı: {len(result) if result else 0} madde")
        
        return {
            "success": True,
            "data": [item.dict() for item in result] if result else []
        }
        
    except Exception as e:
        logger.error(f"Madde ağacı hatası: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/article-content")
async def get_article_content(request: ArticleContentRequest):
    """Madde içeriği endpoint'i"""
    try:
        logger.info(f"Madde içeriği isteği: {request.mevzuat_id}, madde: {request.madde_id}")
        
        if request.madde_id == request.mevzuat_id:
            result = await mevzuat_client.get_full_document_content(request.mevzuat_id)
        else:
            result = await mevzuat_client.get_article_content(request.madde_id, request.mevzuat_id)
        
        logger.info(f"Madde içeriği alındı")
        
        return {
            "success": True,
            "data": result.model_dump()
        }
        
    except Exception as e:
        logger.error(f"Madde içeriği hatası: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Mevzuat MCP Server",
        "version": "1.0.0",
        "description": "HTTP API for Turkish Legislation Search",
        "endpoints": {
            "search": "POST /search",
            "article_tree": "POST /article-tree", 
            "article_content": "POST /article-content",
            "health": "GET /health"
        }
    }

if __name__ == "__main__":
    # Port ve host ayarları
    port = int(os.environ.get("PORT", 8080))
    host = os.environ.get("HOST", "0.0.0.0")
    
    logger.info(f"🚀 Mevzuat MCP Web Server başlatılıyor: {host}:{port}")
    
    uvicorn.run(
        app,
        host=host,
        port=port,
        log_level="info"
    ) 