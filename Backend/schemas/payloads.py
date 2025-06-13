from typing import List, Optional
from pydantic import BaseModel, Field
from config import Config

class LandmarkPayload(BaseModel):
    landmarks: List[float] = Field(..., description=f"Flattened array of {Config.NUM_LANDMARK_FEATURES} hand landmarks (x, y, z for each of 21 points).")

class DynamicSignPayload(BaseModel):
    landmarkSequence: List[List[float]] = Field(..., description=f"Array of landmark arrays, each representing a frame. Expected inner array length: {Config.NUM_LANDMARK_FEATURES}.")

class TextToSignPayload(BaseModel):
    text: str = Field(..., min_length=1, description="Text to convert to sign language representation.")

class CreateSessionPayload(BaseModel):
    userId: Optional[str] = Field(None, description="Optional user ID to associate with the session.")

class EndSessionPayload(BaseModel):
    sessionId: str = Field(..., description="The ID of the session to end.")

class RealtimeLandmarksPayload(BaseModel):
    sessionId: str = Field(..., description="The ID of the real-time session.")
    landmarks: List[float] = Field(..., description=f"Current hand landmarks. Expected length: {Config.NUM_LANDMARK_FEATURES}.")

class RealtimeLandmarkSequencePayload(BaseModel):
    sessionId: str = Field(..., description="The ID of the real-time session.")
    landmarkSequence: List[List[float]] = Field(..., description="Sequence of hand landmarks for dynamic sign prediction.")

class CorrectionPayload(BaseModel):
    sessionId: str = Field(..., description="The ID of the real-time session.")
    correctionType: str = Field(..., description="Type of correction: 'letter', 'word', 'clearWord', 'clearText'.")
    correction: str = Field(..., description="The correction value (e.g., corrected letter/word) or empty string for clear operations.")