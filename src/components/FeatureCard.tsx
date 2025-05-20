import Image from "./Image";

type FeatureCardProps = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

const FeatureCard = ({ title, description, image, alt }: FeatureCardProps) => {
  return (
    <div className="bg-[#111111] border border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="relative w-full h-48 mb-6">
        <Image
          src="/images/fitur1.png"
          alt="Ilustrasi Fitur"
          className="w-full h-48 rounded"
        />
      </div>
      <h3 className="text-lg font-bold font-mono mb-2">{title}</h3>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
  );
};

export default FeatureCard;
