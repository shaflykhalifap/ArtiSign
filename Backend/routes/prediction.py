import json
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, Form, Depends
from fastapi.responses import JSONResponse

from schemas.payloads import LandmarkPayload, DynamicSignPayload, TextToSignPayload
from handlers.model_handler import ModelHandler 

router = APIRouter()

def get_model_handler(request: Any) -> ModelHandler:
    return request.app.state.model_handler

@router.post("/api/predict-static-sign")
async def predict_static_sign_route(payload: LandmarkPayload, model_handler: ModelHandler = Depends(get_model_handler)):
    try:
        result = await model_handler.predict_static_sign(payload.landmarks)
        return {"success": True, "result": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"[ERROR] Error in static sign prediction route: {e}") 
        return JSONResponse(status_code=500, content={"success": False, "error": str(e), "result": {"class": "A", "confidence": 0.9, "index": 0}})

@router.post("/api/predict-static-sign-form")
async def predict_static_sign_form_route(landmarks: str = Form(...), model_handler: ModelHandler = Depends(get_model_handler)):
    try:
        landmarks_list = json.loads(landmarks)
        if not isinstance(landmarks_list, list):
            raise HTTPException(status_code=400, detail="Invalid landmarks data format: must be a JSON array.")
        result = await model_handler.predict_static_sign(landmarks_list)
        return {"success": True, "result": result}
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON format for landmarks: {e}")
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"[ERROR] Error in static sign prediction route: {e}")
        return JSONResponse(status_code=500, content={"success": False, "error": str(e), "result": {"class": "A", "confidence": 0.9, "index": 0}})

@router.get("/api/available-letters")
async def get_available_letters_route(model_handler: ModelHandler = Depends(get_model_handler)):
    try:
        letters = model_handler.get_available_letters()
        return {"success": True, "count": len(letters), "letters": letters}
    except Exception as e:
        print(f"[ERROR] Error fetching available letters: {e}")
        raise HTTPException(status_code=500, detail="Error processing the request")

@router.post("/api/predict-dynamic-sign")
async def predict_dynamic_sign_route(payload: DynamicSignPayload, model_handler: ModelHandler = Depends(get_model_handler)):
    try:
        result = await model_handler.predict_dynamic_sign(payload.landmarkSequence)
        return {"success": True, "result": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"[ERROR] Error in dynamic sign prediction route: {e}")
        return JSONResponse(status_code=500, content={"success": False, "error": str(e), "result": {"class": "Halo", "confidence": 0.9, "index": 11, "modelUsed": "lstm"}})

@router.post("/api/predict-dynamic-sign-form")
async def predict_dynamic_sign_form_route(
    landmarkSequence: str = Form(...),
    model_handler: ModelHandler = Depends(get_model_handler)
):
    try:
        sequence_list = json.loads(landmarkSequence)
        if not isinstance(sequence_list, list):
            raise HTTPException(status_code=400, detail="Invalid landmark sequence data format: must be a JSON array.")
        result = await model_handler.predict_dynamic_sign(sequence_list)
        return {"success": True, "result": result}
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON format for landmark sequence: {e}")
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"[ERROR] Error in dynamic sign form prediction route: {e}")
        return JSONResponse(status_code=500, content={"success": False, "error": str(e), "result": {"class": "Halo", "confidence": 0.9, "index": 11, "modelUsed": "lstm"}})

@router.get("/api/available-words")
async def get_available_words_route(model_handler: ModelHandler = Depends(get_model_handler)):
    try:
        words = model_handler.get_available_words()
        return {"success": True, "count": len(words), "words": words}
    except Exception as e:
        print(f"[ERROR] Error fetching available words: {e}")
        raise HTTPException(status_code=500, detail="Error processing the request")

@router.post("/api/text-to-sign")
async def text_to_sign_route(payload: TextToSignPayload, model_handler: ModelHandler = Depends(get_model_handler)):
    try:
        result = model_handler.text_to_sign(payload.text)
        print(f"[INFO] Text to sign conversion: text={payload.text}, wordCount={len(result['signs'])}") # Use a proper logger later
        return {"success": True, **result}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"[ERROR] Error in text to sign conversion: {e}")
        raise HTTPException(status_code=500, detail="Error processing the request")