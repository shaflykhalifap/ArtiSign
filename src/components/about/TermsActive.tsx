import { Link2 } from "lucide-react";
import { Link } from "react-router-dom";

const TermsActive = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-l font-bold text-white mb-2 flex items-center gap-2">
          ketentuan umum
          <Link2 size={16} className="text-white/60" />
        </h2>
        <p className="text-gray-300">
          Ketentuan ini hanya berlaku jika kamu menggunakan layanan resmi dari
          ArtiSign. Untuk penggunaan lain di luar domain resmi, silakan hubungi
          penyedia layanan masing-masing.
        </p>
      </section>
      <section>
        <h2 className="text-l font-bold text-white mb-2 flex items-center gap-2">
          penyimpanan
          <Link2 size={16} className="text-white/60" />
        </h2>
        <p className="text-gray-300">
          ArtiSign tidak menyimpan konten teks, video, atau hasil terjemahan
          secara permanen. Semua proses dilakukan secara real-time di memori
          (RAM) dan langsung dihapus setelah sesi selesai.
          <br />
          <br />
          Kami tidak memiliki <span>log unduhan</span> dan
          <span>tidak dapat mengidentifikasi pengguna</span>.
          <br />
          <br />
          <Link to="/about/privacy" className="underline cursor-pointer">
            Kamu bisa membaca lebih lanjut tentang privasi kami di kebijakan
            privasi ArtiSign.
          </Link>
        </p>
      </section>
      <section>
        <h2 className="text-l font-bold text-white mb-2 flex items-center gap-2">
          tanggung jawab pengguna
          <Link2 size={16} className="text-white/60" />
        </h2>
        <p className="text-gray-300">
          kamu (pengguna akhir) bertanggung jawab penuh atas apa yang kamu
          lakukan dengan alat kami, termasuk bagaimana kamu menggunakan dan
          menyebarkan konten hasil terjemahan.
          <br />
          penggunaan yang adil (fair use) dan atribusi yang benar akan memberi
          manfaat untuk semua pihak.
        </p>
      </section>
    </div>
  );
};

export default TermsActive;
