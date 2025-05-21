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
    image: "/assets/img/artikel-footage-1.jpg",
    title: "pentingnya ajarkan anak-anak bahasa isyarat",
    date: "senin | 19 mei, 2025",
    version: "1.1",
    content: (
      <>
        <p className="mb-4">
          mengajarkan bahasa isyarat kepada anak-anak memiliki banyak manfaat
          yang mungkin tidak disadari oleh banyak orang tua. bahasa isyarat
          tidak hanya penting bagi anak-anak tunarungu, tetapi juga bagi
          anak-anak dengan pendengaran normal.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">mengapa penting?</h3>

        <p className="mb-4">
          belajar bahasa isyarat dapat membantu perkembangan kognitif anak.
          penelitian menunjukkan bahwa anak-anak yang diajarkan bahasa isyarat
          sejak dini memiliki kosakata yang lebih banyak dan kemampuan membaca
          yang lebih baik dibandingkan dengan anak-anak yang tidak diajarkan
          bahasa isyarat.
        </p>

        <p className="mb-4">
          selain itu, mengajarkan bahasa isyarat juga dapat membantu anak-anak
          dalam mengembangkan empati dan pemahaman tentang keberagaman. mereka
          akan belajar bahwa ada berbagai cara untuk berkomunikasi dan bahwa
          setiap orang memiliki kebutuhan komunikasi yang berbeda-beda.
        </p>

        <p className="mb-4">
          bahasa isyarat juga dapat menjadi alat yang efektif untuk mengelola
          emosi anak. ketika anak kesulitan mengekspresikan perasaannya secara
          verbal, bahasa isyarat bisa menjadi jembatan komunikasi yang
          menenangkan dan mengurangi frustrasi.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">kapan mulai mengajar?</h3>

        <p className="mb-4">
          anda dapat mulai mengajarkan bahasa isyarat kepada anak sejak usia
          yang sangat dini. bayi secara alami menggunakan gerakan tangan untuk
          berkomunikasi sebelum mereka dapat berbicara. dengan mengajarkan
          bahasa isyarat, anda membantu mereka mengembangkan keterampilan
          komunikasi yang penting.
        </p>

        <p className="mb-4">
          mulai dengan kata-kata sederhana seperti "makan", "minum", "tolong",
          dan "terima kasih". gunakan bahasa isyarat secara konsisten saat anda
          berbicara dengan anak anda.
        </p>

        <p className="mb-4">
          seiring waktu, anda dapat menambahkan lebih banyak kosakata sesuai
          dengan perkembangan usia dan minat anak. penting untuk membuat proses
          belajar ini menyenangkan, seperti melalui lagu, permainan, atau cerita
          yang menggunakan bahasa isyarat.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">dukungan lingkungan</h3>

        <p className="mb-4">
          keberhasilan dalam mengajarkan bahasa isyarat juga bergantung pada
          dukungan dari lingkungan sekitar, termasuk keluarga besar, guru, dan
          pengasuh. ketika lingkungan turut serta menggunakan bahasa isyarat,
          anak akan merasa lebih percaya diri dan nyaman dalam berkomunikasi.
        </p>

        <p className="mb-4">
          orang tua juga bisa mencari komunitas atau kelompok belajar bahasa
          isyarat untuk memperluas pengalaman sosial anak dan mempererat relasi
          dengan keluarga lain yang memiliki tujuan serupa.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">kesimpulan</h3>

        <p className="mb-4">
          bahasa isyarat bukan hanya untuk anak-anak dengan kebutuhan khusus,
          tetapi bisa menjadi alat komunikasi universal yang memperkaya
          perkembangan anak secara keseluruhan. dengan mengajarkannya sejak
          dini, kita membantu anak-anak menjadi komunikator yang lebih baik,
          lebih peduli, dan lebih siap menghadapi dunia yang beragam.
        </p>
      </>
    ),
  },

  {
    id: "mengenal-sibi-bisindo",
    image: "/assets/img/artikel-footage-2.webp",
    title: "mengenal bahasa isyarat di indonesia: sibi dan bisindo",
    date: "rabu | 21 mei, 2025",
    version: "1.2",
    content: (
      <>
        <p className="mb-4">
          di indonesia, terdapat dua sistem utama bahasa isyarat yang digunakan
          oleh komunitas tuli, yaitu sistem isyarat bahasa indonesia (sibi) dan
          bahasa isyarat indonesia (bisindo). meskipun keduanya sama-sama
          digunakan oleh penyandang tuli, sibi dan bisindo memiliki sejarah,
          karakteristik, dan konteks penggunaan yang sangat berbeda.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">
          sistem isyarat bahasa indonesia (sibi)
        </h3>

        <p className="mb-4">
          sibi dikembangkan oleh pemerintah indonesia pada tahun 1994 sebagai
          sistem komunikasi yang merujuk langsung pada struktur bahasa indonesia
          baku. sibi dirancang untuk membantu proses pembelajaran formal, dan
          hingga kini masih digunakan secara luas di sekolah luar biasa (slb)
          yang menangani pendidikan bagi anak-anak tunarungu.
        </p>

        <p className="mb-4">
          ciri khas sibi adalah penggunaan isyarat yang disesuaikan dengan
          setiap kata dalam bahasa indonesia, termasuk imbuhan seperti me-, di-,
          -kan, dan lain-lain. hal ini menjadikan sibi lebih mirip dengan
          transliterasi bahasa indonesia ke dalam bentuk visual, bukan bahasa
          yang berkembang secara alami.
        </p>

        <p className="mb-4">
          meskipun sibi memiliki struktur yang rapi dan terstandarisasi,
          sebagian komunitas tuli merasa bahwa penggunaannya terasa kaku dan
          kurang mencerminkan cara mereka berkomunikasi sehari-hari.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">
          bahasa isyarat indonesia (bisindo)
        </h3>

        <p className="mb-4">
          bisindo adalah bahasa isyarat alami yang berkembang secara organik di
          kalangan komunitas tuli di berbagai wilayah indonesia. berbeda dengan
          sibi, bisindo tidak mengikuti tata bahasa indonesia, tetapi memiliki
          tata bahasa dan ekspresi visual yang khas dan lebih alami bagi
          penuturnya.
        </p>

        <p className="mb-4">
          bisindo tidak hanya digunakan dalam kehidupan sehari-hari oleh
          komunitas tuli, tetapi juga dianggap sebagai bagian penting dari
          identitas budaya mereka. bahasa ini memiliki beragam variasi regional,
          atau dialek, tergantung pada kota dan komunitas tempat bahasa ini
          digunakan — mirip seperti variasi dalam bahasa daerah.
        </p>

        <p className="mb-4">
          karena sifatnya yang alami dan fleksibel, banyak penyandang tuli
          merasa lebih nyaman menggunakan bisindo dalam percakapan sehari-hari.
          beberapa aktivis tuli juga mendorong pengakuan resmi bisindo sebagai
          bahasa isyarat utama di indonesia.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">penutup</h3>

        <p className="mb-4">
          memahami perbedaan antara sibi dan bisindo penting untuk membangun
          komunikasi yang inklusif dan efektif dengan komunitas tuli. baik sibi
          maupun bisindo memiliki peran dalam konteks masing-masing, namun
          mendukung keberadaan bisindo sebagai bahasa yang tumbuh dari komunitas
          tuli sendiri merupakan langkah besar menuju penghargaan akan
          keberagaman bahasa dan budaya di indonesia.
        </p>
      </>
    ),
  },

  {
    id: "tiga-hal-bahasa-isyarat",
    image: "/assets/img/artikel-footage-3.jpg",
    title: "tiga hal yang harus diketahui mengenai bahasa isyarat",
    date: "kamis | 22 mei, 2025",
    version: "1.2",
    content: (
      <>
        <p className="mb-4">
          bahasa isyarat adalah sistem komunikasi yang kompleks dan kaya yang
          digunakan oleh komunitas tuli di seluruh dunia. berikut adalah tiga
          hal penting yang perlu diketahui tentang bahasa isyarat.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">
          1. bahasa isyarat adalah bahasa yang lengkap
        </h3>

        <p className="mb-4">
          bahasa isyarat bukanlah sekadar representasi visual dari bahasa lisan.
          bahasa isyarat memiliki tata bahasa, sintaksis, dan struktur
          linguistik tersendiri yang berbeda dari bahasa lisan. bahasa isyarat
          dapat mengekspresikan konsep yang kompleks, abstrak, dan nuansa makna
          yang sama kayanya dengan bahasa lisan.
        </p>

        <p className="mb-4">
          penelitian linguistik telah menunjukkan bahwa bahasa isyarat memiliki
          semua fitur yang mendefinisikan bahasa manusia, termasuk produktivitas
          (kemampuan untuk menciptakan kalimat baru), dualitas (kombinasi
          unit-unit dasar untuk membentuk makna), dan penggunaan aturan tata
          bahasa.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">
          2. bahasa isyarat berbeda-beda di setiap negara
        </h3>

        <p className="mb-4">
          tidak ada "satu bahasa isyarat universal" yang digunakan di seluruh
          dunia. seperti halnya bahasa lisan, bahasa isyarat berkembang secara
          alami di komunitas tuli yang berbeda-beda. american sign language
          (asl), british sign language (bsl), bahasa isyarat indonesia
          (bisindo), dan langue des signes française (lsf) adalah contoh bahasa
          isyarat yang berbeda.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">
          3. ekspresi wajah adalah bagian penting dari bahasa isyarat
        </h3>

        <p className="mb-4">
          dalam bahasa isyarat, ekspresi wajah bukan sekadar tambahan emosional
          pada komunikasi. ekspresi wajah merupakan bagian integral dari tata
          bahasa bahasa isyarat. ekspresi wajah dapat menandakan tanya,
          perintah, kondisional, dan berbagai aspek gramatikal lainnya.
        </p>

        <p className="mb-4">
          mengabaikan ekspresi wajah dalam bahasa isyarat sama dengan
          mengabaikan intonasi dalam bahasa lisan, yang dapat mengubah makna
          kalimat secara signifikan.
        </p>
      </>
    ),
  },

  {
    id: "empati-bahasa-isyarat-sekolah",
    image: "/assets/img/artikel-footage-4.png",
    title: "mengajarkan empati lewat bahasa isyarat di sekolah",
    date: "senin | 26 mei, 2025",
    version: "1.4",
    content: (
      <>
        <p className="mb-4">
          mengintegrasikan pembelajaran bahasa isyarat di sekolah umum bukan
          hanya bermanfaat bagi siswa tunarungu, tetapi juga dapat menjadi alat
          yang ampuh untuk mengajarkan empati kepada semua siswa. program bahasa
          isyarat di sekolah dapat membantu menciptakan lingkungan yang lebih
          inklusif dan meningkatkan kesadaran tentang keberagaman.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">pengembangan empati</h3>

        <p className="mb-4">
          ketika anak-anak belajar bahasa isyarat, mereka juga belajar untuk
          melihat dunia dari perspektif yang berbeda. mereka mulai memahami
          bahwa tidak semua orang berkomunikasi dengan cara yang sama dan bahwa
          ada berbagai cara untuk mengekspresikan diri.
        </p>

        <p className="mb-4">
          penelitian menunjukkan bahwa anak-anak yang diajarkan bahasa isyarat
          di sekolah menunjukkan peningkatan dalam empati dan kesadaran sosial.
          mereka menjadi lebih sadar tentang kebutuhan orang lain dan lebih siap
          untuk membantu teman-teman mereka yang mungkin menghadapi kesulitan
          dalam komunikasi.
        </p>

        <p className="mb-4">
          selain itu, pembelajaran ini membuka ruang bagi diskusi tentang
          nilai-nilai kemanusiaan, penerimaan terhadap perbedaan, dan pentingnya
          komunikasi yang setara. anak-anak tidak hanya belajar bahasa isyarat
          sebagai keterampilan teknis, tetapi juga sebagai sarana membangun
          hubungan yang lebih dalam dan bermakna dengan sesama.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">
          program bahasa isyarat di sekolah
        </h3>

        <p className="mb-4">
          ada berbagai cara untuk mengintegrasikan bahasa isyarat ke dalam
          kurikulum sekolah. beberapa sekolah memilih untuk menawarkannya
          sebagai mata pelajaran khusus, sementara yang lain menggabungkannya ke
          dalam pelajaran bahasa atau seni.
        </p>

        <p className="mb-4">
          program-program seperti "klub bahasa isyarat" atau "paduan suara
          bahasa isyarat" juga dapat menjadi cara yang menyenangkan untuk
          melibatkan siswa dalam pembelajaran bahasa isyarat. kegiatan-kegiatan
          ini tidak hanya mengajarkan keterampilan bahasa isyarat tetapi juga
          memfasilitasi interaksi sosial dan kerja sama tim.
        </p>

        <p className="mb-4">
          sekolah juga dapat bekerja sama dengan komunitas tuli lokal atau
          organisasi disabilitas untuk menghadirkan pengalaman langsung bagi
          siswa, seperti lokakarya, pertunjukan, atau sesi berbagi cerita.
          pendekatan ini memperkuat hubungan antarindividu dan memberikan
          pemahaman yang lebih dalam tentang kehidupan sehari-hari teman-teman
          tuli.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">
          peran guru dan orang tua
        </h3>

        <p className="mb-4">
          guru berperan penting dalam menanamkan nilai empati lewat pembelajaran
          bahasa isyarat. dengan pendekatan yang kreatif dan inklusif, guru bisa
          mengintegrasikan bahasa isyarat dalam kegiatan belajar seperti
          menyanyi, bermain peran, atau bahkan saat menyampaikan instruksi
          harian.
        </p>

        <p className="mb-4">
          dukungan orang tua juga tak kalah penting. melibatkan orang tua
          melalui acara sekolah, pelatihan singkat, atau pertunjukan siswa dalam
          bahasa isyarat dapat memperkuat nilai-nilai positif ini di rumah,
          sehingga tercipta kesinambungan pembelajaran antara sekolah dan
          keluarga.
        </p>

        <h3 className="text-xl font-bold mb-3 mt-6">dampak jangka panjang</h3>

        <p className="mb-4">
          mengajarkan bahasa isyarat di sekolah dapat memiliki dampak jangka
          panjang yang signifikan. siswa yang terpapar pada bahasa isyarat sejak
          dini lebih cenderung untuk menjadi orang dewasa yang inklusif dan
          empatik. mereka juga lebih siap untuk berinteraksi dengan komunitas
          tuli dan berkontribusi pada masyarakat yang lebih inklusif.
        </p>

        <p className="mb-4">
          pendidikan yang menyertakan pembelajaran bahasa isyarat bukan hanya
          mencetak siswa yang cerdas secara akademik, tetapi juga membentuk
          karakter yang tangguh, terbuka, dan menghargai perbedaan. mereka akan
          tumbuh menjadi generasi yang mampu menjembatani kesenjangan sosial
          serta menciptakan dunia yang lebih ramah bagi semua.
        </p>
      </>
    ),
  },
];

export const getArticleById = (id: string): Article | undefined => {
  return articlesData.find((article) => article.id === id);
};

export default articlesData;
