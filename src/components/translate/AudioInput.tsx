import React, { useEffect } from "react";
import { Mic, Square, Volume2, Trash2 } from "lucide-react";
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
    isListening,
    transcript,
    error,
    hasPermission,
    showPermissionPrompt,
    setShowPermissionPrompt,
    startListening,
    stopListening,
    clearTranscript,
    clearError,
    requestAudioPermission,
    resetPermissionState,
  } = useAudioRecording();

  useEffect(() => {
    resetPermissionState();
  }, [resetPermissionState]);

  // Update input text whenever transcript changes
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript, setInputText]);

  const handlePermissionGranted = async () => {
    try {
      const granted = await requestAudioPermission();
      if (granted) {
        setTimeout(() => {
          startListening();
        }, 100);
      }
    } catch (error) {
      console.log("🎤 Audio permission denied, switching to text tab");
      if (setActiveTab) {
        setActiveTab("text");
      }
    }
  };

  const handleStartListening = async () => {
    if (hasPermission === null || hasPermission === false) {
      return;
    }

    try {
      await startListening();
    } catch (error) {
      console.error("🎤 Error starting listening:", error);
    }
  };

  const handleClearTranscript = () => {
    clearTranscript();
    setInputText("");
  };

  return (
    <div className="flex-1 bg-[#12121C] text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-[#12121C] border-gray-700 flex items-center justify-center gap-2 relative">
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-[#313131] flex items-center justify-center">
          <Mic size={16} className="text-gray-400" />
        </div>
        <span>Input Suara {isListening ? "(Mendengarkan)" : ""}</span>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[11.5rem] h-0.5 bg-blue-500"></div>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="p-4 border-b border-gray-700">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-300">Teks yang dikenali:</p>
              <button
                onClick={handleClearTranscript}
                className="text-gray-400 hover:text-red-400 transition-colors"
                title="Hapus teks"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-white whitespace-pre-wrap">{transcript}</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4">
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md text-sm">
            {error}
            {error.includes("diblokir") && (
              <div className="text-xs text-gray-400 space-y-1 mt-3">
                <p>Cara mengaktifkan:</p>
                <p>1. Klik ikon 🔒 di samping kiri address bar</p>
                <p>2. Pilih "Izinkan" untuk mikrofon</p>
                <p>3. Refresh halaman</p>
              </div>
            )}
            <button
              onClick={clearError}
              className="block mx-auto mt-2 text-xs underline hover:no-underline"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
        {isListening ? (
          // Listening State
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <button
                onClick={stopListening}
                className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors group"
                aria-label="Stop listening"
              >
                <div className="w-full h-full rounded-full bg-red-500/30 group-hover:bg-red-500/40 flex items-center justify-center animate-pulse">
                  <Square size={36} fill="white" className="text-white" />
                </div>
              </button>
            </div>
            <p className="text-gray-300">Sedang mendengarkan...</p>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">LIVE</span>
            </div>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Berbicara dengan jelas dalam bahasa Indonesia. Teks akan muncul
              secara real-time.
            </p>
          </div>
        ) : (
          // Start Listening State
          <div className="flex flex-col items-center justify-center space-y-6">
            <button
              onClick={handleStartListening}
              disabled={!hasPermission}
              className="w-24 h-24 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              aria-label="Start listening"
            >
              <Mic size={48} className="text-white" />
            </button>
            <div className="text-center space-y-2">
              <p className="text-gray-400">
                Tekan tombol mikrofon untuk mulai mendengarkan
              </p>
              <p className="text-sm text-gray-500 max-w-sm">
                Pengenalan suara bekerja dalam bahasa Indonesia. Pastikan
                mikrofon Anda berfungsi dengan baik.
              </p>
            </div>

            {/* Browser Support Info */}
            <div className="bg-gray-800/50 rounded-lg p-3 max-w-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Volume2 size={16} className="text-blue-400" />
                <span className="text-sm text-gray-300">Browser Support</span>
              </div>
              <p className="text-xs text-gray-500">
                Fitur ini bekerja optimal di Chrome, Edge, dan Safari terbaru
                dengan koneksi internet aktif.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Permission Prompt */}
      {showPermissionPrompt && (
        <PermissionPrompt
          requiredPermission="audio"
          onClose={() => setShowPermissionPrompt(false)}
          switchToTextTab={() => {
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
