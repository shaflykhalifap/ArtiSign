import React from "react";
import { usePermissions } from "../../hooks/usePermission";
import { Camera, Mic, Settings } from "lucide-react";

interface PermissionPromptProps {
  onClose?: () => void;
  requiredPermission: "camera" | "audio" | "both";
  switchToTextTab?: () => void;
  onPermissionRequest?: () => Promise<void>; // Custom handler
}

const PermissionPrompt: React.FC<PermissionPromptProps> = ({
  onClose = () => {},
  requiredPermission,
  switchToTextTab,
  onPermissionRequest,
}) => {
  const { requestPermissions } = usePermissions();
  const [isPermissionBlocked, setIsPermissionBlocked] = React.useState(false);

  // Check if permission is already blocked
  React.useEffect(() => {
    const checkPermissionStatus = async () => {
      try {
        let permissionName: PermissionName;

        if (requiredPermission === "camera") {
          permissionName = "camera" as PermissionName;
        } else if (requiredPermission === "audio") {
          permissionName = "microphone" as PermissionName;
        } else {
          // For "both", check camera first
          permissionName = "camera" as PermissionName;
        }

        const result = await navigator.permissions.query({
          name: permissionName,
        });

        if (result.state === "denied") {
          setIsPermissionBlocked(true);
        }
      } catch (err) {
        throw err;
      }
    };

    checkPermissionStatus();
  }, [requiredPermission]);

  const handlePrivacySettings = async () => {
    try {
      if (onPermissionRequest) {
        // Use custom handler if provided
        await onPermissionRequest();
      } else {
        // Use default hook
        await requestPermissions(requiredPermission);
      }
      onClose();
    } catch (error) {
      console.error("Error requesting permissions:", error);

      // Jika permission di-block/ditolak, redirect ke text tab
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        if (typeof switchToTextTab === "function") {
          switchToTextTab();
        }
      }

      // Tetap tutup prompt meskipun ada error
      onClose();
    }
  };

  // Fungsi redirect ke TranslateInput saat tombol tutup diklik
  const handleClose = () => {
    // Hanya gunakan switchToTextTab jika tersedia
    if (typeof switchToTextTab === "function") {
      switchToTextTab();
    }
    onClose();
  };

  // Tentukan icon berdasarkan jenis izin yang diminta
  const PermissionIcon = () => {
    if (requiredPermission === "camera") {
      return <Camera size={36} className="text-blue-500" />;
    } else if (requiredPermission === "audio") {
      return <Mic size={36} className="text-blue-500" />;
    } else {
      return (
        <div className="flex space-x-2">
          <Camera size={32} className="text-blue-500" />
          <Mic size={32} className="text-blue-500" />
        </div>
      );
    }
  };

  if (isPermissionBlocked) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-gradient-to-b from-[#1E1E1E] to-[#121212] rounded-xl w-full max-w-md overflow-hidden border border-gray-800 shadow-xl transform transition-all animate-scaleIn">
          <div className="flex flex-col items-center p-6">
            <div className="bg-[#2A2A2A] p-4 rounded-full mb-4">
              {/* ✅ Gunakan PermissionIcon yang dinamis */}
              <PermissionIcon />
            </div>
            <h2 className="text-white text-2xl font-medium mb-3">
              {/* ✅ Buat title dinamis */}
              Akses{" "}
              {requiredPermission === "camera"
                ? "Kamera"
                : requiredPermission === "audio"
                ? "Mikrofon"
                : "Kamera dan Mikrofon"}{" "}
              Diblokir
            </h2>
            <p className="text-gray-300 text-center mb-6">
              {/* ✅ Buat description dinamis */}
              Izin{" "}
              {requiredPermission === "camera"
                ? "kamera"
                : requiredPermission === "audio"
                ? "mikrofon"
                : "kamera dan mikrofon"}{" "}
              telah diblokir. Untuk menggunakan fitur ini:
            </p>
            <div className="text-sm text-gray-400 text-left space-y-2 mb-6">
              <p>1. Klik ikon 🔒 di address bar</p>
              <p>
                2. Pilih "Izinkan" untuk{" "}
                {requiredPermission === "camera"
                  ? "Kamera"
                  : requiredPermission === "audio"
                  ? "Mikrofon"
                  : "Kamera dan Mikrofon"}
              </p>
              <p>3. Refresh halaman ini</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-5 border-t border-gray-800 bg-[#1A1A1A]">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              Refresh Halaman
            </button>
            <button
              onClick={handleClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-lg transition-colors"
            >
              Gunakan Input Teks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-b from-[#1E1E1E] to-[#121212] rounded-xl w-full max-w-md overflow-hidden border border-gray-800 shadow-xl transform transition-all animate-scaleIn">
        <div className="flex flex-col items-center p-6">
          <div className="bg-[#2A2A2A] p-4 rounded-full mb-4">
            <PermissionIcon />
          </div>
          <h2 className="text-white text-2xl font-medium mb-3">
            Kami memerlukan izin Anda
          </h2>
          <p className="text-gray-300 text-center mb-6">
            untuk menggunakan fitur ini, buka pengaturan privasi dan izinkan
            akses ke
            {requiredPermission === "camera"
              ? " kamera"
              : requiredPermission === "audio"
              ? " suara"
              : " kamera dan suara"}{" "}
            Anda.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 p-5 border-t border-gray-800 bg-[#1A1A1A]">
          <button
            onClick={handlePrivacySettings}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition-colors flex items-center justify-center"
          >
            <Settings size={18} className="mr-2" />
            Pengaturan Privasi
          </button>
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 rounded-full p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
            aria-label="Tutup"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18"></path>
              <path d="M6 6L18 18"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionPrompt;
