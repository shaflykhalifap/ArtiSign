import { useState, useRef, useCallback, useEffect } from "react";

interface UseAudioRecordingReturn {
  isRecording: boolean;
  isProcessing: boolean;
  recordingTime: number;
  recordedAudio: string | null;
  error: string | null;
  hasPermission: boolean | null;
  showPermissionPrompt: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  retakeAudio: () => void;
  processAudio: (onResult: (text: string) => void) => Promise<void>;
  clearError: () => void;
  setError: (message: string) => void;
  setShowPermissionPrompt: (show: boolean) => void;
  requestAudioPermission: () => Promise<boolean>;
  resetPermissionState: () => void;
}

export const useAudioRecording = (): UseAudioRecordingReturn => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  // Recording timer effect
  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
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

  const checkAudioPermission = useCallback(async () => {
    console.log("🎵 Checking audio permission...");

    try {
      const permissionResult = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });

      console.log("🎵 Permission result:", permissionResult.state);

      if (permissionResult.state === "denied") {
        console.log("🎵 Permission denied, setting state");
        setHasPermission(false);
        setShowPermissionPrompt(true);
        setError(
          "Izin mikrofon telah diblokir. Silakan aktifkan melalui pengaturan browser."
        );
      } else if (permissionResult.state === "granted") {
        console.log("🎵 Permission granted");
        setHasPermission(true);
        setShowPermissionPrompt(false);
      } else {
        // state === "prompt"
        console.log("🎵 Permission prompt state - showing permission prompt");
        setHasPermission(null);
        setShowPermissionPrompt(true);
      }
    } catch (err) {
      console.log("🎵 Permission API not supported for microphone");
      setHasPermission(null);
      // Untuk browser yang tidak support, show prompt saat user coba record
      setShowPermissionPrompt(true);
    }
  }, []);

  const resetPermissionState = useCallback(() => {
    console.log("🎵 Resetting permission state for audio tab");
    console.log("🎵 Current hasPermission:", hasPermission);

    // Jika permission false atau null, langsung show prompt
    if (hasPermission === false || hasPermission === null) {
      console.log(
        "🎵 Setting showPermissionPrompt to true because hasPermission is:",
        hasPermission
      );
      setShowPermissionPrompt(true);
      if (hasPermission === false) {
        setError("Izin mikrofon diperlukan untuk menggunakan fitur ini.");
      }
    }

    // Trigger permission check
    checkAudioPermission();
  }, [hasPermission, checkAudioPermission]);

  // Check permission on mount
  useEffect(() => {
    console.log("🎵 useAudioRecording mounted");
    checkAudioPermission();
  }, [checkAudioPermission]);

  const requestAudioPermission = useCallback(async (): Promise<boolean> => {
    console.log("🎵 Requesting audio permission...");

    try {
      // Check if permission is already denied
      try {
        const permissionResult = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });

        if (permissionResult.state === "denied") {
          console.log("🎵 Microphone permission already denied by user");
          setError(
            "Izin mikrofon telah diblokir. Silakan aktifkan melalui pengaturan browser."
          );
          throw new DOMException(
            "Permission already denied",
            "NotAllowedError"
          );
        }
      } catch (permErr) {
        console.log(
          "🎵 Permission API not supported, proceeding with getUserMedia"
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      // Stop the stream immediately as we just needed to check permission
      stream.getTracks().forEach((track) => track.stop());

      setHasPermission(true);
      setShowPermissionPrompt(false);
      setError(null);
      return true;
    } catch (err) {
      console.error("🎵 Audio permission denied:", err);
      setHasPermission(false);

      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError(
          "Izin mikrofon ditolak. Silakan aktifkan melalui pengaturan browser."
        );
        throw err;
      }
      return false;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      console.log("🎵 Starting audio recording...");

      // Clear any previous recording
      if (recordedAudio) {
        URL.revokeObjectURL(recordedAudio);
        setRecordedAudio(null);
      }

      recordedChunks.current = [];
      setRecordingTime(0);
      setError(null);

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;
      setHasPermission(true);

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log("🎵 Recording stopped, processing chunks...");
        const blob = new Blob(recordedChunks.current, {
          type: "audio/webm;codecs=opus",
        });
        const audioUrl = URL.createObjectURL(blob);
        setRecordedAudio(audioUrl);

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log("🎵 Recording started successfully");
    } catch (err) {
      console.error("🎵 Error starting recording:", err);

      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setHasPermission(false);
        setShowPermissionPrompt(true);
        setError("Izin mikrofon diperlukan untuk merekam audio.");
      } else {
        setError("Gagal memulai perekaman. Pastikan mikrofon terhubung.");
      }
    }
  }, [recordedAudio]);

  const stopRecording = useCallback(() => {
    console.log("🎵 Stopping audio recording...");

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
  }, []);

  const retakeAudio = useCallback(() => {
    console.log("🎵 Retaking audio...");

    // Clean up previous audio URL
    if (recordedAudio) {
      URL.revokeObjectURL(recordedAudio);
    }

    setRecordedAudio(null);
    setError(null);
    setRecordingTime(0);
  }, [recordedAudio]);

  const processAudio = useCallback(
    async (onResult: (text: string) => void) => {
      if (!recordedAudio) {
        setError("Tidak ada audio untuk diproses");
        return;
      }

      setIsProcessing(true);

      try {
        // Simulate audio processing (replace with actual API call)
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Mock result - replace with actual speech-to-text processing
        const mockResult =
          "Halo, ini adalah hasil konversi suara ke teks. Terima kasih telah menggunakan fitur ini.";

        onResult(mockResult);

        // Clean up
        URL.revokeObjectURL(recordedAudio);
        setRecordedAudio(null);
        setError(null);
      } catch (error) {
        console.error("🎵 Error processing audio:", error);
        setError("Gagal memproses audio");
      } finally {
        setIsProcessing(false);
      }
    },
    [recordedAudio]
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
      if (recordedAudio) {
        URL.revokeObjectURL(recordedAudio);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [recordedAudio]);

  return {
    isRecording,
    isProcessing,
    recordingTime,
    recordedAudio,
    error,
    hasPermission: hasPermission === true,
    showPermissionPrompt,
    startRecording,
    stopRecording,
    retakeAudio,
    processAudio,
    clearError,
    setError: setErrorMessage,
    setShowPermissionPrompt,
    requestAudioPermission,
    resetPermissionState,
  };
};
