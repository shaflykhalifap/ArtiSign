#!/usr/bin/env python3
"""
Real-time landmark extraction for BISINDO gesture recognition
Optimized for low latency processing
"""

import cv2
import mediapipe as mp
import json
import sys
import numpy as np
import argparse
import time

# Initialize MediaPipe
mp_hands = mp.solutions.hands

def extract_landmarks_realtime(image_path, confidence_threshold=0.7):
    """
    Extract hand landmarks from image optimized for real-time processing
    
    Args:
        image_path: Path to input image
        confidence_threshold: Minimum detection confidence
        
    Returns:
        dict: Landmark extraction result
    """
    start_time = time.time()
    
    try:
        with mp_hands.Hands(
            static_image_mode=True,
            max_num_hands=1,  # Single hand for speed optimization
            min_detection_confidence=confidence_threshold,
            min_tracking_confidence=0.5
        ) as hands:
            
            # Read image
            image = cv2.imread(image_path)
            if image is None:
                return {
                    "success": False, 
                    "error": "Cannot read image",
                    "processing_time": (time.time() - start_time) * 1000
                }
            
            # Resize for consistent processing (optional optimization)
            height, width = image.shape[:2]
            if width > 640:  # Resize large images for speed
                scale = 640 / width
                new_width = 640
                new_height = int(height * scale)
                image = cv2.resize(image, (new_width, new_height))
            
            # Convert BGR to RGB for MediaPipe
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Process image
            results = hands.process(image_rgb)
            
            landmarks_list = []
            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    # Extract 21 landmarks × 3 coordinates = 63 features
                    landmarks = []
                    for landmark in hand_landmarks.landmark:
                        landmarks.extend([
                            landmark.x,  # Normalized x coordinate
                            landmark.y,  # Normalized y coordinate  
                            landmark.z   # Normalized z coordinate (depth)
                        ])
                    landmarks_list.append(landmarks)
            
            processing_time = (time.time() - start_time) * 1000  # Convert to milliseconds
            
            return {
                "success": True,
                "landmarks": landmarks_list,
                "landmarks_count": len(landmarks_list),
                "image_dimensions": {
                    "width": image.shape[1],
                    "height": image.shape[0]
                },
                "processing_time": processing_time,
                "confidence_threshold": confidence_threshold
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "processing_time": (time.time() - start_time) * 1000
        }

def main():
    """Command line interface"""
    parser = argparse.ArgumentParser(description='Extract hand landmarks for real-time processing')
    parser.add_argument('image_path', help='Path to input image')
    parser.add_argument('--confidence', type=float, default=0.7, 
                       help='Detection confidence threshold (0.1-1.0)')
    
    args = parser.parse_args()
    
    # Validate confidence threshold
    if not 0.1 <= args.confidence <= 1.0:
        print(json.dumps({
            "success": False,
            "error": "Confidence threshold must be between 0.1 and 1.0"
        }))
        sys.exit(1)
    
    # Extract landmarks
    result = extract_landmarks_realtime(args.image_path, args.confidence)
    
    # Output JSON result
    print(json.dumps(result))
    
    # Exit with appropriate code
    sys.exit(0 if result["success"] else 1)

if __name__ == "__main__":
    main()