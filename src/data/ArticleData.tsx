export interface Article {
  id: string;
  image: string;
  title: string;
  date: string;
  version: string;
  content: React.ReactNode;
}

const articlesData: Article[] = [
  {
    id: "pentingnya-ajarkan-bahasa-isyarat",
    image: "../assets/img/artikel-footage-1.jpg",
    title: "pentingnya ajarkan anak-anak bahasa isyarat",
    date: "senin | 19 mei, 2025",
    version: "1.0",
    content: (
      <>
        <p className="mb-4">
          Mengajarkan bahasa isyarat kepada anak-anak memiliki banyak manfaat
          yang mungkin tidak disadari oleh banyak orang tua. Bahasa isyarat
          tidak hanya penting bagi anak-anak tunarungu, tetapi juga bagi
          anak-anak dengan pendengaran normal.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">Mengapa Penting?</h3>

        <p className="mb-4">
          Belajar bahasa isyarat dapat membantu perkembangan kognitif anak.
          Penelitian menunjukkan bahwa anak-anak yang diajarkan bahasa isyarat
          sejak dini memiliki kosakata yang lebih banyak dan kemampuan membaca
          yang lebih baik dibandingkan dengan anak-anak yang tidak diajarkan
          bahasa isyarat.
        </p>

        <p className="mb-4">
          Selain itu, mengajarkan bahasa isyarat juga dapat membantu anak-anak
          dalam mengembangkan empati dan pemahaman tentang keberagaman. Mereka
          akan belajar bahwa ada berbagai cara untuk berkomunikasi dan bahwa
          setiap orang memiliki kebutuhan komunikasi yang berbeda-beda.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">Kapan Mulai Mengajar?</h3>

        <p className="mb-4">
          Anda dapat mulai mengajarkan bahasa isyarat kepada anak sejak usia
          yang sangat dini. Bayi secara alami menggunakan gerakan tangan untuk
          berkomunikasi sebelum mereka dapat berbicara. Dengan mengajarkan
          bahasa isyarat, Anda membantu mereka mengembangkan keterampilan
          komunikasi yang penting.
        </p>

        <p className="mb-4">
          Mulai dengan kata-kata sederhana seperti "makan", "minum", "tolong",
          dan "terima kasih". Gunakan bahasa isyarat secara konsisten saat Anda
          berbicara dengan anak Anda.
        </p>
      </>
    ),
  },
  {
    id: "mengenal-sibi-bisindo",
    image: "../assets/img/artikel-footage-2.webp",
    title: "mengenal bahasa isyarat di indonesia: SIBI dan BISINDO",
    date: "rabu | 21 mei, 2025",
    version: "1.1",
    content: (
      <>
        <p className="mb-4">
          Di Indonesia, terdapat dua sistem utama bahasa isyarat yang digunakan
          oleh komunitas Tuli, yaitu Sistem Isyarat Bahasa Indonesia (SIBI) dan
          Bahasa Isyarat Indonesia (BISINDO). Kedua sistem ini memiliki sejarah,
          karakteristik, dan konteks penggunaan yang berbeda.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">
          Sistem Isyarat Bahasa Indonesia (SIBI)
        </h3>

        <p className="mb-4">
          SIBI merupakan sistem bahasa isyarat yang dikembangkan oleh pemerintah
          Indonesia pada tahun 1994. SIBI mengacu pada struktur bahasa Indonesia
          dan merupakan sistem yang diakui secara resmi oleh pemerintah. Sistem
          ini biasanya diajarkan di sekolah-sekolah luar biasa (SLB) untuk
          anak-anak tunarungu.
        </p>

        <p className="mb-4">
          Karakteristik utama SIBI adalah struktur tata bahasanya yang mengikuti
          tata bahasa Indonesia baku. Setiap kata dalam bahasa Indonesia
          memiliki isyarat tersendiri, termasuk imbuhan seperti me-, di-, -kan,
          dan lain-lain.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">
          Bahasa Isyarat Indonesia (BISINDO)
        </h3>

        <p className="mb-4">
          BISINDO adalah bahasa isyarat yang berkembang secara alami di
          komunitas Tuli Indonesia. Berbeda dengan SIBI, BISINDO tidak
          diciptakan oleh pemerintah tetapi muncul dan berkembang dalam
          komunikasi sehari-hari komunitas Tuli.
        </p>

        <p className="mb-4">
          BISINDO memiliki struktur tata bahasa tersendiri yang berbeda dengan
          bahasa Indonesia. Bahasa ini lebih fleksibel dan natural bagi pengguna
          Tuli karena berkembang dari kebutuhan komunikasi mereka sehari-hari.
          BISINDO juga memiliki variasi regional, seperti bahasa lisan yang
          memiliki dialek-dialek tertentu.
        </p>
      </>
    ),
  },
  {
    id: "tiga-hal-bahasa-isyarat",
    image: "../assets/img/artikel-footage-3.jpg",
    title: "tiga hal yang harus diketahui mengenai bahasa isyarat",
    date: "kamis | 22 mei, 2025",
    version: "1.2",
    content: (
      <>
        <p className="mb-4">
          Bahasa isyarat adalah sistem komunikasi yang kompleks dan kaya yang
          digunakan oleh komunitas Tuli di seluruh dunia. Berikut adalah tiga
          hal penting yang perlu diketahui tentang bahasa isyarat.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">
          1. Bahasa Isyarat Adalah Bahasa yang Lengkap
        </h3>

        <p className="mb-4">
          Bahasa isyarat bukanlah sekadar representasi visual dari bahasa lisan.
          Bahasa isyarat memiliki tata bahasa, sintaksis, dan struktur
          linguistik tersendiri yang berbeda dari bahasa lisan. Bahasa isyarat
          dapat mengekspresikan konsep yang kompleks, abstrak, dan nuansa makna
          yang sama kayanya dengan bahasa lisan.
        </p>

        <p className="mb-4">
          Penelitian linguistik telah menunjukkan bahwa bahasa isyarat memiliki
          semua fitur yang mendefinisikan bahasa manusia, termasuk produktivitas
          (kemampuan untuk menciptakan kalimat baru), dualitas (kombinasi
          unit-unit dasar untuk membentuk makna), dan penggunaan aturan tata
          bahasa.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">
          2. Bahasa Isyarat Berbeda-beda di Setiap Negara
        </h3>

        <p className="mb-4">
          Tidak ada "satu bahasa isyarat universal" yang digunakan di seluruh
          dunia. Seperti halnya bahasa lisan, bahasa isyarat berkembang secara
          alami di komunitas Tuli yang berbeda-beda. American Sign Language
          (ASL), British Sign Language (BSL), Bahasa Isyarat Indonesia
          (BISINDO), dan Langue des Signes Française (LSF) adalah contoh bahasa
          isyarat yang berbeda.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">
          3. Ekspresi Wajah Adalah Bagian Penting dari Bahasa Isyarat
        </h3>

        <p className="mb-4">
          Dalam bahasa isyarat, ekspresi wajah bukan sekadar tambahan emosional
          pada komunikasi. Ekspresi wajah merupakan bagian integral dari tata
          bahasa bahasa isyarat. Ekspresi wajah dapat menandakan tanya,
          perintah, kondisional, dan berbagai aspek gramatikal lainnya.
        </p>

        <p className="mb-4">
          Mengabaikan ekspresi wajah dalam bahasa isyarat sama dengan
          mengabaikan intonasi dalam bahasa lisan, yang dapat mengubah makna
          kalimat secara signifikan.
        </p>
      </>
    ),
  },
  {
    id: "empati-bahasa-isyarat-sekolah",
    image: "../assets/img/artikel-footage-4.png",
    title: "mengajarkan empati lewat bahasa isyarat di sekolah",
    date: "senin | 26 mei, 2025",
    version: "1.3",
    content: (
      <>
        <p className="mb-4">
          Mengintegrasikan pembelajaran bahasa isyarat di sekolah umum bukan
          hanya bermanfaat bagi siswa tunarungu, tetapi juga dapat menjadi alat
          yang ampuh untuk mengajarkan empati kepada semua siswa. Program bahasa
          isyarat di sekolah dapat membantu menciptakan lingkungan yang lebih
          inklusif dan meningkatkan kesadaran tentang keberagaman.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">Pengembangan Empati</h3>

        <p className="mb-4">
          Ketika anak-anak belajar bahasa isyarat, mereka juga belajar untuk
          melihat dunia dari perspektif yang berbeda. Mereka mulai memahami
          bahwa tidak semua orang berkomunikasi dengan cara yang sama dan bahwa
          ada berbagai cara untuk mengekspresikan diri.
        </p>

        <p className="mb-4">
          Penelitian menunjukkan bahwa anak-anak yang diajarkan bahasa isyarat
          di sekolah menunjukkan peningkatan dalam empati dan kesadaran sosial.
          Mereka menjadi lebih sadar tentang kebutuhan orang lain dan lebih siap
          untuk membantu teman-teman mereka yang mungkin menghadapi kesulitan
          dalam komunikasi.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">
          Program Bahasa Isyarat di Sekolah
        </h3>

        <p className="mb-4">
          Ada berbagai cara untuk mengintegrasikan bahasa isyarat ke dalam
          kurikulum sekolah. Beberapa sekolah memilih untuk menawarkannya
          sebagai mata pelajaran khusus, sementara yang lain menggabungkannya ke
          dalam pelajaran bahasa atau seni.
        </p>

        <p className="mb-4">
          Program-program seperti "Klub Bahasa Isyarat" atau "Paduan Suara
          Bahasa Isyarat" juga dapat menjadi cara yang menyenangkan untuk
          melibatkan siswa dalam pembelajaran bahasa isyarat. Kegiatan-kegiatan
          ini tidak hanya mengajarkan keterampilan bahasa isyarat tetapi juga
          memfasilitasi interaksi sosial dan kerja sama tim.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">Dampak Jangka Panjang</h3>

        <p className="mb-4">
          Mengajarkan bahasa isyarat di sekolah dapat memiliki dampak jangka
          panjang yang signifikan. Siswa yang terpapar pada bahasa isyarat sejak
          dini lebih cenderung untuk menjadi orang dewasa yang inklusif dan
          empatik. Mereka juga lebih siap untuk berinteraksi dengan komunitas
          Tuli dan berkontribusi pada masyarakat yang lebih inklusif.
        </p>
      </>
    ),
  },
];

export const getArticleById = (id: string): Article | undefined => {
  return articlesData.find((article) => article.id === id);
};

export default articlesData;
