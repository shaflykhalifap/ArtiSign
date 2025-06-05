import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import PermissionPrompt from "../common/PermissionPrompt";
import { usePermissions } from "../../hooks/usePermission"; // Pastikan path ini benar

interface AudioInputProps {
  setInputText: (text: string) => void;
  setActiveTab?: (tab: "text" | "audio" | "camera") => void;
}

const AudioInput = ({
  setInputText,
  setActiveTab = () => {}, // Memberikan default function untuk prop opsional
}: AudioInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null); // State untuk pesan error

  // Menggunakan hook usePermissions
  // Asumsi hook Anda mengembalikan status izin dan fungsi untuk meminta izin
  // Jika nama properti berbeda, sesuaikan (misal, audioGranted, requestAudioPermissions)
  const { microphoneGranted, requestPermissions } = usePermissions();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // useEffect untuk menampilkan PermissionPrompt berdasarkan status izin
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Hanya tampilkan prompt jika izin belum diberikan
      // Asumsi 'microphoneGranted' adalah boolean yang merefleksikan status terkini.
      if (!microphoneGranted) {
        const permissionCheckTimer = setTimeout(() => {
          // Periksa lagi di dalam timeout, karena status bisa berubah cepat
          if (!microphoneGranted) {
            setShowPermissionPrompt(true);
          }
        }, 500); // Delay untuk efek dan memberi waktu status izin stabil
        return () => clearTimeout(permissionCheckTimer);
      } else {
        setShowPermissionPrompt(false); // Sembunyikan jika sudah diizinkan
      }
    }
  }, [microphoneGranted]); // Bergantung pada microphoneGranted

  // useEffect untuk timer perekaman
  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0); // Reset waktu saat mulai merekam
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      // Jika isRecording false, dan timer masih ada, bersihkan.
      // Ini juga akan menangani kasus ketika isRecording diubah jadi false dari luar effect.
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    // Cleanup function akan dipanggil saat isRecording berubah atau komponen unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRecording]); // Hanya bergantung pada isRecording

  const startRecording = async () => {
    setError(null); // Reset error sebelumnya

    // Periksa izin lagi sebelum mencoba memulai (opsional, getUserMedia juga akan meminta)
    // if (!microphoneGranted) {
    //   // Bisa panggil requestPermissions dari hook di sini, atau tampilkan prompt
    //   // await requestPermissions("audio"); // Sesuaikan dengan API hook Anda
    //   // Jika setelah itu microphoneGranted masih false, tangani errornya.
    //   // Untuk sekarang, kita biarkan getUserMedia yang menangani permintaan prompt browser.
    // }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = { mimeType: "audio/webm" }; // Contoh opsi, bisa disesuaikan
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunksRef.current, {
          type: options.mimeType,
        });

        // Hentikan semua track dari stream untuk melepaskan mikrofon sepenuhnya
        // Ini penting dilakukan setelah blob dibuat dan sebelum pemrosesan lanjut.
        stream.getTracks().forEach((track) => track.stop());

        // Simulasi proses speech-to-text
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (audioBlob.size === 0) {
          setError("Rekaman suara kosong, tidak ada yang diproses.");
          setInputText("");
        } else {
          setInputText(
            "Hasil transkripsi suara akan muncul di sini (simulasi). Ukuran blob: " +
              audioBlob.size +
              " bytes."
          );
        }
        setIsProcessing(false);
        audioChunksRef.current = []; // Bersihkan chunks setelah diproses
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setError("Terjadi kesalahan pada perekam media.");
        setIsRecording(false); // Pastikan state recording direset
        // Hentikan track jika ada error
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      let errorMessage = "Tidak dapat mengakses mikrofon.";
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          errorMessage =
            "Anda menolak izin akses mikrofon. Harap aktifkan di pengaturan browser.";
        } else if (
          err.name === "NotFoundError" ||
          err.name === "DevicesNotFoundError"
        ) {
          errorMessage =
            "Tidak ada mikrofon yang terdeteksi di perangkat Anda.";
        } else if (
          err.name === "NotReadableError" ||
          err.name === "TrackStartError"
        ) {
          errorMessage =
            "Mikrofon mungkin sedang digunakan oleh aplikasi lain atau ada masalah hardware.";
        } else {
          errorMessage = `Error (${err.name}): Gagal memulai perekaman.`;
        }
      }
      setError(errorMessage);
      setIsRecording(false); // Pastikan state recording direset
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop(); // Ini akan memicu onstop
      // Stream tracks akan dihentikan di dalam onstop handler setelah blob dibuat
    }
    // setIsRecording(false) akan memicu cleanup di useEffect untuk menghentikan timer.
    setIsRecording(false);
  };

  // Cleanup untuk media tracks saat komponen unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current) {
        const recorder = mediaRecorderRef.current;
        if (recorder.state === "recording") {
          recorder.stop(); // Memicu onstop
        }
        // Pastikan semua track dari stream recorder dihentikan jika masih ada
        // Ini penting jika unmount terjadi sebelum onstop sempat membersihkan stream
        if (recorder.stream) {
          recorder.stream.getTracks().forEach((track) => {
            if (track.readyState === "live") {
              // Hanya stop track yang masih aktif
              track.stop();
            }
          });
        }
      }
    };
  }, []);

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
        <span>Input Suara</span>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[11.5rem] h-0.5 bg-blue-500"></div>
      </div>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-6">
        {error && ( // Menampilkan pesan error
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
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 size={48} className="text-blue-500 animate-spin" />
            <p className="text-gray-300">Memproses rekaman suara...</p>
          </div>
        ) : isRecording ? (
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
            {/* Tombol stop bisa diintegrasikan ke tombol mic yang berdenyut atau tetap terpisah */}
            {/* <button
              onClick={stopRecording}
              className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Square size={16} fill="white" className="mr-2" />
              <span>Berhenti</span>
            </button> */}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6">
            <button
              onClick={startRecording}
              disabled={showPermissionPrompt} // Nonaktifkan jika prompt izin ditampilkan
              className="w-24 h-24 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Start recording"
            >
              <Mic size={48} className="text-white" />
            </button>
            <p className="text-gray-400 text-center max-w-xs">
              Tekan tombol mikrofon untuk mulai merekam suara Anda.
            </p>
          </div>
        )}
      </div>

      {showPermissionPrompt && (
        <PermissionPrompt
          requiredPermission="audio" // "audio" lebih umum untuk MediaDevices API
          onClose={() => {
            setShowPermissionPrompt(false);
            // Jika pengguna menutup prompt tanpa berinteraksi, mungkin beri tahu mereka
            // bahwa fitur tidak akan berfungsi tanpa izin.
            if (!microphoneGranted) {
              setError("Izin mikrofon diperlukan untuk menggunakan fitur ini.");
            }
          }}
          switchToTextTab={() => {
            // Logika dari diskusi sebelumnya: onClose di PermissionPrompt akan dipanggil dulu,
            // lalu switchToTextTab.
            setShowPermissionPrompt(false); // Pastikan prompt ditutup
            if (setActiveTab) {
              // Periksa apakah setActiveTab tersedia
              setActiveTab("text");
            }
          }}
          // Jika PermissionPrompt Anda menggunakan hook usePermissions internal:
          // Anda mungkin tidak perlu prop 'requestPermissions' di sini lagi,
          // karena PermissionPrompt akan menangani permintaan via tombol "Pengaturan Privasi"-nya.
          // Jika PermissionPrompt TIDAK menggunakan hook internalnya, Anda perlu meneruskan:
          // onAttemptGrant={async () => {
          //   await requestPermissions("audio"); // Sesuaikan dengan API hook Anda
          //   setShowPermissionPrompt(false); // Tutup setelah upaya
          // }}
        />
      )}
    </div>
  );
};

export default AudioInput;
