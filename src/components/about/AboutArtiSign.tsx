const AboutArtiSign = () => {
  return (
    <main className="flex-1 p-10 space-y-8">
      <section>
        <h1 className="text-xl font-bold text-blue-300 mb-2">
          cara terbaik untuk berkomunikasi dengan semua orang 🔗
        </h1>
        <p className="text-gray-300">
          ArtiSign membantu kamu menerjemahkan teks Bahasa Indonesia ke Bahasa
          Isyarat Indonesia (BISINDO) dalam hitungan detik. Cukup tempelkan
          kalimat atau paragraf, lalu nikmati animasi isyarat tangan dan panduan
          langkah demi langkah yang mudah diikuti.
          <br />
          <br />
          Tidak ada iklan, pelacak, paywall, atau gangguan lainnya. Hanya
          aplikasi web ringan yang dapat digunakan di mana saja dan kapan saja.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-blue-300 mb-2">motivasi 🔗</h2>
        <p className="text-gray-300">
          ArtiSign dibangun untuk memberdayakan komunikasi yang inklusif di
          Indonesia. Kami percaya bahwa setiap orang—Tuli, dengar, muda,
          tua—berhak mengakses informasi tanpa hambatan bahasa. Dengan ArtiSign,
          belajar dan berbagi BISINDO menjadi semudah mengetik teks.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-blue-300 mb-2">cara kerja 🔗</h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2">
          <li>
            tempel & terjemahkan
            <br />
            <span className="ml-4">
              tempelkan teks Bahasa Indonesia ke kolom yang tersedia.
            </span>
          </li>
          <li>
            hasilkan animasi
            <br />
            <span className="ml-4">
              server kami akan mengubah setiap kata menjadi animasi gerakan
              BISINDO.
            </span>
          </li>
          <li>
            panduan langkah demi langkah
            <br />
            <span className="ml-4">
              selain video kamera, tersedia juga ilustrasi dan deskripsi gerakan
              untuk belajar mandiri.
            </span>
          </li>
        </ol>
      </section>
    </main>
  );
};

export default AboutArtiSign;
