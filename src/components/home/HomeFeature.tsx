import Container from "../common/Container";
import FeatureCard from "../common/FeatureCard";

const HomeFeature = () => {
  const features = [
    {
      title: "penerjemah real-time",
      description:
        "terjemahkan teks bahasa indonesia ke bahasa isyarat dengan cepat, akurat, dan memudahkan komunikasi tanpa hambatan",
      image: "/assets/img/card-1-translate.png",
      alt: "ilustrasi fitur penerjemah teks ke bahasa isyarat",
    },
    {
      title: "ai chatbot",
      description:
        "temukan jawaban atau pelajari lebih dalam tentang bahasa isyarat dengan ngobrol langsung bersama ai",
      image: "/assets/img/card-2-chatbot.png",
      alt: "ilustrasi chatbot bahasa isyarat",
    },
    {
      title: "artikel edukatif",
      description:
        "pelajari dasar-dasar bahasa isyarat melalui artikel yang informatif",
      image: "/assets/img/card-3-article.png",
      alt: "ilustrasi artikel belajar bahasa isyarat",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#1a1a1a] text-white">
      <Container>
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          fitur unggulan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              image={feature.image}
              alt={feature.alt}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default HomeFeature;
