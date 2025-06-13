import time
import asyncio
from uuid import uuid4
from typing import List, Dict, Union, Any, Optional
from fastapi import WebSocket, HTTPException
from config import Config
import traceback 
from handlers.model_handler import ModelHandler

model_handler: Optional[ModelHandler] = None 
def set_model_handler_instance(handler: ModelHandler):
    global model_handler
    model_handler = handler

def log_info(message: str, meta: Optional[Dict] = None):
    print(f"[INFO] {message}", meta if meta else "")

def log_error(message: str, error: Union[Exception, Dict] = None):
    meta = {"message": str(error), "stack": traceback.format_exc()} if isinstance(error, Exception) else error
    print(f"[ERROR] {message}", meta if meta else "")

user_sessions: Dict[str, Dict[str, Any]] = {}

async def cleanup_inactive_sessions():
    now = time.time() * 1000
    inactive_threshold = Config.REALTIME_SESSION_TIMEOUT_MS
    
    sessions_to_delete = []
    for session_id, session_data in user_sessions.items():
        if now - session_data['last_activity'] > inactive_threshold:
            sessions_to_delete.append(session_id)
            log_info(f"Cleaned up inactive session: {session_id}")
            
    for session_id in sessions_to_delete:
        del user_sessions[session_id]

def create_session(user_id: Optional[str] = None) -> Dict[str, Any]:
    session_id = user_id if user_id else str(uuid4())
    session_data = {
        "user_id": user_id,
        "static_buffer": [],
        "dynamic_buffer": [],
        "last_letter": None,
        "last_word": None,
        "current_word": "",
        "full_text": "",
        "stable_frames": 0,
        "is_in_motion": False,
        "last_activity": time.time() * 1000,
        "websocket": None
    }
    user_sessions[session_id] = session_data
    log_info(f"New user session created: {session_id}")
    return {"success": True, "sessionId": session_id}

def get_session(session_id: str) -> Optional[Dict[str, Any]]:
    session = user_sessions.get(session_id)
    if session:
        session['last_activity'] = time.time() * 1000
    return session

def end_session(session_id: str) -> Dict[str, Any]:
    session = user_sessions.pop(session_id, None)
    if not session:
        return {"success": False, "error": "Session not found"}
    
    if session.get("current_word"):
        asyncio.create_task(complete_word_in_session(session)) 

    log_info(f"Session ended: {session_id}")
    return {"success": True, "fullText": session.get("full_text", ""), "sessionId": session_id}

def get_session_status(session_id: str) -> Dict[str, Any]:
    session = user_sessions.get(session_id)
    if not session:
        return {"success": False, "error": "Session not found"}
    
    return {
        "success": True,
        "sessionId": session_id,
        "currentWord": session.get("current_word", ""),
        "fullText": session.get("full_text", ""),
        "lastLetter": session.get("last_letter", None),
        "lastWord": session.get("last_word", None)
    }

async def publish_update(session_id: str, update: Dict[str, Any]):
    session = user_sessions.get(session_id)
    if session and session.get("websocket"):
        try:
            await session["websocket"].send_json({
                "timestamp": int(time.time() * 1000),
                **update
            })
        except Exception as e:
            log_error(f"Failed to send WebSocket update for session {session_id}:", e)
            session["websocket"] = None

def is_stable_pose(session: Dict[str, Any], landmarks: List[float]) -> bool:
    if not session["static_buffer"]:
        session["static_buffer"].append(landmarks)
        return False
    
    last_landmarks = session["static_buffer"][-1]
    diff_sum = sum(abs(landmarks[i] - last_landmarks[i]) for i in range(min(len(landmarks), len(last_landmarks))))
    avg_diff = diff_sum / len(landmarks)
    
    session["static_buffer"].append(landmarks)
    if len(session["static_buffer"]) > 10:
        session["static_buffer"].pop(0)

    is_stable = avg_diff < (Config.REALTIME_MOVEMENT_THRESHOLD or 0.015)
    
    if is_stable:
        session["stable_frames"] += 1
    else:
        session["stable_frames"] = 0
    
    return session["stable_frames"] >= (Config.REALTIME_STABLE_FRAME_THRESHOLD or 5)

def detect_dynamic_sign(session: Dict[str, Any], landmarks: List[float]) -> Dict[str, bool]:
    if not session["dynamic_buffer"]:
        session["dynamic_buffer"].append(landmarks)
        return {"isStarting": False, "isEnding": False}
    
    last_landmarks = session["dynamic_buffer"][-1]
    diff_sum = sum(abs(landmarks[i] - last_landmarks[i]) for i in range(min(len(landmarks), len(last_landmarks))))
    avg_diff = diff_sum / len(landmarks)
    
    session["dynamic_buffer"].append(landmarks)
    if len(session["dynamic_buffer"]) > 30: 
        session["dynamic_buffer"].pop(0)

    movement_threshold = Config.REALTIME_MOVEMENT_THRESHOLD or 0.03
    is_moving = avg_diff > movement_threshold
    
    was_in_motion = session["is_in_motion"]
    session["is_in_motion"] = is_moving
    
    return {
        "isStarting": is_moving and not was_in_motion,
        "isEnding": not is_moving and was_in_motion and len(session["dynamic_buffer"]) >= (Config.REALTIME_MIN_SEQUENCE_FRAMES or 15)
    }

