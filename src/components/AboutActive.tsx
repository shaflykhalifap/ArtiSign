import { Link2 } from "lucide-react";

const AboutActive = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-l font-bold text-white mb-2 flex items-center gap-2">
          cara terbaik untuk berkomunikasi dengan semua orang
          <Link2 size={16} className="text-white/60" />
        </h2>
        <p className="text-gray-300">
          ArtiSign membantu kamu menerjemahkan teks bahasa Indonesia ke bahasa
          Isyarat Indonesia (BISINDO) dalam hitungan detik. cukup tempelkan
          kalimat atau paragraf, lalu nikmati animasi isyarat tangan dan panduan
          langkah demi langkah yang mudah diikuti.
          <br />
          <br />
          tidak ada iklan, pelacak, paywall, atau gangguan lainnya. hanya
          aplikasi web ringan yang dapat digunakan di mana saja dan kapan saja.
        </p>
      </section>
      <section>
        <h2 className="text-l font-bold text-white mb-2 flex items-center gap-2">
          motivasi
          <Link2 size={16} className="text-white/60" />
        </h2>
        <p className="text-gray-300">
          ArtiSign dibangun untuk memberdayakan komunikasi yang inklusif di
          Indonesia. kami percaya bahwa setiap orang—tuli, dengar, muda,
          tua—berhak mengakses informasi tanpa hambatan bahasa. dengan ArtiSign,
          belajar dan berbagi BISINDO menjadi semudah mengetik teks.
        </p>
      </section>
      <section>
        <h2 className="text-l font-bold text-white mb-2 flex items-center gap-2">
          cara kerja
          <Link2 size={16} className="text-white/60" />
        </h2>
        <ol className="list-decimal pl-8 text-gray-300 space-y-4 relative">
          <li className="pl-2">
            <div className="font-medium text-white">tempel & terjemahkan</div>
            <p className="mt-1">
              tempelkan teks Bahasa Indonesia ke kolom yang tersedia.
            </p>
          </li>
          <li className="pl-2">
            <div className="font-medium text-white">hasilkan animasi</div>
            <p className="mt-1">
              server kami akan mengubah setiap kata menjadi animasi gerakan
              BISINDO.
            </p>
          </li>
          <li className="pl-2">
            <div className="font-medium text-white">
              panduan langkah demi langkah
            </div>
            <p className="mt-1">
              selain video kamera, tersedia juga ilustrasi dan deskripsi gerakan
              untuk belajar mandiri.
            </p>
          </li>
        </ol>
      </section>
    </div>
  );
};

export default AboutActive;
