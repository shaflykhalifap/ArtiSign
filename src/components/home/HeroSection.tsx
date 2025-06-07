import React from "react";
import Container from "../common/Container";
import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router";

const HeroSection: React.FC = () => {
  return (
    <section className="px-6 py-24 md:py-32 bg-[#1a1a1a] text-white text-center">
      <Container>
        <div className="mt-12 md:mt-16">
          <h1 className="text-3xl md:text-4xl font-bold leading-snug mb-10">
            platform penerjemah <br />
            bahasa indonesia ke bahasa isyarat
          </h1>

          <p className="text-gray-300 text-base md:text-lg mb-12">
            sebuah platform open source yang dirancang untuk menerjemahkan teks
            bahasa indonesia secara real-time menjadi bahasa isyarat indonesia
            (BISINDO).
          </p>

          <div className="flex justify-center mt-12">
            <NavLink
              to="/translate"
              className="bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 text-white font-semibold px-6 py-3 rounded-full inline-flex items-center transition-all duration-200"
              tabIndex={0}
              autoFocus
              role="button"
              aria-label="Mulai menggunakan fitur terjemahan bahasa isyarat"
            >
              mulai sekarang
              <ArrowRight className="ml-2 w-4 h-4" />
            </NavLink>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
