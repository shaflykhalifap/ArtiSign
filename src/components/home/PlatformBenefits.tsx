import React from "react";
import Container from "../common/Container";
import {
  Users,
  Zap,
  Shield,
  Globe,
  Heart,
  Lightbulb,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  gradient: string;
}

const benefits: Benefit[] = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "aksesibilitas universal",
    description:
      "memungkinkan komunikasi yang lebih inklusif antara komunitas tuli dan mendengar di indonesia.",
    color: "text-blue-400",
    gradient: "from-blue-500/20 to-blue-600/20",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "real-time translation",
    description:
      "terjemahan instan dengan teknologi AI yang memberikan hasil akurat dalam hitungan detik.",
    color: "text-yellow-400",
    gradient: "from-yellow-500/20 to-orange-500/20",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "open source & gratis",
    description:
      "platform terbuka yang dapat diakses siapa saja tanpa biaya dan dapat dikembangkan bersama komunitas.",
    color: "text-green-400",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "mendukung bisindo",
    description:
      "fokus pada bahasa isyarat indonesia (bisindo) untuk melestarikan budaya dan bahasa lokal.",
    color: "text-purple-400",
    gradient: "from-purple-500/20 to-indigo-500/20",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "dampak sosial",
    description:
      "berkontribusi dalam menciptakan masyarakat yang lebih inklusif dan ramah bagi penyandang disabilitas.",
    color: "text-pink-400",
    gradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "inovasi berkelanjutan",
    description:
      "teknologi yang terus berkembang dengan penelitian dan pengembangan yang berkelanjutan.",
    color: "text-cyan-400",
    gradient: "from-cyan-500/20 to-teal-500/20",
  },
];

const PlatformBenefits: React.FC = () => {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:py-32 bg-transparent text-white relative overflow-hidden">
      <Container>
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>manfaat platform</span>
            </div>

            <h2 className="text-2xl font-bold mb-6 leading-tight">
              mengapa{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600">
                artisign
              </span>
              <span className="text-white">?</span>
            </h2>

            <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              platform yang tidak hanya menerjemahkan bahasa, tetapi juga{" "}
              <span className="text-blue-400 font-medium">
                membangun jembatan komunikasi
              </span>{" "}
              untuk menciptakan dunia yang lebih inklusif.
            </p>

            <div className="mt-6 w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative p-6 md:p-8 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
              >
                {/* Simple Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
                ></div>

                {/* Icon Container */}
                <div
                  className={`relative z-10 inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 ${benefit.color} bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl mb-4 md:mb-6 transition-colors duration-300`}
                >
                  {benefit.icon}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-gray-100 group-hover:text-white transition-colors duration-300">
                    {benefit.title}
                  </h3>

                  <p className="text-gray-400 text-sm md:text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {benefit.description}
                  </p>
                </div>

                {/* Simple Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className={`w-5 h-5 ${benefit.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PlatformBenefits;
