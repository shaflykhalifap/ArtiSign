import React from "react";
import { Loader2, CheckCircle, RefreshCcw, Video, Square } from "lucide-react";
import Webcam from "react-webcam";
import { useWebcam } from "../../hooks/useWebcam";
import PermissionPrompt from "../common/PermissionPrompt";

interface CameraInputProps {
  setInputText: (text: string) => void;
  setActiveTab?: (tab: "text" | "audio" | "camera") => void;
}

const CameraInput: React.FC<CameraInputProps> = ({
  setInputText,
  setActiveTab,
}) => {
  const {
    webcamRef,
    isActive,
    isRecording,
    recordingTime,
    capturedVideo,
    error,
    isProcessing,
    showPermissionPrompt,
    startCamera,
    startRecording,
    stopRecording,
    retakeVideo,
    processVideo,
    clearError,
    setError,
    setShowPermissionPrompt,
    requestCameraPermission,
    resetPermissionState,
  } = useWebcam();

  // Video constraints for optimal quality
  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: "user",
  };

  // Reset permission state when component unmounts
  React.useEffect(() => {
    resetPermissionState();
  }, [resetPermissionState]);

  const handleProcessVideo = async () => {
    await processVideo(setInputText);
  };

  const handlePermissionGranted = async () => {
    try {
      const granted = await requestCameraPermission();
      if (granted) {
        setShowPermissionPrompt(false);
        setTimeout(() => {
          startCamera();
        }, 100);
      }
    } catch (error) {
      // Jika permission ditolak, redirect ke text tab
      if (setActiveTab) {
        setActiveTab("text");
      }
    }
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
          <Video size={16} className="text-gray-400" />
        </div>
        <span>
          Input Video {isActive ? "(aktif)" : ""}{" "}
          {isRecording ? "(merekam)" : ""}
        </span>
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
            <p className="text-gray-300">memproses video...</p>
            {capturedVideo && (
              <video
                src={capturedVideo}
                className="w-32 h-auto max-h-32 object-contain rounded-md opacity-50"
                muted
              />
            )}
          </div>
        ) : capturedVideo ? (
          // Captured Video Review
          <div className="flex flex-col items-center justify-center space-y-6 w-full">
            <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden border border-gray-700">
              <video
                src={capturedVideo}
                controls
                className="w-full h-full object-contain"
                preload="metadata"
              >
                browser Anda tidak mendukung video tag.
              </video>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full max-w-md">
              <button
                onClick={retakeVideo}
                className="flex-1 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-md transition-colors"
              >
                <RefreshCcw size={18} className="mr-2" />
                <span>rekam ulang</span>
              </button>
              <button
                onClick={handleProcessVideo}
                className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md transition-colors"
              >
                <CheckCircle size={18} className="mr-2" />
                <span>gunakan video</span>
              </button>
            </div>
          </div>
        ) : isActive ? (
          // Live Camera Preview + Recording Controls
          <div className="flex flex-col items-center justify-center space-y-6 w-full">
            <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden border border-gray-700">
              <Webcam
                ref={webcamRef}
                audio={true} // Enable audio for video recording
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-full object-cover"
                onUserMediaError={(error) => {
                  console.error("Webcam error:", error);
                  clearError();

                  if (error instanceof DOMException) {
                    if (error.name === "NotAllowedError") {
                      setShowPermissionPrompt(true);
                      setError(
                        "izin kamera ditolak. harap berikan izin dan coba lagi."
                      );
                    } else if (error.name === "NotFoundError") {
                      setError(
                        "tidak ada kamera yang terdeteksi di perangkat Anda."
                      );
                    } else {
                      setError(
                        "tidak dapat mengakses kamera. coba refresh halaman."
                      );
                    }
                  } else if (typeof error === "string") {
                    // Handle string error
                    if (
                      error.includes("NotAllowed") ||
                      error.includes("Permission")
                    ) {
                      setShowPermissionPrompt(true);
                      setError(
                        "izin kamera ditolak. harap berikan izin dan coba lagi."
                      );
                    } else if (
                      error.includes("NotFound") ||
                      error.includes("No device")
                    ) {
                      setError(
                        "tidak ada kamera yang terdeteksi di perangkat Anda."
                      );
                    } else {
                      setError(
                        error ||
                          "tidak dapat mengakses kamera. coba refresh halaman."
                      );
                    }
                  } else {
                    // Fallback for any other error type
                    setError(
                      "tidak dapat mengakses kamera. coba refresh halaman."
                    );
                  }
                }}
                onUserMedia={(stream) => {
                  console.log("Camera started successfully:", stream);
                }}
              />

              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-2 right-2 flex items-center space-x-2">
                  <div className="animate-pulse w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-white text-sm font-mono bg-black/50 px-2 py-1 rounded">
                    {formatTime(recordingTime)}
                  </span>
                </div>
              )}

              {/* Live indicator when not recording */}
              {!isRecording && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              )}
            </div>

            {/* Recording Controls */}
            <div className="flex items-center space-x-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full transition-colors"
                >
                  <Video size={20} className="mr-2" />
                  <span>mulai rekam</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full transition-colors"
                >
                  <Square size={20} className="mr-2" />
                  <span>stop ({formatTime(recordingTime)})</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          // Initial State - Camera Off
          <div className="flex flex-col items-center justify-center space-y-6">
            <button
              onClick={startCamera}
              disabled={showPermissionPrompt}
              className="w-24 h-24 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Start camera"
            >
              <Video size={48} className="text-white" />
            </button>
            <p className="text-gray-400 text-center max-w-md">
              tekan tombol untuk mengaktifkan kamera dan mulai merekam video
            </p>
          </div>
        )}
      </div>

      {/* Permission Prompt */}
      {showPermissionPrompt && (
        <PermissionPrompt
          requiredPermission="camera"
          onClose={() => {
            console.log("Permission prompt closed");
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

export default CameraInput;
