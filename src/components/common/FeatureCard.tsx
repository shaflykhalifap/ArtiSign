import Image from "./Image";

type FeatureCardProps = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

const FeatureCard = ({ title, description, image, alt }: FeatureCardProps) => {
  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-400/30 hover:bg-white/8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

      {/* Content */}
      <div className="relative z-10">
        {/* Image container with modern styling */}
        <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden bg-white/5">
          <Image
            src={image}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Image overlay for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Title with modern typography */}
        <h3 className="text-xl font-bold font-mono mb-3 text-white/90 group-hover:text-blue-300 transition-colors duration-300 lowercase">
          {title}
        </h3>

        {/* Description with improved readability */}
        <p className="text-sm leading-relaxed text-white/60 group-hover:text-white/80 transition-colors duration-300">
          {description}
        </p>

        {/* Modern accent line */}
        <div className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500 ease-out mt-4 rounded-full" />
      </div>

      {/* Subtle glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </div>
  );
};

export default FeatureCard;
