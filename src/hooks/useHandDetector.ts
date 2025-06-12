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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pendingResolveRef = useRef<
    ((result: DetectionResult | null) => void) | null
  >(null);

  const initializeDetector = useCallback(async () => {
    if (isInitializedRef.current) return;

    try {
      // Import MediaPipe hands
      const { Hands } = await import("@mediapipe/hands");

      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      });

      // Set up the results callback
      hands.onResults((results: any) => {
        if (pendingResolveRef.current) {
          const resolve = pendingResolveRef.current;
          pendingResolveRef.current = null;

          if (
            results.multiHandLandmarks &&
            results.multiHandLandmarks.length > 0
          ) {
            const landmarks = results.multiHandLandmarks.map(
              (handLandmarks: any) => {
                return handLandmarks.map((landmark: any) => ({
                  x: landmark.x, // Already normalized 0-1
                  y: landmark.y, // Already normalized 0-1
                  z: landmark.z || 0,
                }));
              }
            );

            const confidence = results.multiHandedness
              ? results.multiHandedness.reduce(
                  (sum: number, hand: any) => sum + (hand.score || 0.5),
                  0
                ) / results.multiHandedness.length
              : 0.5;

            resolve({
              landmarks,
              confidence,
            });
          } else {
            resolve(null);
          }
        }
      });

      // Create a canvas for processing
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      canvasRef.current = canvas;

      detectorRef.current = hands;
      isInitializedRef.current = true;
    } catch (error) {
      console.error("Failed to initialize MediaPipe hand detector:", error);
      isInitializedRef.current = false;
    }
  }, []);

  const detectHands = useCallback(
    async (videoElement: HTMLVideoElement): Promise<DetectionResult | null> => {
      if (
        !detectorRef.current ||
        !videoElement ||
        !isInitializedRef.current ||
        !canvasRef.current
      ) {
        return null;
      }

      // Check if video is ready
      if (videoElement.readyState < 2 || videoElement.videoWidth === 0) {
        return null;
      }

      // Avoid overlapping detections
      if (pendingResolveRef.current) {
        return null;
      }

      return new Promise((resolve) => {
        pendingResolveRef.current = resolve;

        // Set a timeout to prevent hanging
        const timeout = setTimeout(() => {
          if (pendingResolveRef.current === resolve) {
            pendingResolveRef.current = null;
            resolve(null);
          }
        }, 1000); // 1 second timeout

        try {
          const hands = detectorRef.current;
          const canvas = canvasRef.current!;
          const ctx = canvas.getContext("2d")!;

          // Draw video frame to canvas
          canvas.width = videoElement.videoWidth || 640;
          canvas.height = videoElement.videoHeight || 480;
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

          // Send the canvas to MediaPipe
          hands
            .send({ image: canvas })
            .then(() => {
              clearTimeout(timeout);
            })
            .catch((error: any) => {
              console.error("MediaPipe send error:", error);
              clearTimeout(timeout);
              if (pendingResolveRef.current === resolve) {
                pendingResolveRef.current = null;
                resolve(null);
              }
            });
        } catch (error) {
          console.error("Detection error:", error);
          clearTimeout(timeout);
          if (pendingResolveRef.current === resolve) {
            pendingResolveRef.current = null;
            resolve(null);
          }
        }
      });
    },
    []
  );

  const extractLandmarkSequence = useCallback(
    (landmarks: HandLandmark[][]): number[][] => {
      const sequences = landmarks.map((handLandmarks) => {
        // MediaPipe hands should have 21 landmarks
        if (handLandmarks.length !== 21) {
          console.warn(`Expected 21 landmarks, got ${handLandmarks.length}`);
        }

        const flatSequence = handLandmarks.flatMap((landmark) => [
          landmark.x,
          landmark.y,
          landmark.z,
        ]);

        return flatSequence;
      });

      return sequences;
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
