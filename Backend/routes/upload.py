from typing import Optional, Dict, Any
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status, Depends
from handlers.upload_handler import UploadHandler 
from config import Config

router = APIRouter()

def get_upload_handler(request: Any) -> UploadHandler:
    return request.app.state.upload_handler

@router.post("/api/upload")
async def upload_file_route(file: UploadFile = File(...), fileType: Optional[str] = Form('unknown'), upload_handler: UploadHandler = Depends(get_upload_handler)):
    if file.size > Config.MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail=f"File too large. Max size is {Config.MAX_FILE_SIZE_MB}MB.")
    
    try:
        result = await upload_handler.handle_file_upload(file, fileType)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"[ERROR] Error in upload route: {e}") 
        raise HTTPException(status_code=500, detail=f"Error processing file upload: {e}")