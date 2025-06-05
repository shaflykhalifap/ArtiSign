import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

interface AudioInputProps {
  setInputText: (text: string) => void;
}

const AudioInput = ({ setInputText }: AudioInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  // timerRef masih bisa berguna jika Anda perlu mengakses ID interval di luar useEffect,
  // tapi untuk kasus ini, ID interval bisa dikelola di dalam scope useEffect.
  // Kita akan tetap menggunakan timerRef untuk konsistensi dengan kode awal.
  const timerRef = useRef<number | null>(null);

  // Mengelola timer berdasarkan state isRecording
  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0); // Reset waktu saat mulai merekam
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Fungsi cleanup untuk useEffect ini
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }
    // Jika isRecording false, cleanup dari atas (ketika isRecording true)
    // akan otomatis membersihkan interval.
    // Tidak perlu blok 'else' khusus untuk clearInterval di sini jika
    // transisi dari true ke false selalu ditangani oleh cleanup di atas.
  }, [isRecording]); // Hanya bergantung pada isRecording

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        // Simulasi proses speech-to-text
        setTimeout(() => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          // Di sini Anda akan mengirim audioBlob ke API Speech-to-Text
          // Contoh: const transcription = await yourSpeechToTextAPI(audioBlob);
          // setInputText(transcription);
          setInputText(
            "Hasil transkripsi suara akan muncul di sini (simulasi). Ukuran blob: " +
              audioBlob.size
          );
          setIsProcessing(false);
        }, 1500);
      };

      mediaRecorder.start();
      setIsRecording(true); // Ini akan memicu useEffect di atas untuk memulai timer
      // setRecordingTime(0); // Sudah dipindahkan ke useEffect
      // timerRef.current = window.setInterval(...); // Sudah dipindahkan ke useEffect
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Tidak dapat mengakses mikrofon. Pastikan browser diberi izin.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // isRecording check penting
      mediaRecorderRef.current.stop();
      // setIsRecording(false) akan memicu cleanup di useEffect untuk menghentikan timer.
      setIsRecording(false);

      // if (timerRef.current) { // Sudah dipindahkan ke cleanup useEffect
      //   clearInterval(timerRef.current);
      //   timerRef.current = null;
      // }

      // Stop all audio tracks - penting untuk melepaskan mic
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    }
  };

  // Cleanup untuk media tracks saat komponen unmount (jika masih merekam)
  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop(); // Ini akan memicu onstop
        if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream
            .getTracks()
            .forEach((track) => track.stop());
        }
      }
      // Timer juga akan dibersihkan oleh cleanup dari useEffect [isRecording] jika
      // isRecording true saat unmount, karena isRecording akan berubah statusnya
      // secara efektif saat komponen hilang.
      // Jika ingin lebih eksplisit, bisa tambahkan:
      // if (timerRef.current) {
      //   clearInterval(timerRef.current);
      // }
    };
  }, []); // Efek ini hanya untuk unmount

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex-1 bg-[#12121C] flex flex-col">
      <div className="p-4 border-b bg-[#12121C] border-gray-700 flex items-center justify-center gap-2 relative">
        {/* ... header ... */}
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full"
            aria-label="Input Audio"
          >
            <circle cx="12" cy="12" r="12" fill="#E70011" />
          </svg>
        </div>
        <span>Input Suara</span>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[11.5rem] h-0.5 bg-blue-500"></div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 size={48} className="text-blue-500 animate-spin" />
            <p className="text-gray-300">Memproses rekaman suara...</p>
          </div>
        ) : isRecording ? (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                <Mic size={48} className="text-red-500" />
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 px-3 py-1 rounded-full">
                <p className="text-sm font-mono">{formatTime(recordingTime)}</p>
              </div>
            </div>
            <p className="text-gray-300">Sedang merekam...</p>
            <button
              onClick={stopRecording}
              className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition-colors"
            >
              <Square size={16} fill="white" className="mr-2" />
              <span>Berhenti</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6">
            <button
              onClick={startRecording}
              className="w-24 h-24 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
            >
              <Mic size={48} className="text-white" />
            </button>
            <p className="text-gray-400 text-center max-w-md">
              Tekan tombol mikrofon untuk mulai merekam.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioInput;
