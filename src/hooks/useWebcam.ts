import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { useHandDetector } from "./useHandDetector";
import { postPredictDynamic, postPredictStatic } from "../api/endpoints";

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
  staticPrediction: string | null;
  staticConfidence: number;
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
  const staticPredictionIntervalRef = useRef<number | null>(null);
  const dynamicPredictionIntervalRef = useRef<number | null>(null);
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
  const [staticPrediction, setStaticPrediction] = useState<string | null>(null);
  const [staticConfidence, setStaticConfidence] = useState<number>(0);

  const {
    initializeDetector,
    detectHands,
    extractLandmarkSequence,
    extractSingleLandmark,
  } = useHandDetector();

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

        // Add to buffer for dynamic prediction
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
    } finally {
      isDetectionRunningRef.current = false;
    }
  }, [detectHands, extractLandmarkSequence]);

  const performStaticPrediction = useCallback(async () => {
    if (!webcamRef.current?.video) return;

    try {
      const result = await detectHands(
        webcamRef.current.video as HTMLVideoElement
      );

      if (result && result.landmarks.length > 0) {
        // Use the first hand for static prediction
        const singleLandmark = extractSingleLandmark(result.landmarks[0]);

        const response = await postPredictStatic(singleLandmark);

        if (response.success && response.result) {
          setStaticPrediction(response.result.class);
          setStaticConfidence(response.result.confidence);
        }
      }
    } catch (error) {
      console.error("Static prediction error:", error);
    }
  }, [detectHands, extractSingleLandmark]);

  const performDynamicPrediction = useCallback(async () => {
    if (landmarkBufferRef.current.length >= 5) {
      try {
        setIsProcessing(true);

        const response = await postPredictDynamic(
          landmarkBufferRef.current,
          "transformer"
        );

        if (response.success && response.result) {
          setCurrentPrediction(response.result.class);
          setPredictionConfidence(response.result.confidence);
        }
      } catch (error) {
        console.error("Dynamic prediction error:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  }, []);

  const startRealTimeDetection = useCallback(async () => {
    setIsDetecting(true);
    landmarkBufferRef.current = [];
    setLandmarkSequence([]);

    // Detect hands every 200ms
    detectionIntervalRef.current = window.setInterval(performDetection, 200);

    // Static predictions every 1 second (for letters)
    staticPredictionIntervalRef.current = window.setInterval(
      performStaticPrediction,
      1000
    );

    // Dynamic predictions every 3 seconds (for words/sentences)
    dynamicPredictionIntervalRef.current = window.setInterval(
      performDynamicPrediction,
      3000
    );
  }, [performDetection, performStaticPrediction, performDynamicPrediction]);

  const stopRealTimeDetection = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }

    if (staticPredictionIntervalRef.current) {
      clearInterval(staticPredictionIntervalRef.current);
      staticPredictionIntervalRef.current = null;
    }

    if (dynamicPredictionIntervalRef.current) {
      clearInterval(dynamicPredictionIntervalRef.current);
      dynamicPredictionIntervalRef.current = null;
    }

    isDetectionRunningRef.current = false;
    setIsDetecting(false);
    setCurrentPrediction(null);
    setPredictionConfidence(0);
    setStaticPrediction(null);
    setStaticConfidence(0);
    landmarkBufferRef.current = [];
    setLandmarkSequence([]);
  }, []);

  const startCamera = useCallback(async () => {
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
      if (staticPredictionIntervalRef.current) {
        clearInterval(staticPredictionIntervalRef.current);
      }
      if (dynamicPredictionIntervalRef.current) {
        clearInterval(dynamicPredictionIntervalRef.current);
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
    setStaticPrediction(null);
    setStaticConfidence(0);

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
    staticPrediction,
    staticConfidence,
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
