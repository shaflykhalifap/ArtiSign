import React from "react";
import { Loader2, Video, VideoOff, Hand } from "lucide-react";
import Webcam from "react-webcam";
import { useWebcam } from "../../hooks/useWebcam";
import PermissionPrompt from "../common/PermissionPrompt";

interface CameraInputProps {
  onStaticPrediction: (prediction: string, confidence: number) => void;
  onDynamicPrediction: (prediction: string, confidence: number) => void;
  setActiveTab?: (tab: "text" | "audio" | "camera") => void;
}

const CameraInput: React.FC<CameraInputProps> = ({
  onStaticPrediction,
  onDynamicPrediction,
  setActiveTab,
}) => {
  const {
    webcamRef,
    isActive,
    error,
    isProcessing,
    showPermissionPrompt,
    landmarkSequence,
    isDetecting,
    currentPrediction,
    predictionConfidence,
    staticPrediction,
    staticConfidence,
    startCamera,
    stopCamera,
    clearError,
    setError,
    setShowPermissionPrompt,
    requestCameraPermission,
    resetPermissionState,
    resetCameraState,
  } = useWebcam();

  // Video constraints for optimal quality
  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: "user",
  };

  // Auto-send predictions to output (without filtering)
  React.useEffect(() => {
    if (currentPrediction) {
      onDynamicPrediction(currentPrediction, predictionConfidence);
    }
  }, [currentPrediction, predictionConfidence, onDynamicPrediction]);

  React.useEffect(() => {
    if (staticPrediction) {
      onStaticPrediction(staticPrediction, staticConfidence);
    }
  }, [staticPrediction, staticConfidence, onStaticPrediction]);

  // Reset permission state when component mounts and cleanup on unmount
  React.useEffect(() => {
    resetPermissionState();

    // Cleanup function to reset camera state when component unmounts
    return () => {
      resetCameraState();
    };
  }, [resetPermissionState, resetCameraState]);

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
      console.error("Permission error:", error);
      // Jika permission ditolak, redirect ke text tab
      if (setActiveTab) {
        setActiveTab("text");
      }
    }
  };

  const handleWebcamError = (error: string | DOMException) => {
    console.error("Webcam error:", error);

    if (error instanceof DOMException) {
      switch (error.name) {
        case "NotAllowedError":
          setShowPermissionPrompt(true);
          setError("izin kamera ditolak. harap berikan izin dan coba lagi.");
          break;
        case "NotFoundError":
          setError("tidak ada kamera yang terdeteksi di perangkat Anda.");
          break;
        case "NotReadableError":
          setError("kamera sedang digunakan oleh aplikasi lain.");
          break;
        case "OverconstrainedError":
          setError("konfigurasi kamera tidak didukung oleh perangkat Anda.");
          break;
        default:
          setError("tidak dapat mengakses kamera. coba refresh halaman.");
      }
    } else if (typeof error === "string") {
      if (error.includes("NotAllowed") || error.includes("Permission")) {
        setShowPermissionPrompt(true);
        setError("izin kamera ditolak. harap berikan izin dan coba lagi.");
      } else if (error.includes("NotFound") || error.includes("No device")) {
        setError("tidak ada kamera yang terdeteksi di perangkat Anda.");
      } else {
        setError(
          error || "tidak dapat mengakses kamera. coba refresh halaman."
        );
      }
    } else {
      setError("tidak dapat mengakses kamera. coba refresh halaman.");
    }
  };

  const handleWebcamUserMedia = (stream: MediaStream) => {
    // Clear any previous errors when camera starts successfully
    console.log("Webcam started successfully: ", stream);
    if (error) {
      clearError();
    }
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
          {isDetecting ? "- mendeteksi gerakan" : ""}
        </span>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[11.5rem] h-0.5 bg-blue-500"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-6">
        {/* Real-time Detection Info */}
        {isDetecting && (
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-3 rounded-md text-sm max-w-md w-full text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Hand size={16} className="animate-pulse" />
              <span>mendeteksi gerakan tangan...</span>
            </div>
            <div className="text-xs text-blue-300 space-y-1">
              <div>buffer: {landmarkSequence.length} frame</div>
              <div className="text-xs">
                static:{" "}
                {staticPrediction
                  ? `${staticPrediction} (${Math.round(
                      staticConfidence * 100
                    )}%)`
                  : "menunggu..."}
              </div>
              <div className="text-xs">
                dynamic:{" "}
                {currentPrediction
                  ? `${currentPrediction} (${Math.round(
                      predictionConfidence * 100
                    )}%)`
                  : "menunggu buffer..."}
              </div>
              {isProcessing && (
                <div className="text-xs text-yellow-300">
                  <Loader2 size={12} className="inline animate-spin mr-1" />
                  memproses...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md text-sm max-w-md w-full text-center mb-4">
            {error}
            <button
              onClick={clearError}
              className="block mx-auto mt-2 text-xs underline hover:text-red-300 transition-colors"
            >
              Tutup
            </button>
          </div>
        )}

        {isProcessing ? (
          // Processing State
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 size={48} className="text-blue-500 animate-spin" />
            <p className="text-gray-300">memproses deteksi...</p>
          </div>
        ) : isActive ? (
          // Live Camera Preview with Real-time Detection
          <div className="flex flex-col items-center justify-center space-y-6 w-full">
            <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden border border-gray-700">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-full object-cover"
                onUserMediaError={handleWebcamError}
                onUserMedia={handleWebcamUserMedia}
              />

              {/* Live indicator */}
              <div className="absolute top-2 right-2 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-white text-xs bg-black/70 px-2 py-1 rounded">
                  LIVE
                </span>
              </div>

              {/* Detection indicator */}
              {isDetecting && (
                <div className="absolute top-2 left-2 flex items-center space-x-2">
                  <Hand size={16} className="text-blue-400 animate-pulse" />
                  <span className="text-white text-xs bg-blue-600/70 px-2 py-1 rounded">
                    DETECTING
                  </span>
                </div>
              )}

              {/* Current predictions overlay
              <div className="absolute bottom-2 left-2 right-2 space-y-1">
                {staticPrediction && (
                  <div className="bg-yellow-600/80 text-white px-2 py-1 rounded text-center text-xs">
                    huruf: {staticPrediction} (
                    {Math.round(staticConfidence * 100)}%)
                  </div>
                )}
                {currentPrediction && (
                  <div className="bg-green-600/80 text-white px-2 py-1 rounded text-center text-xs">
                    Kata: {currentPrediction} (
                    {Math.round(predictionConfidence * 100)}%)
                  </div>
                )}
              </div> */}
            </div>

            {/* Camera Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={stopCamera}
                className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full transition-colors shadow-lg"
              >
                <VideoOff size={20} className="mr-2" />
                <span>Stop Kamera</span>
              </button>
            </div>

            {/* Instructions */}
            <div className="text-center text-gray-400 text-sm max-w-md space-y-2">
              <p>
                posisikan tangan anda di depan kamera untuk deteksi real-time
              </p>
              <p className="text-xs text-gray-500">
                sistem akan otomatis mengirim hasil ke output
              </p>
            </div>
          </div>
        ) : (
          // Initial State - Camera Off
          <div className="flex flex-col items-center justify-center space-y-6">
            <button
              onClick={startCamera}
              disabled={showPermissionPrompt}
              className="w-24 h-24 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              aria-label="Start camera"
            >
              <Video size={48} className="text-white" />
            </button>
            <p className="text-gray-400 text-center max-w-md">
              tekan tombol untuk mengaktifkan kamera dan mulai deteksi real-time
              bahasa isyarat
            </p>
          </div>
        )}
      </div>

      {/* Permission Prompt */}
      {showPermissionPrompt && (
        <PermissionPrompt
          requiredPermission="camera"
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

export default CameraInput;
