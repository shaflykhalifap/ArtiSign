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
              className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:from-blue-700 focus:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-400/50 text-white font-semibold px-8 py-4 rounded-2xl inline-flex items-center transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-105 transform overflow-hidden"
              tabIndex={0}
              autoFocus
              role="button"
              aria-label="Mulai menggunakan fitur terjemahan bahasa isyarat"
            >
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

              {/* Slide background dari kiri */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-900 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-2xl" />

              {/* Slide background dari kanan */}
              <div className="absolute inset-0 bg-gradient-to-l from-blue-700/50 to-transparent translate-x-[100%] group-hover:translate-x-0 transition-transform duration-400 ease-out rounded-2xl" />

              {/* Slide background dari atas */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/30 to-transparent translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-600 ease-out rounded-2xl" />

              {/* Diagonal slide effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-blue-500/20 to-blue-600/20 translate-x-[-100%] translate-y-[-100%] group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 ease-out rounded-2xl" />

              {/* Ripple effect */}
              <div className="absolute inset-0 bg-blue-400/20 rounded-full scale-0 group-hover:scale-[3] transition-transform duration-1000 ease-out opacity-0 group-hover:opacity-100" />

              {/* Border slide effect */}
              <div className="absolute inset-0 border-2 border-blue-300/50 rounded-2xl scale-110 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-out" />

              {/* Button content */}
              <span className="relative z-10 group-hover:text-blue-100 transition-colors duration-300">
                mulai sekarang
              </span>
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 group-hover:rotate-12 transition-transform duration-300 relative z-10" />

              {/* Multiple shine effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-900 ease-in-out rounded-2xl delay-100" />

              {/* Pulse effect */}
              <div className="absolute inset-0 bg-blue-400/10 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </NavLink>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
