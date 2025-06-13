import os
import json
import time
import asyncio
from typing import List, Dict, Union, Any, Optional

from fastapi import FastAPI, UploadFile, File, Form, WebSocket, WebSocketDisconnect, HTTPException, status
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from config import Config

from handlers.model_handler import ModelHandler
from handlers.upload_handler import UploadHandler
from handlers.realtime_handler import (
    create_session, end_session, get_session_status,
    process_realtime_landmarks, process_realtime_landmark_sequence,
    correct_prediction, cleanup_inactive_sessions, user_sessions 
)

from routes import general, prediction, upload, realtime, test

def log_info(message: str, meta: Optional[Dict] = None):
    print(f"[INFO] {message}", meta if meta else "")

def log_error(message: str, error: Union[Exception, Dict] = None):
    meta = {"message": str(error), "stack": traceback.format_exc()} if isinstance(error, Exception) else error
    print(f"[ERROR] {message}", meta if meta else "")

model_handler = ModelHandler()
upload_handler = UploadHandler()

app = FastAPI(
    title="Artisign BISINDO Translator API",
    description="Backend API for BISINDO (Indonesian Sign Language) Translator",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(general.router)
app.include_router(prediction.router)
app.include_router(upload.router)
app.include_router(realtime.router)
app.include_router(test.router)

@app.on_event("startup")
async def startup_event():
    log_info("Starting up FastAPI application...")
    Config.create_dirs() 
    app.state.start_time = time.time()
    try:
        await model_handler.load_models() 
        log_info("All models and mappings loaded successfully.")
    except Exception as e:
        log_error("Failed to load models during startup. Exiting...", e)
        raise RuntimeError("Failed to load AI models, cannot start application.")

    app.state.cleanup_task = asyncio.create_task(background_cleanup_task())

@app.on_event("shutdown")
async def shutdown_event():
    log_info("Shutting down FastAPI application...")
    if hasattr(app.state, 'cleanup_task'):
        app.state.cleanup_task.cancel()
        try:
            await app.state.cleanup_task
        except asyncio.CancelledError:
            log_info("Background cleanup task cancelled.")

async def background_cleanup_task():
    while True:
        await asyncio.sleep(30 * 60) 
        await cleanup_inactive_sessions() 

app.start_time = time.time()

