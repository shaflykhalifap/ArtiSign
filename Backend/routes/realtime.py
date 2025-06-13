import time
from typing import Dict, Any
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, status, Depends

from schemas.payloads import CreateSessionPayload, EndSessionPayload, RealtimeLandmarksPayload, RealtimeLandmarkSequencePayload, CorrectionPayload
from handlers import realtime_handler 

router = APIRouter()


@router.post("/api/realtime/session/create")
async def create_realtime_session_route(payload: CreateSessionPayload):
    try:
        return realtime_handler.create_session(payload.userId)
    except Exception as e:
        realtime_handler.log_error("Error creating realtime session:", e)
        raise HTTPException(status_code=500, detail=f"Error creating session: {e}")

@router.post("/api/realtime/session/end")
async def end_realtime_session_route(payload: EndSessionPayload):
    try:
        return realtime_handler.end_session(payload.sessionId)
    except Exception as e:
        realtime_handler.log_error("Error ending realtime session:", e)
        raise HTTPException(status_code=500, detail=f"Error ending session: {e}")

@router.get("/api/realtime/session/{session_id}/status")
async def get_realtime_session_status_route(session_id: str):
    try:
        return realtime_handler.get_session_status(session_id)
    except Exception as e:
        realtime_handler.log_error("Error getting session status:", e)
        raise HTTPException(status_code=500, detail=f"Error getting session status: {e}")

@router.post("/api/realtime/landmarks")
async def realtime_landmarks_route(payload: RealtimeLandmarksPayload):
    try:
        result = await realtime_handler.process_realtime_landmarks(payload.sessionId, payload.landmarks)
        return result
    except HTTPException as e: 
        raise e
    except Exception as e:
        realtime_handler.log_error("Error processing realtime landmarks:", e)
        raise HTTPException(status_code=500, detail=f"Error processing landmarks: {e}")

@router.post("/api/realtime/landmark-sequence")
async def realtime_landmark_sequence_route(payload: RealtimeLandmarkSequencePayload):
    try:
        result = await realtime_handler.process_realtime_landmark_sequence(payload.sessionId, payload.landmarkSequence)
        return result
    except HTTPException as e: 
        raise e
    except Exception as e:
        realtime_handler.log_error("Error processing realtime landmark sequence:", e)
        raise HTTPException(status_code=500, detail=f"Error processing landmark sequence: {e}")

@router.post("/api/realtime/correction")
async def realtime_correction_route(payload: CorrectionPayload):
    try:
        result = realtime_handler.correct_prediction(payload.sessionId, payload.correctionType, payload.correction)
        return result
    except Exception as e:
        realtime_handler.log_error("Error processing correction:", e)
        raise HTTPException(status_code=500, detail=f"Error processing correction: {e}")

@router.websocket("/ws/realtime/sign/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    session = realtime_handler.get_session(session_id)
    if not session:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Invalid session ID")
        return
    
    session["websocket"] = websocket
    realtime_handler.log_info(f"WebSocket connected for session: {session_id}")
    
    try:
        await websocket.accept()
        while True:
            await websocket.receive_text() 
    except WebSocketDisconnect:
        realtime_handler.log_info(f"WebSocket disconnected for session: {session_id}")
        session["websocket"] = None
    except Exception as e:
        realtime_handler.log_error(f"WebSocket error for session {session_id}:", e)
        session["websocket"] = None
    finally:
        realtime_handler.log_info(f"WebSocket connection closed for session: {session_id}")
        session["websocket"] = None