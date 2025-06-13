import os
import json
import numpy as np
import tensorflow as tf
from typing import List, Dict, Union, Any, Optional
from fastapi import HTTPException
from config import Config
import traceback # 

def log_info(message: str, meta: Optional[Dict] = None):
    print(f"[INFO] {message}", meta if meta else "")

def log_error(message: str, error: Union[Exception, Dict] = None):
    meta = {"message": str(error), "stack": traceback.format_exc()} if isinstance(error, Exception) else error
    print(f"[ERROR] {message}", meta if meta else "")

class ModelHandler:
    def __init__(self):
        self.static_sign_model = None
        self.video_lstm_model = None
        self.image_class_mapping = {}
        self.video_class_mapping = {}
        self.models_loaded = False

    async def load_models(self):
        log_info('Loading TensorFlow models and class mappings...')
        try:
            def _load_model_h5_only(h5_path, model_name, custom_objects=None):
                model = None
                if os.path.exists(h5_path):
                    log_info(f"Attempting to load {model_name} from H5: {h5_path}")
                    try:
                        model = tf.keras.models.load_model(h5_path, custom_objects=custom_objects)
                        log_info(f"{model_name} loaded successfully from H5.")
                        return model
                    except Exception as e:
                        log_error(f"Failed to load {model_name} from H5 at {h5_path}. Error: {e}.", e)
                        raise FileNotFoundError(f"Failed to load {model_name} from H5: {e}")
                else:
                    raise FileNotFoundError(f"H5 model file not found for {model_name} at {h5_path}.")
                
                return model 

            self.static_sign_model = _load_model_h5_only(
                Config.H5_LANDMARK_MODEL_PATH,
                "Static Sign Model (Landmark Model)"
            )

            self.video_lstm_model = _load_model_h5_only(
                Config.H5_VIDEO_LSTM_MODEL_PATH,
                "Video LSTM Model"
            )

            with open(Config.IMAGE_CLASS_MAPPING_PATH, 'r') as f:
                self.image_class_mapping = {int(k): v for k, v in json.load(f).items()}
            log_info('Image Class Mapping loaded successfully.')

            with open(Config.VIDEO_CLASS_MAPPING_PATH, 'r') as f:
                self.video_class_mapping = {int(k): v for k, v in json.load(f).items()}
            log_info('Video Class Mapping loaded successfully.')
            
            self.models_loaded = True
            return {
                "landmark_model": bool(self.static_sign_model),
                "video_lstm_model": bool(self.video_lstm_model),
                "image_class_mapping": bool(self.image_class_mapping),
                "video_class_mapping": bool(self.video_class_mapping)
            }
        except Exception as e:
            log_error('Error loading models or class mappings:', e)
            self.models_loaded = False
            raise

    def get_model_status(self) -> Dict[str, bool]:
        return {
            "landmark_model": self.static_sign_model is not None,
            "video_lstm_model": self.video_lstm_model is not None,
            "video_transformer_model": False, # Always False as it's removed
            "image_class_mapping": bool(self.image_class_mapping),
            "video_class_mapping": bool(self.video_class_mapping)
        }

    async def predict_static_sign(self, landmarks: List[float]) -> Dict[str, Union[str, float, int, None]]:
        if not self.static_sign_model:
            log_error("Static sign model not loaded for prediction.")
            raise HTTPException(status_code=500, detail="Static sign model not loaded.")
        if not landmarks or len(landmarks) != Config.NUM_LANDMARK_FEATURES:
            raise HTTPException(status_code=400, detail=f"Invalid landmark array length. Expected {Config.NUM_LANDMARK_FEATURES}, got {len(landmarks)}.")

        try:
            input_tensor = tf.constant([landmarks], dtype=tf.float32)
            predictions = self.static_sign_model.predict(input_tensor, verbose=0)
            probabilities = tf.nn.softmax(predictions).numpy()[0]

            predicted_index = np.argmax(probabilities)
            predicted_class = self.image_class_mapping.get(predicted_index, "Unknown")
            confidence = float(probabilities[predicted_index])

            log_info(f"Static sign prediction: Class={predicted_class}, Confidence={confidence:.4f}")

            return {
                "class": predicted_class,
                "confidence": confidence,
                "index": int(predicted_index)
            }
        except Exception as e:
            log_error("Error in predict_static_sign:", e)
            raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

    async def predict_dynamic_sign(self, landmark_sequence: List[List[float]]) -> Dict[str, Union[str, float, int, None]]:
        model_to_use = self.video_lstm_model

        if not model_to_use:
            log_error(f"Video LSTM model not loaded for prediction.")
            raise HTTPException(status_code=500, detail=f"Video LSTM model not loaded.")

        if not landmark_sequence or len(landmark_sequence) == 0:
            raise HTTPException(status_code=400, detail='Landmark sequence is empty.')

        num_frames_expected = Config.NUM_FRAMES_VIDEO
        num_features = Config.NUM_LANDMARK_FEATURES

        processed_sequence = list(landmark_sequence)

        if len(processed_sequence) > num_frames_expected:
            processed_sequence = processed_sequence[len(processed_sequence) - num_frames_expected:]
        elif len(processed_sequence) < num_frames_expected:
            padding = [0.0] * num_features
            while len(processed_sequence) < num_frames_expected:
                processed_sequence.append(padding)
        
        processed_sequence = [
            (frame[:num_features] + [0.0] * (num_features - len(frame))) if len(frame) != num_features
            else frame
            for frame in processed_sequence
        ]
        
        try:
            input_tensor = tf.constant([processed_sequence], dtype=tf.float32)
            predictions = model_to_use.predict(input_tensor, verbose=0)
            probabilities = tf.nn.softmax(predictions).numpy()[0]

            predicted_index = np.argmax(probabilities)
            predicted_class = self.video_class_mapping.get(predicted_index, "Unknown")
            confidence = float(probabilities[predicted_index])

            log_info(f"Dynamic sign prediction (LSTM): Class={predicted_class}, Confidence={confidence:.4f}")

            return {
                "class": predicted_class,
                "confidence": confidence,
                "index": int(predicted_index),
                "modelUsed": "lstm"
            }
        except Exception as e:
            log_error("Error in predict_dynamic_sign:", e)
            raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

    def text_to_sign(self, text: str) -> Dict[str, Any]:
        if not text:
            raise HTTPException(status_code=400, detail="No text provided")
        
        words = text.strip().lower().split()
        result_signs = []

        for word in words:
            is_known_word = False
            mapped_word = word
            
            for k, v in self.video_class_mapping.items():
                if v.lower() == word:
                    is_known_word = True
                    mapped_word = v
                    break
            
            if is_known_word:
                result_signs.append({
                    "type": "word",
                    "original": word,
                    "mapped": mapped_word,
                    "knownInDataset": True
                })
            else:
                letters = []
                for letter in word:
                    letter_exists = False
                    mapped_letter = letter.upper()
                    
                    for k, v in self.image_class_mapping.items():
                        if v.lower() == letter.lower():
                            letter_exists = True
                            mapped_letter = v
                            break
                    
                    letters.append({
                        "letter": letter,
                        "mapped": mapped_letter,
                        "exists": letter_exists
                    })
                
                result_signs.append({
                    "type": "fingerspell",
                    "original": word,
                    "letters": letters
                })
        
        return {
            "text": text,
            "signs": result_signs
        }

    def get_available_words(self) -> List[Dict[str, Union[int, str]]]:
        return [{"id": k, "word": v} for k, v in self.video_class_mapping.items()]

    def get_available_letters(self) -> List[Dict[str, Union[int, str]]]:
        return [{"id": k, "letter": v} for k, v in self.image_class_mapping.items()]