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
    showPermissionPrompt,
    error,
    startRecording,
    stopRecording,
    clearError,
    setShowPermissionPrompt,
    requestAudioPermission,
  } = useAudioRecording();

  const handlePermissionGranted = async () => {
    const granted = await requestAudioPermission();
    if (granted) {
      setShowPermissionPrompt(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Handle audio processing result
  useEffect(() => {
    if (!isProcessing && !isRecording && !error) {
      // This would be called when recording stops and processing completes
      // You might want to add a separate state or callback for this
    }
  }, [isProcessing, isRecording, error]);

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
            <p className="text-gray-300">Memproses rekaman suara...</p>
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
            <p className="text-gray-300">Sedang merekam...</p>
          </div>
        ) : (
          // Initial State
          <div className="flex flex-col items-center justify-center space-y-6">
            <button
              onClick={startRecording}
              disabled={showPermissionPrompt}
              className="w-24 h-24 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Start recording"
            >
              <Mic size={48} className="text-white" />
            </button>
            <p className="text-gray-400 text-center max-w-xs">
              tekan tombol mikrofon untuk mulai merekam suara Anda.
            </p>
          </div>
        )}
      </div>

      {/* Permission Prompt */}
      {showPermissionPrompt && (
        <PermissionPrompt
          requiredPermission="audio"
          onClose={() => {
            setShowPermissionPrompt(false);
          }}
          switchToTextTab={() => {
            setShowPermissionPrompt(false);
            if (setActiveTab) {
              setActiveTab("text");
            }
          }}
          onPermissionRequest={handlePermissionGranted}
        />
      )}
    </div>
  );
};

export default AudioInput;
