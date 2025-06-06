import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";

interface UseWebcamReturn {
  webcamRef: React.RefObject<Webcam> | null;
  isActive: boolean;
  isRecording: boolean;
  recordingTime: number;
  capturedVideo: string | null;
  error: string | null;
  isProcessing: boolean;
  showPermissionPrompt: boolean;
  hasPermission: boolean;
  startCamera: () => void;
  stopCamera: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  retakeVideo: () => void;
  processVideo: (onResult: (text: string) => void) => Promise<void>;
  clearError: () => void;
  setError: (message: string) => void;
  setShowPermissionPrompt: (show: boolean) => void;
  requestCameraPermission: () => Promise<boolean>;
}

export const useWebcam = (): UseWebcamReturn => {
  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const [isActive, setIsActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [capturedVideo, setCapturedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Check permission on mount
  useEffect(() => {
    checkCameraPermission();
  }, []);

  // Recording timer effect
  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRecording]);

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
        audio: true, // Include audio for video recording
      });
      stream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
      setShowPermissionPrompt(false);
      return true;
    } catch (err) {
      console.error("Camera permission denied:", err);
      setHasPermission(false);

      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError(
          "Izin kamera dan mikrofon ditolak. Harap berikan izin dan coba lagi."
        );
      }
      return false;
    }
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

    setIsActive(true);
    setCapturedVideo(null);
  }, [hasPermission, requestCameraPermission]);

  const stopCamera = useCallback(() => {
    console.log("Stopping camera...");
    setIsActive(false);

    // Stop recording if active
    if (isRecording) {
      stopRecording();
    }
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    console.log("Starting video recording...");

    if (!webcamRef.current?.stream) {
      setError("Kamera tidak tersedia untuk merekam");
      return;
    }

    try {
      const options = {
        mimeType: "video/webm;codecs=vp9,opus", // VP9 video + Opus audio
      };

      // Fallback to default if VP9 not supported
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = "video/webm";
      }

      const mediaRecorder = new MediaRecorder(
        webcamRef.current.stream,
        options
      );
      mediaRecorderRef.current = mediaRecorder;
      recordedChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks.current, {
          type: options.mimeType,
        });

        const videoURL = URL.createObjectURL(blob);
        setCapturedVideo(videoURL);
        setIsActive(false); // Stop camera preview
        recordedChunks.current = [];
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setError("Terjadi kesalahan saat merekam video");
        setIsRecording(false);
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setError(null);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Gagal memulai perekaman video");
    }
  }, []);

  const stopRecording = useCallback(() => {
    console.log("Stopping video recording...");

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
  }, []);

  const retakeVideo = useCallback(() => {
    console.log("Retaking video...");

    // Clean up previous video URL
    if (capturedVideo) {
      URL.revokeObjectURL(capturedVideo);
    }

    setCapturedVideo(null);
    setError(null);
    startCamera();
  }, [capturedVideo, startCamera]);

  const processVideo = useCallback(
    async (onResult: (text: string) => void) => {
      if (!capturedVideo) {
        setError("Tidak ada video untuk diproses");
        return;
      }

      setIsProcessing(true);

      try {
        console.log("Processing video...");

        // Simulate video processing (OCR/Translation)
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const mockResult =
          "Hasil penerjemahan dari video akan muncul di sini (simulasi video recording)";
        onResult(mockResult);

        // Clean up
        URL.revokeObjectURL(capturedVideo);
        setCapturedVideo(null);
        setError(null);
      } catch (error) {
        console.error("Error processing video:", error);
        setError("Gagal memproses video");
      } finally {
        setIsProcessing(false);
      }
    },
    [capturedVideo]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setErrorMessage = useCallback((message: string) => {
    setError(message);
  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (capturedVideo) {
        URL.revokeObjectURL(capturedVideo);
      }
    };
  }, [capturedVideo]);

  return {
    webcamRef,
    isActive,
    isRecording,
    recordingTime,
    capturedVideo,
    error,
    isProcessing,
    showPermissionPrompt,
    hasPermission: hasPermission === true,
    startCamera,
    stopCamera,
    startRecording,
    stopRecording,
    retakeVideo,
    processVideo,
    clearError,
    setError: setErrorMessage,
    setShowPermissionPrompt,
    requestCameraPermission,
  };
};
