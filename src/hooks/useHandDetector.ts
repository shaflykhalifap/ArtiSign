import { useRef, useCallback } from "react";

interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

interface DetectionResult {
  landmarks: HandLandmark[][];
  confidence: number;
}

export const useHandDetector = () => {
  const detectorRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  const initializeDetector = useCallback(async () => {
    if (isInitializedRef.current) return;

    try {
      // Import TensorFlow.js modules
      const tf = await import("@tensorflow/tfjs");
      const handPoseDetection = await import(
        "@tensorflow-models/hand-pose-detection"
      );

      // Ensure TensorFlow.js is ready
      await tf.ready();

      const model = handPoseDetection.SupportedModels.MediaPipeHands;
      const detectorConfig = {
        runtime: "tfjs" as const,
        modelType: "full" as const,
        maxHands: 2,
        detectionConfidence: 0.7,
        trackingConfidence: 0.5,
      };

      const detector = await handPoseDetection.createDetector(
        model,
        detectorConfig
      );

      detectorRef.current = detector;
      isInitializedRef.current = true;
    } catch (error) {
      console.error("Failed to initialize hand detector:", error);

      // Fallback: try to continue without throwing error to prevent app crash
      isInitializedRef.current = false;
    }
  }, []);

  const detectHands = useCallback(
    async (videoElement: HTMLVideoElement): Promise<DetectionResult | null> => {
      if (!detectorRef.current || !videoElement || !isInitializedRef.current) {
        return null;
      }

      // Check if video is ready
      if (videoElement.readyState < 2 || videoElement.videoWidth === 0) {
        return null;
      }

      try {
        const hands = await detectorRef.current.estimateHands(videoElement);

        if (hands && hands.length > 0) {
          const landmarks = hands.map((hand: any) => {
            return hand.keypoints.map((keypoint: any) => ({
              x: keypoint.x / videoElement.videoWidth, // Normalize to 0-1
              y: keypoint.y / videoElement.videoHeight, // Normalize to 0-1
              z: keypoint.z || 0,
            }));
          });

          const confidence =
            hands.reduce(
              (sum: number, hand: any) => sum + (hand.score || 0.5),
              0
            ) / hands.length;

          return {
            landmarks,
            confidence,
          };
        }

        return null;
      } catch (error) {
        console.error("Hand detection error:", error);
        return null;
      }
    },
    []
  );

  const extractLandmarkSequence = useCallback(
    (landmarks: HandLandmark[][]): number[][] => {
      return landmarks.map((handLandmarks) =>
        handLandmarks.flatMap((landmark) => [
          landmark.x,
          landmark.y,
          landmark.z,
        ])
      );
    },
    []
  );

  const extractSingleLandmark = useCallback(
    (landmarks: HandLandmark[]): number[] => {
      return landmarks.flatMap((landmark) => [
        landmark.x,
        landmark.y,
        landmark.z,
      ]);
    },
    []
  );

  return {
    initializeDetector,
    detectHands,
    extractLandmarkSequence,
    extractSingleLandmark,
  };
};
