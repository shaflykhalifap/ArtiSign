import React, { useEffect } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import PermissionPrompt from "../common/PermissionPrompt";
import { useAudioRecording } from "../../hooks/useAudioRecording";

interface AudioInputProps {
  setInputText: (text: string) => void;
  setActiveTab?: (tab: "text" | "audio" | "camera") => void;
}

const AudioInput: React.FC<AudioInputProps> = ({
  setInputText,
  setActiveTab,
}) => {
  const {
    isRecording,
    isProcessing,
    recordingTime,
    recordedAudio,
    showPermissionPrompt,
    error,
    hasPermission,
    startRecording,
    stopRecording,
    retakeAudio,
    processAudio,
    clearError,
    setShowPermissionPrompt,
    requestAudioPermission,
    resetPermissionState,
  } = useAudioRecording();

  // Debug logging untuk melihat state changes
  useEffect(() => {
    console.log("🎵 Initial state:", {
      showPermissionPrompt,
      hasPermission,
      error,
    });

    resetPermissionState();
  }, [resetPermissionState]);

  // Debug showPermissionPrompt changes
  useEffect(() => {
    console.log("🎵 showPermissionPrompt changed to:", showPermissionPrompt);
  }, [showPermissionPrompt]);

  // Debug hasPermission changes
  useEffect(() => {
    console.log("🎵 hasPermission changed to:", hasPermission);
  }, [hasPermission]);

  const handlePermissionGranted = async () => {
    console.log("🎵 handlePermissionGranted called");
    try {
      const granted = await requestAudioPermission();
      if (granted) {
        console.log("🎵 Permission granted, hiding prompt");
        setShowPermissionPrompt(false);
        setTimeout(() => {
          startRecording();
        }, 100);
      }
    } catch (error) {
      console.log("🎵 Audio permission denied, switching to text tab");
      if (setActiveTab) {
        setActiveTab("text");
      }
    }
  };

  const handleStartRecording = async () => {
    console.log("🎵 handleStartRecording called");
    console.log("🎵 Current hasPermission:", hasPermission);

    // Jika permission belum diketahui, trigger permission check
    if (hasPermission === null || hasPermission === false) {
      console.log("🎵 Permission needed, showing prompt");
      setShowPermissionPrompt(true);
      return;
    }

    // Jika sudah ada permission, langsung mulai recording
    try {
      await startRecording();
    } catch (error) {
      console.error("🎵 Error starting recording:", error);
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setShowPermissionPrompt(true);
      }
    }
  };

  const handleProcessAudio = async () => {
    await processAudio(setInputText);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex-1 bg-[#12121C] text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-[#12121C] border-gray-700 flex items-center justify-center gap-2 relative">
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-[#313131] flex items-center justify-center">
          <Mic size={16} className="text-gray-400" />
        </div>
        <span>Input Suara {isRecording ? "(Merekam)" : ""}</span>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[11.5rem] h-0.5 bg-blue-500"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md text-sm max-w-md w-full text-center mb-4">
            {error}
            {error.includes("diblokir") && (
              <div className="text-xs text-gray-400 space-y-1 mt-3">
                <p>cara mengaktifkan:</p>
                <p>1. klik ikon 🔒 di samping kiri address bar</p>
                <p>2. pilih "izinkan" untuk mikrofon</p>
                <p>3. refresh halaman</p>
              </div>
            )}
            <button
              onClick={clearError}
              className="block mx-auto mt-2 text-xs underline"
            >
              Tutup
            </button>
          </div>
        )}

        {isProcessing ? (
          // Processing State
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 size={48} className="text-blue-500 animate-spin" />
            <p className="text-gray-300">memproses rekaman suara...</p>
          </div>
        ) : recordedAudio ? (
          // Recorded Audio Preview
          <div className="flex flex-col items-center justify-center space-y-6 w-full">
            <div className="w-full max-w-md bg-gray-800 rounded-lg p-4">
              <audio controls className="w-full">
                <source src={recordedAudio} type="audio/wav" />
                browser Anda tidak mendukung audio player.
              </audio>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleProcessAudio}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                proses audio
              </button>

              <button
                onClick={retakeAudio}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                rekam ulang
              </button>
            </div>
          </div>
        ) : isRecording ? (
          // Recording State
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <button
                onClick={stopRecording}
                className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors group"
                aria-label="Stop recording"
              >
                <div className="w-full h-full rounded-full bg-red-500/30 group-hover:bg-red-500/40 flex items-center justify-center animate-pulse">
                  <Square size={36} fill="white" className="text-white" />
                </div>
              </button>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 px-3 py-1 rounded-full text-white">
                <p className="text-sm font-mono">{formatTime(recordingTime)}</p>
              </div>
            </div>
            <p className="text-gray-300">sedang merekam...</p>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">REC</span>
            </div>
          </div>
        ) : (
          // Initial State
          <div className="flex flex-col items-center justify-center space-y-6">
            <button
              onClick={handleStartRecording}
              disabled={showPermissionPrompt}
              className="w-24 h-24 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Start recording"
            >
              <Mic size={48} className="text-white" />
            </button>
            <p className="text-gray-400 text-center max-w-xs">
              tekan tombol mikrofon untuk mulai merekam suara Anda
            </p>
          </div>
        )}
      </div>

      {/* Permission Prompt */}
      {showPermissionPrompt && (
        <>
          {console.log("🎯 Rendering PermissionPrompt for audio")}
          <PermissionPrompt
            requiredPermission="audio"
            onClose={() => {
              console.log("🎵 Audio permission prompt closed");
              setShowPermissionPrompt(false);
            }}
            switchToTextTab={() => {
              console.log("🎵 Switching to text tab from audio");
              setShowPermissionPrompt(false);
              if (setActiveTab) {
                setActiveTab("text");
              }
            }}
            onPermissionRequest={handlePermissionGranted}
          />
        </>
      )}
    </div>
  );
};

export default AudioInput;
