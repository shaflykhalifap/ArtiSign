import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

interface CommunityCardProps {
  icon: LucideIcon | IconType;
  title: string;
  description: string;
  link: string;
  bgColor: string;
}

const CommunityCard = (props: CommunityCardProps) => {
  const { icon: Icon, title, description, link, bgColor } = props;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-2 p-4 rounded-xl border border-gray-700 hover:bg-gray-800 transition-all w-xl max-w-xs"
    >
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-lg ${bgColor}`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="space-y-2">
        <p className="text-white font-semibold lowercase">{title}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </a>
  );
};

export default CommunityCard;
