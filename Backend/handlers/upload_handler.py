import os
import aiofiles
from uuid import uuid4
from typing import Dict, Any, Optional, Union
from fastapi import UploadFile, HTTPException, status
from config import Config
import traceback 

def log_info(message: str, meta: Optional[Dict] = None):
    print(f"[INFO] {message}", meta if meta else "")

def log_error(message: str, error: Union[Exception, Dict] = None):
    meta = {"message": str(error), "stack": traceback.format_exc()} if isinstance(error, Exception) else error
    print(f"[ERROR] {message}", meta if meta else "")

class UploadHandler:
    async def handle_file_upload(self, file: UploadFile, file_type: str = 'unknown') -> Dict[str, Any]:
        try:
            file_extension = os.path.splitext(file.filename)[1].lower()
            mime_type = file.content_type

            is_valid_type = False
            if file_type == 'image':
                is_valid_type = mime_type in Config.ALLOWED_IMAGE_TYPES
            elif file_type == 'video':
                is_valid_type = mime_type in Config.ALLOWED_VIDEO_TYPES
            else: # unknown, check both
                is_valid_type = (mime_type in Config.ALLOWED_IMAGE_TYPES or
                                 mime_type in Config.ALLOWED_VIDEO_TYPES)
            
            if not is_valid_type:
                allowed_types_str = ", ".join(Config.ALLOWED_IMAGE_TYPES + Config.ALLOWED_VIDEO_TYPES)
                raise HTTPException(status_code=400, detail=f"Invalid file type: {mime_type}. Allowed types: {allowed_types_str}")
            
            if file.size > Config.MAX_FILE_SIZE_BYTES:
                raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail=f"File too large. Max size is {Config.MAX_FILE_SIZE_MB}MB.")

            filename = f"{uuid4()}{file_extension}"
            filepath = os.path.join(Config.UPLOADS_DIR, filename)

            async with aiofiles.open(filepath, "wb") as out_file:
                while content := await file.read(1024 * 1024):
                    await out_file.write(content)

            file_size = os.path.getsize(filepath)

            log_info(f"File uploaded: {filename}", {
                "originalName": file.filename,
                "mimeType": mime_type,
                "type": file_type,
                "size": file_size
            })

            return {
                "success": True,
                "filename": filename,
                "filepath": filepath,
                "originalName": file.filename,
                "mimeType": mime_type,
                "type": file_type
            }
        except HTTPException:
            raise
        except Exception as e:
            log_error("Error uploading file:", e)
            raise HTTPException(status_code=500, detail=f"Error processing file upload: {e}")