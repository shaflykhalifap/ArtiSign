import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { useHandDetector } from "./useHandDetector";
import { postPredictDynamic } from "../api/endpoints";

interface UseWebcamReturn {
  webcamRef: React.RefObject<Webcam | null>;
  isActive: boolean;
  error: string | null;
  isProcessing: boolean;
  showPermissionPrompt: boolean;
  hasPermission: boolean;
  landmarkSequence: number[][];
  isDetecting: boolean;
  currentPrediction: string | null;
  predictionConfidence: number;
  startCamera: () => void;
  stopCamera: () => void;
  clearError: () => void;
  setError: (message: string) => void;
  setShowPermissionPrompt: (show: boolean) => void;
  requestCameraPermission: () => Promise<boolean>;
  resetCameraState: () => void;
  resetPermissionState: () => void;
}

export const useWebcam = (): UseWebcamReturn => {
  const webcamRef = useRef<Webcam | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);
  const predictionIntervalRef = useRef<number | null>(null);
  const landmarkBufferRef = useRef<number[][]>([]);
  const isDetectionRunningRef = useRef(false);

  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [landmarkSequence, setLandmarkSequence] = useState<number[][]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<string | null>(
    null
  );
  const [predictionConfidence, setPredictionConfidence] = useState<number>(0);

  const { initializeDetector, detectHands, extractLandmarkSequence } =
    useHandDetector();

  // Check permission on mount
  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      const granted = result.state === "granted";
      setHasPermission(granted);

      if (result.state === "prompt") {
        const timer = setTimeout(() => {
          setShowPermissionPrompt(true);
        }, 500);
        return () => clearTimeout(timer);
      }

      result.onchange = () => {
        const newGranted = result.state === "granted";
        setHasPermission(newGranted);
        if (newGranted) {
          setShowPermissionPrompt(false);
        }
      };
    } catch (err) {
      console.log("Permission API not supported, will check on camera access");
      setHasPermission(null);
    }
  }, []);

  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      stream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
      setShowPermissionPrompt(false);
      return true;
    } catch (err) {
      console.error("Camera permission denied:", err);
      setHasPermission(false);

      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError("izin kamera ditolak. harap berikan izin dan coba lagi.");
        throw err;
      }
      return false;
    }
  }, []);

  const resetPermissionState = useCallback(() => {
    console.log("Resetting permission state for camera tab");
    if (hasPermission === false) {
      setShowPermissionPrompt(true);
    }
  }, [hasPermission]);

  const performDetection = useCallback(async () => {
    if (!webcamRef.current?.video || isDetectionRunningRef.current) {
      return;
    }

    isDetectionRunningRef.current = true;

    try {
      const result = await detectHands(
        webcamRef.current.video as HTMLVideoElement
      );

      if (result && result.landmarks.length > 0) {
        const sequence = extractLandmarkSequence(result.landmarks);

        // Add to buffer
        landmarkBufferRef.current.push(...sequence);
        setLandmarkSequence((prev) => [...prev, ...sequence]);

        // Keep buffer size manageable (last 30 frames)
        if (landmarkBufferRef.current.length > 30) {
          landmarkBufferRef.current = landmarkBufferRef.current.slice(-30);
          setLandmarkSequence((prev) => prev.slice(-30));
        }
      }
    } catch (error) {
      console.error("Hand detection error:", error);
      // Don't set error state for individual detection failures
    } finally {
      isDetectionRunningRef.current = false;
    }
  }, [detectHands, extractLandmarkSequence]);

  const startRealTimeDetection = useCallback(async () => {
    console.log("Starting real-time detection...");
    setIsDetecting(true);
    landmarkBufferRef.current = [];
    setLandmarkSequence([]);

    // Detect hands every 200ms (reduced frequency to avoid overload)
    detectionIntervalRef.current = window.setInterval(performDetection, 200);

    // Make predictions every 3 seconds if we have enough data
    predictionIntervalRef.current = window.setInterval(async () => {
      if (landmarkBufferRef.current.length >= 5) {
        // Reduced minimum frames
        try {
          setIsProcessing(true);
          console.log(
            "Making prediction with",
            landmarkBufferRef.current.length,
            "frames"
          );

          const response = await postPredictDynamic(
            landmarkBufferRef.current,
            "transformer"
          );

          if (response.success && response.result) {
            setCurrentPrediction(response.result.class);
            setPredictionConfidence(response.result.confidence);
            console.log(
              "Prediction:",
              response.result.class,
              "Confidence:",
              response.result.confidence
            );
          }
        } catch (error) {
          console.error("Prediction error:", error);
          // Don't set error state for prediction failures
        } finally {
          setIsProcessing(false);
        }
      }
    }, 3000); // Predict every 3 seconds
  }, [performDetection]);

  const stopRealTimeDetection = useCallback(() => {
    console.log("Stopping real-time detection...");

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }

    if (predictionIntervalRef.current) {
      clearInterval(predictionIntervalRef.current);
      predictionIntervalRef.current = null;
    }

    isDetectionRunningRef.current = false;
    setIsDetecting(false);
    setCurrentPrediction(null);
    setPredictionConfidence(0);
    landmarkBufferRef.current = [];
    setLandmarkSequence([]);
  }, []);

  const startCamera = useCallback(async () => {
    console.log("Starting camera...");
    setError(null);

    if (hasPermission === false) {
      setShowPermissionPrompt(true);
      return;
    }

    if (hasPermission === null) {
      const granted = await requestCameraPermission();
      if (!granted) return;
    }

    try {
      setIsActive(true);

      // Initialize detector without throwing errors
      try {
        await initializeDetector();
      } catch (detectorError) {
        console.warn(
          "Detector initialization failed, but camera will still work:",
          detectorError
        );
        // Don't prevent camera from starting if detector fails
      }

      // Start real-time detection after a delay to ensure camera is ready
      setTimeout(() => {
        startRealTimeDetection();
      }, 2000);
    } catch (error) {
      console.error("Failed to start camera:", error);
      setError("Gagal memulai kamera");
      setIsActive(false);
    }
  }, [
    hasPermission,
    requestCameraPermission,
    initializeDetector,
    startRealTimeDetection,
  ]);

  const stopCamera = useCallback(() => {
    console.log("Stopping camera...");
    setIsActive(false);
    stopRealTimeDetection();
  }, [stopRealTimeDetection]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setErrorMessage = useCallback((message: string) => {
    setError(message);
  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (predictionIntervalRef.current) {
        clearInterval(predictionIntervalRef.current);
      }
      isDetectionRunningRef.current = false;
    };
  }, []);

  const resetCameraState = useCallback(() => {
    stopRealTimeDetection();

    // Reset all states
    setIsActive(false);
    setError(null);
    setIsProcessing(false);
    setShowPermissionPrompt(false);
    setLandmarkSequence([]);
    setCurrentPrediction(null);
    setPredictionConfidence(0);

    landmarkBufferRef.current = [];
    isDetectionRunningRef.current = false;
  }, [stopRealTimeDetection]);

  return {
    webcamRef,
    isActive,
    error,
    isProcessing,
    showPermissionPrompt,
    hasPermission: hasPermission === true,
    landmarkSequence,
    isDetecting,
    currentPrediction,
    predictionConfidence,
    startCamera,
    stopCamera,
    clearError,
    setError: setErrorMessage,
    setShowPermissionPrompt,
    requestCameraPermission,
    resetCameraState,
    resetPermissionState,
  };
};
