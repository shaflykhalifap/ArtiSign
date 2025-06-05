import React from "react";
import { usePermissions } from "../../hooks/usePermission";
import { Camera, Mic, Settings } from "lucide-react";

interface PermissionPromptProps {
  onClose?: () => void;
  requiredPermission: "camera" | "audio" | "both";
  switchToTextTab?: () => void;
}

const PermissionPrompt: React.FC<PermissionPromptProps> = ({
  onClose = () => {},
  requiredPermission,
  switchToTextTab,
}) => {
  const { requestPermissions } = usePermissions();
  //   const navigate = useNavigate(); // Hook untuk navigasi

  const handlePrivacySettings = () => {
    requestPermissions(requiredPermission).then(() => {
      onClose();
    });
  };

  // Fungsi redirect ke TranslateInput saat tombol tutup diklik
  const handleClose = () => {
    console.log("handleClose dipanggil");
    onClose();

    // Hanya gunakan switchToTextTab jika tersedia
    if (typeof switchToTextTab === "function") {
      console.log("Memanggil switchToTextTab");
      switchToTextTab();
    }
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

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-b from-[#1E1E1E] to-[#121212] rounded-xl w-full max-w-md overflow-hidden border border-gray-800 shadow-xl transform transition-all animate-scaleIn">
        <div className="flex flex-col items-center p-6">
          <div className="bg-[#2A2A2A] p-4 rounded-full mb-4">
            <PermissionIcon />
          </div>
          <h2 className="text-white text-2xl font-medium mb-3">
            kami memerlukan izin Anda
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
            onClick={handleClose} // Ganti onClose dengan handleClose
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
