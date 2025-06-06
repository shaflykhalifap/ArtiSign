import { useState, useRef, useEffect, useCallback } from "react";
import { usePermissions } from "./usePermission";

interface UseAudioRecordingReturn {
  isRecording: boolean;
  isProcessing: boolean;
  recordingTime: number;
  showPermissionPrompt: boolean;
  error: string | null;
  hasPermission: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearError: () => void;
  setShowPermissionPrompt: (show: boolean) => void;
  requestAudioPermission: () => Promise<boolean>;
  processAudio: (onResult: (text: string) => void) => Promise<void>;
  hasAudioToProcess: boolean;
}

export const useAudioRecording = (): UseAudioRecordingReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAudioToProcess, setHasAudioToProcess] = useState(false);

  const { microphoneGranted } = usePermissions();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check permission on mount
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      if (!microphoneGranted) {
        const permissionCheckTimer = setTimeout(() => {
          if (!microphoneGranted) {
            setShowPermissionPrompt(true);
          }
        }, 500);
        return () => clearTimeout(permissionCheckTimer);
      } else {
        setShowPermissionPrompt(false);
      }
    }
  }, [microphoneGranted]);

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

  const requestAudioPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setShowPermissionPrompt(false);
      setError(null);
      return true;
    } catch (err) {
      console.error("Audio permission denied:", err);

      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError("Izin mikrofon ditolak. Harap berikan izin dan coba lagi.");
      } else {
        setError("Gagal meminta izin mikrofon.");
      }
      return false;
    }
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    setHasAudioToProcess(false);

    // Check permission first
    if (!microphoneGranted) {
      setShowPermissionPrompt(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      // Check if MediaRecorder is supported
      if (!MediaRecorder.isTypeSupported("audio/webm")) {
        throw new Error("Audio recording not supported");
      }

      const options = {
        mimeType: "audio/webm",
        audioBitsPerSecond: 128000,
      };

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        console.log("Data available:", event.data.size);
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log(
          "Recording stopped, chunks:",
          audioChunksRef.current.length
        );

        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: options.mimeType,
          });

          console.log("Audio blob size:", audioBlob.size);

          if (audioBlob.size > 0) {
            setHasAudioToProcess(true);
          } else {
            setError("Rekaman suara kosong, tidak ada yang diproses.");
            setHasAudioToProcess(false);
          }
        } else {
          setError("Tidak ada data audio yang terekam.");
          setHasAudioToProcess(false);
        }

        // Stop stream tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.onstart = () => {
        console.log("Recording started");
        setIsRecording(true);
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setError("Terjadi kesalahan pada perekam media.");
        setIsRecording(false);

        // Stop stream on error
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      // Start recording with timeslice for better data collection
      mediaRecorder.start(1000); // Collect data every second
    } catch (err) {
      console.error("Error accessing microphone:", err);
      let errorMessage = "Tidak dapat mengakses mikrofon.";

      if (err instanceof DOMException) {
        switch (err.name) {
          case "NotAllowedError":
            errorMessage =
              "Izin mikrofon ditolak. Harap berikan izin dan coba lagi.";
            setShowPermissionPrompt(true);
            break;
          case "NotFoundError":
          case "DevicesNotFoundError":
            errorMessage =
              "Tidak ada mikrofon yang terdeteksi di perangkat Anda.";
            break;
          case "NotReadableError":
          case "TrackStartError":
            errorMessage =
              "Mikrofon sedang digunakan oleh aplikasi lain atau ada masalah hardware.";
            break;
          case "OverconstrainedError":
            errorMessage =
              "Pengaturan mikrofon tidak didukung oleh perangkat Anda.";
            break;
          default:
            errorMessage = `Error (${err.name}): Gagal memulai perekaman.`;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setIsRecording(false);
    }
  }, [microphoneGranted]);

  const stopRecording = useCallback(() => {
    console.log("Stopping recording...");

    if (mediaRecorderRef.current) {
      const recorder = mediaRecorderRef.current;

      if (recorder.state === "recording") {
        recorder.stop();
      } else {
        console.log("Recorder not in recording state:", recorder.state);
      }
    }

    setIsRecording(false);
  }, []);

  const processAudio = useCallback(
    async (onResult: (text: string) => void) => {
      if (!hasAudioToProcess || audioChunksRef.current.length === 0) {
        setError("Tidak ada audio untuk diproses");
        return;
      }

      setIsProcessing(true);

      try {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        console.log("Processing audio blob size:", audioBlob.size);

        // Simulate speech-to-text processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (audioBlob.size === 0) {
          setError("Rekaman suara kosong, tidak ada yang diproses.");
          onResult("");
        } else {
          // Mock successful transcription
          const mockResult = `Hasil transkripsi suara: "Ini adalah contoh hasil dari speech-to-text processing." (Simulasi - ${audioBlob.size} bytes)`;
          onResult(mockResult);
        }

        // Reset state after processing
        audioChunksRef.current = [];
        setHasAudioToProcess(false);
        setError(null);
      } catch (error) {
        console.error("Error processing audio:", error);
        setError("Gagal memproses audio");
      } finally {
        setIsProcessing(false);
      }
    },
    [hasAudioToProcess]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Stop recording and clean up
      if (mediaRecorderRef.current) {
        const recorder = mediaRecorderRef.current;
        if (recorder.state === "recording") {
          recorder.stop();
        }
      }

      // Stop stream tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          if (track.readyState === "live") {
            track.stop();
          }
        });
        streamRef.current = null;
      }

      // Clear audio chunks
      audioChunksRef.current = [];
    };
  }, []);

  return {
    isRecording,
    isProcessing,
    recordingTime,
    showPermissionPrompt,
    error,
    hasPermission: microphoneGranted,
    startRecording,
    stopRecording,
    clearError,
    setShowPermissionPrompt,
    requestAudioPermission,
    processAudio,
    hasAudioToProcess,
  };
};
