import time
from fastapi import APIRouter, Depends
from handlers.model_handler import ModelHandler 
from typing import Dict, Any

router = APIRouter()

def get_model_handler(request: Any) -> ModelHandler:
    return request.app.state.model_handler

@router.get("/")
async def root():
    return {"message": "Artisign BISINDO Translator API"}

@router.get("/api/health")
async def health_check(model_handler: ModelHandler = Depends(get_model_handler)):
    return {
        "status": "ok",
        "timestamp": time.time(),
        "models": model_handler.get_model_status(),
        "uptime": time.time() - router.parent.state.start_time 
    }