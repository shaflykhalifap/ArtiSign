import Container from "./Container";

const HighlightSection = () => {
  return (
    <section className="px-6 py-16 md:py-24 bg-[#1a1a1a] text-white text-left">
      <Container>
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-wide font-mono">
            gratis. seru. akurat.
          </h2>

          <p className="text-gray-300">
            Platform ini 100% gratis digunakan oleh siapa pun — tanpa biaya
            langganan, tanpa batasan.
          </p>

          <p className="text-gray-300">
            Belajar Bahasa Isyarat menjadi lebih menyenangkan! Dengan tampilan
            yang ramah pengguna, animasi gerakan yang dinamis, dan fitur
            interaktif, kamu bisa belajar sambil bermain — cocok untuk semua
            kalangan.
          </p>

          <p className="text-gray-300">
            Terjemahan yang akurat dengan didukung oleh AI yang terus belajar
            dari data, memahami konteks kalimat, dan menyesuaikan dengan kaidah
            Bahasa Isyarat Indonesia (BISINDO), sehingga hasil terjemahan mudah
            dipahami.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default HighlightSection;
