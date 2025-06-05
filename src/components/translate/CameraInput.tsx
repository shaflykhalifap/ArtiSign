import { useState, useRef, useEffect } from "react";
import { Camera, Loader2, CheckCircle, RefreshCcw } from "lucide-react";

interface CameraInputProps {
  setInputText: (text: string) => void;
}

const CameraInput = ({ setInputText }: CameraInputProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Function to start the camera stream
  const startCamera = async () => {
    setError(null); // Reset any previous errors

    // Ensure any existing stream is stopped
    if (streamRef.current) {
      stopCameraInternal();
    }

    try {
      console.log("Meminta akses kamera...");
      const constraints = {
        video: {
          facingMode: "environment", // Use back camera on mobile if available
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Akses kamera berhasil diperoleh");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        // Play the video as soon as metadata is loaded
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            console.log("Metadata loaded, attempting to play video");
            // Tambahkan timeout kecil untuk memberi waktu browser
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current
                  .play()
                  .then(() => {
                    console.log("Video playing successfully");
                    setIsActive(true);
                    setCapturedImage(null);
                  })
                  .catch((err) => {
                    console.error("Error playing video:", err);
                    setError(
                      "Gagal menampilkan video kamera. Coba muat ulang halaman."
                    );
                    stopCameraInternal();
                  });
              }
            }, 100);
          }
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      let errorMessage = "Tidak dapat mengakses kamera.";

      // More specific error messages
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          errorMessage =
            "Anda menolak izin mengakses kamera. Harap berikan izin dan coba lagi.";
        } else if (error.name === "NotFoundError") {
          errorMessage = "Tidak ada kamera yang terdeteksi di perangkat Anda.";
        }
      }

      setError(errorMessage);
      setIsActive(false);
    }
  };

  // Internal function to stop camera
  const stopCameraInternal = () => {
    console.log("Stopping camera internally");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        console.log(`Stopping track: ${track.kind}`);
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.onloadedmetadata = null;
    }
  };

  // Function to stop the camera and update state
  const stopCamera = () => {
    stopCameraInternal();
    setIsActive(false);
  };

  // Function to capture the current video frame
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) {
      setError("Komponen video atau canvas tidak tersedia");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (
      video.readyState < 2 ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      console.warn(
        "Video not ready:",
        video.readyState,
        video.videoWidth,
        video.videoHeight
      );
      setError("Video kamera belum siap. Tunggu sebentar atau muat ulang.");
      return;
    }

    try {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (!context) {
        setError("Tidak dapat membuat konteks canvas");
        return;
      }

      // Draw the video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image as data URL
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);
      console.log("Image captured successfully");

      // Set captured image and stop camera
      setCapturedImage(imageDataUrl);
      stopCamera();
    } catch (err) {
      console.error("Error capturing image:", err);
      setError("Gagal mengambil gambar. Coba lagi.");
    }
  };

  // Process the captured image
  const processImage = async (imageData: string | null) => {
    if (!imageData) {
      setError("Tidak ada gambar untuk diproses");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API processing with delay
      console.log("Processing image...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Set the result text (in real app, this would come from API)
      setInputText(
        "Hasil penerjemahan dari gambar akan muncul di sini (simulasi)"
      );

      // Reset state to allow new captures
      setCapturedImage(null);
    } catch (error) {
      console.error("Error processing image:", error);
      setError("Gagal memproses gambar");
    } finally {
      setIsProcessing(false);
    }
  };

  // Retake photo
  const retakeImage = () => {
    setCapturedImage(null);
    setError(null);
    startCamera();
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      console.log("Component unmounting, cleaning up camera");
      stopCameraInternal();
    };
  }, []);

  return (
    <div className="flex-1 bg-[#12121C] text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-[#12121C] border-gray-700 flex items-center justify-center gap-2 relative">
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-[#313131] flex items-center justify-center">
          <Camera size={16} className="text-gray-400" />
        </div>
        <span>Input Kamera {isActive ? "(Aktif)" : ""}</span>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[11.5rem] h-0.5 bg-blue-500"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md text-sm max-w-md w-full text-center mb-4">
            {error}
            <button
              onClick={() => setError(null)}
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
            <p className="text-gray-300">Memproses gambar...</p>
            {capturedImage && (
              <img
                src={capturedImage}
                alt="Processing"
                className="w-32 h-auto max-h-32 object-contain rounded-md opacity-50"
              />
            )}
          </div>
        ) : capturedImage ? (
          // Captured Image Review
          <div className="flex flex-col items-center justify-center space-y-6 w-full">
            <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden border border-gray-700">
              <img
                src={capturedImage}
                alt="Gambar Tertangkap"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full max-w-md">
              <button
                onClick={retakeImage}
                className="flex-1 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-md transition-colors"
              >
                <RefreshCcw size={18} className="mr-2" />
                <span>ambil ulang</span>
              </button>
              <button
                onClick={() => processImage(capturedImage)}
                className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md transition-colors"
              >
                <CheckCircle size={18} className="mr-2" />
                <span>gunakan gambar ini</span>
              </button>
            </div>
          </div>
        ) : isActive ? (
          // Live Camera Preview
          <div className="flex flex-col items-center justify-center space-y-6 w-full">
            <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden border border-gray-700">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover bg-black"
                style={{
                  display: "block",
                  minHeight: "200px",
                  width: "100%",
                }}
                onLoadedMetadata={(e) => {
                  console.log(
                    "Video metadata loaded, dimensions:",
                    (e.target as HTMLVideoElement).videoWidth,
                    (e.target as HTMLVideoElement).videoHeight
                  );
                }}
                onError={(e) => {
                  console.error("Video element error:", e);
                  setError("Error pada elemen video. Coba refresh halaman.");
                }}
              />
              <div className="absolute top-2 right-2">
                <div className="animate-pulse w-3 h-3 rounded-full bg-red-500"></div>
              </div>
            </div>
            <button
              onClick={captureImage}
              className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full transition-colors"
            >
              <Camera size={20} className="mr-2" />
              <span>ambil Gambar</span>
            </button>
          </div>
        ) : (
          // Initial State - Camera Off
          <div className="flex flex-col items-center justify-center space-y-6">
            <button
              onClick={startCamera}
              className="w-24 h-24 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
            >
              <Camera size={48} className="text-white" />
            </button>
            <p className="text-gray-400 text-center max-w-md">
              tekan tombol untuk mengaktifkan kamera
            </p>
          </div>
        )}
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraInput;
