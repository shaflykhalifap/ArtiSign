import { Link2 } from "lucide-react";

const PrivacyActive = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-l font-bold text-white mb-2 flex items-center gap-2">
          syarat umum
          <Link2 size={16} className="text-white/60" />
        </h2>
        <p className="text-gray-300">
          kebijakan privasi ArtiSign itu sederhana: kami tidak mengumpulkan atau
          menyimpan informasi apapun tentang kamu. apa yang kamu lakukan
          sepenuhnya adalah urusanmu sendiri. kebijakan ini hanya berlaku untuk
          instansi resmi dari ArtiSign. Untuk instansi lain, silakan hubungi
          host terkait.
        </p>
      </section>
      <section>
        <h2 className="text-l font-bold text-white mb-2 flex items-center gap-2">
          pemrosesan di perangkat
          <Link2 size={16} className="text-white/60" />
        </h2>
        <p className="text-gray-300">
          alat yang menggunakan pemrosesan di perangkat akan berjalan secara
          lokal, offline, tanpa mengirim data ke mana pun. alat tersebut akan
          diberi tanda dengan jelas jika berlaku.
        </p>
      </section>
      <section>
        <h2 className="text-l font-bold text-white mb-2 flex items-center gap-2">
          penyimpanan (saving)
          <Link2 size={16} className="text-white/60" />
        </h2>
        <p className="text-gray-300">
          dalam beberapa kasus, ArtiSign dapat mengenkripsi dan menyimpan
          sementara informasi yang dibutuhkan untuk tunneling. data ini disimpan
          di RAM server pemrosesan selama 90 detik dan langsung dihapus secara
          permanen setelahnya. tidak ada yang bisa mengaksesnya, bahkan pemilik
          instansi resmi — selama mereka tidak memodifikasi gambar resmi
          ArtiSign
          <br />
          <br />
          file yang diproses tidak pernah di-cache di mana pun. semua proses
          dilakukan secara langsung. fitur penyimpanan ArtiSign pada dasarnya
          adalah layanan proxy canggih.
        </p>
      </section>
      <section>
        <h2 className="text-l font-bold text-white mb-2 flex items-center gap-2">
          enkripsi
          <Link2 size={16} className="text-white/60" />
        </h2>
        <p className="text-gray-300">
          data tunnel yang disimpan sementara akan dienkripsi menggunakan
          standar AES-256. kunci dekripsi hanya tersedia dalam tautan akses dan
          tidak pernah disimpan.
        </p>
      </section>
    </div>
  );
};

export default PrivacyActive;
