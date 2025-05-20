import Container from "./Container";
import { ArrowRight } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="px-6 py-16 md:py-24 bg-[#1a1a1a] text-white text-center">
      <Container>
        <h1 className="text-3xl md:text-4xl font-bold leading-snug mb-6">
          platform penerjemah <br />
          bahasa indonesia ke bahasa isyarat
        </h1>

        <p className="text-gray-300 text-base md:text-lg mb-10">
          sebuah platform open source yang dirancang untuk menerjemahkan teks
          bahasa indonesia secara real-time menjadi bahasa isyarat indonesia
          (BISINDO).
        </p>

        <div className="flex justify-center mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full inline-flex items-center transition">
            Mulai Sekarang
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
