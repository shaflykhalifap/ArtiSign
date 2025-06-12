import { useState, useRef, useCallback, useEffect } from "react";

interface UseAudioRecordingReturn {
  isListening: boolean;
  transcript: string;
  error: string | null;
  hasPermission: boolean | null;
  showPermissionPrompt: boolean;
  setShowPermissionPrompt: (show: boolean) => void;
  startListening: () => Promise<void>;
  stopListening: () => void;
  clearTranscript: () => void;
  clearError: () => void;
  requestAudioPermission: () => Promise<boolean>;
  resetPermissionState: () => void;
}

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const useAudioRecording = (): UseAudioRecordingReturn => {
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  // Check if Speech Recognition is supported
  const isSpeechRecognitionSupported = useCallback(() => {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }, []);

  const checkAudioPermission = useCallback(async () => {
    try {
      const permissionResult = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });

      if (permissionResult.state === "denied") {
        setHasPermission(false);
        setShowPermissionPrompt(true);
        setError(
          "Izin mikrofon telah diblokir. Silakan aktifkan melalui pengaturan browser."
        );
      } else if (permissionResult.state === "granted") {
        setHasPermission(true);
        setShowPermissionPrompt(false);
      } else {
        setHasPermission(null);
        setShowPermissionPrompt(true);
      }
    } catch (err) {
      setHasPermission(null);
      setShowPermissionPrompt(true);
    }
  }, []);

  const resetPermissionState = useCallback(() => {
    if (hasPermission === false || hasPermission === null) {
      setShowPermissionPrompt(true);
      if (hasPermission === false) {
        setError("Izin mikrofon diperlukan untuk menggunakan fitur ini.");
      }
    }
    checkAudioPermission();
  }, [hasPermission, checkAudioPermission]);

  useEffect(() => {
    checkAudioPermission();
  }, [checkAudioPermission]);

  const requestAudioPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // Stop the stream immediately as we just needed to check permission
      stream.getTracks().forEach((track) => track.stop());

      setHasPermission(true);
      setShowPermissionPrompt(false);
      setError(null);
      return true;
    } catch (err) {
      setHasPermission(false);
      setError(
        "Izin mikrofon ditolak. Silakan aktifkan melalui pengaturan browser."
      );
      return false;
    }
  }, []);

  const startListening = useCallback(async () => {
    if (!isSpeechRecognitionSupported()) {
      setError(
        "Browser Anda tidak mendukung Speech Recognition. Gunakan Chrome, Edge, atau Safari terbaru."
      );
      return;
    }

    // Check permission first
    if (!hasPermission) {
      const granted = await requestAudioPermission();
      if (!granted) return;
    }

    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      // Configure speech recognition
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "id-ID"; // Indonesian language
      recognition.maxAlternatives = 1;

      recognitionRef.current = recognition;

      let finalTranscript = "";

      recognition.onstart = () => {
        console.log("🎤 Speech recognition started");
        setIsListening(true);
        setError(null);
        setTranscript("");
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        finalTranscript = "";

        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        // Update transcript with both final and interim results
        const currentTranscript = (finalTranscript + interimTranscript).trim();
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("🎤 Speech recognition error:", event.error);

        switch (event.error) {
          case "no-speech":
            setError(
              "Tidak ada suara yang terdeteksi. Coba bicara lebih keras."
            );
            break;
          case "audio-capture":
            setError("Tidak dapat mengakses mikrofon.");
            break;
          case "not-allowed":
            setError("Izin mikrofon ditolak.");
            setHasPermission(false);
            setShowPermissionPrompt(true);
            break;
          case "network":
            setError("Masalah jaringan. Periksa koneksi internet Anda.");
            break;
          case "aborted":
            // Normal stop, don't show error
            break;
          default:
            setError(`Error: ${event.error}`);
        }

        setIsListening(false);
      };

      recognition.onend = () => {
        console.log("🎤 Speech recognition ended");
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      console.error("🎤 Error starting speech recognition:", error);
      setError("Gagal memulai pengenalan suara.");
      setIsListening(false);
    }
  }, [hasPermission, requestAudioPermission, isSpeechRecognitionSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    error,
    hasPermission: hasPermission === true,
    showPermissionPrompt,
    setShowPermissionPrompt,
    startListening,
    stopListening,
    clearTranscript,
    clearError,
    requestAudioPermission,
    resetPermissionState,
  };
};