async def add_letter_to_word(session: Dict[str, Any], letter: str):
    if letter == session["last_letter"]:
        return
    
    session["last_letter"] = letter
    session["current_word"] += letter
    
    await publish_update(session["user_id"], {
        "type": "letter",
        "letter": letter,
        "currentWord": session["current_word"],
        "fullText": session["full_text"]
    })

async def complete_word_in_session(session: Dict[str, Any], word: Optional[str] = None):
    word_to_add = word if word else session["current_word"]
    
    if not word_to_add:
        return
    
    if session["full_text"]:
        session["full_text"] += " "
    
    session["full_text"] += word_to_add
    session["last_word"] = word_to_add
    session["current_word"] = ""
    
    await publish_update(session["user_id"], {
        "type": "word",
        "word": word_to_add,
        "fullText": session["full_text"]
    })

async def process_realtime_landmarks(session_id: str, landmarks: List[float]):
    session = get_session(session_id)
    if not session:
        log_error(f"Session {session_id} not found for landmark processing.")
        return {"success": False, "error": "Session not found"}

    if not model_handler:
        log_error("ModelHandler not initialized in realtime_handler.")
        return {"success": False, "error": "Internal server error: Model handler not ready."}

    try:
        static_result = await model_handler.predict_static_sign(landmarks)
        
        if static_result and static_result["confidence"] > (Config.REALTIME_CONFIDENCE_THRESHOLD or 0.7):
            await add_letter_to_word(session, static_result["class"])


        dynamic_status = detect_dynamic_sign(session, landmarks)
        
        if dynamic_status["isEnding"]:
            if len(session["dynamic_buffer"]) >= Config.REALTIME_MIN_SEQUENCE_FRAMES:
                dynamic_result = await model_handler.predict_dynamic_sign(session["dynamic_buffer"])
                
                if dynamic_result and dynamic_result["confidence"] > (Config.REALTIME_CONFIDENCE_THRESHOLD or 0.7):
                    await complete_word_in_session(session, dynamic_result["class"])
                session["dynamic_buffer"] = [] 
            else:
                log_info(f"Dynamic sequence too short for prediction ({len(session['dynamic_buffer'])} frames). Clearing buffer.")
                session["dynamic_buffer"] = []

        return {"success": True, "sessionId": session_id}
    except Exception as e:
        log_error(f"Error processing realtime landmarks for session {session_id}:", e)
        if isinstance(e, HTTPException):
            raise e
        return {"success": False, "error": str(e)}

async def process_realtime_landmark_sequence(session_id: str, landmark_sequence: List[List[float]]):
    session = get_session(session_id)
    if not session:
        log_error(f"Session {session_id} not found for landmark sequence processing.")
        return {"success": False, "error": "Session not found"}
    
    if not model_handler:
        log_error("ModelHandler not initialized in realtime_handler.")
        return {"success": False, "error": "Internal server error: Model handler not ready."}

    try:
        dynamic_result = await model_handler.predict_dynamic_sign(landmark_sequence)
        if dynamic_result and dynamic_result["confidence"] > (Config.REALTIME_CONFIDENCE_THRESHOLD or 0.7):
            await complete_word_in_session(session, dynamic_result["class"])
        
        return {"success": True, "sessionId": session_id, "result": dynamic_result}
    except Exception as e:
        log_error(f"Error processing realtime landmark sequence for session {session_id}:", e)
        if isinstance(e, HTTPException):
            raise e
        return {"success": False, "error": str(e)}

def correct_prediction(session_id: str, correction_type: str, correction_value: str) -> Dict[str, Any]:
    session = user_sessions.get(session_id)
    if not session:
        return {"success": False, "error": "Session not found"}
    
    if correction_type == 'letter':
        if session["current_word"]:
            session["current_word"] = session["current_word"][:-1] + correction_value
        else:
            session["current_word"] = correction_value
    elif correction_type == 'word':
        words = session["full_text"].split(' ')
        if words and words[-1]: 
            words[-1] = correction_value
            session["full_text"] = ' '.join(words)
        else: 
            session["full_text"] = correction_value
    elif correction_type == 'clearWord':
        session["current_word"] = ''
    elif correction_type == 'clearText':
        session["full_text"] = ''
        session["current_word"] = ''
    else:
        return {"success": False, "error": "Invalid correction type"}
    
    asyncio.create_task(publish_update(session_id, {
        "type": "correction",
        "currentWord": session["current_word"],
        "fullText": session["full_text"]
    }))
    
    return {
        "success": True,
        "currentWord": session["current_word"],
        "fullText": session["full_text"]
    }