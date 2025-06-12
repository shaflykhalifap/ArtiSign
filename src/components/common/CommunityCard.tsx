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
    <div className="h-full">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col gap-2 p-4 rounded-xl border border-gray-700 hover:bg-gray-800 transition-all h-full"
      >
        <div className="relative">
          <div
            className={`absolute -inset-3 w-16 h-16 rounded-xl ${bgColor} blur-xl opacity-20`}
          ></div>

          <div
            className={`absolute -inset-1 w-12 h-12 rounded-lg ${bgColor} blur-lg opacity-50`}
          ></div>

          <div
            className={`absolute inset-0 w-10 h-10 rounded-lg ${bgColor} blur-sm opacity-50`}
          ></div>

          <div
            className={`relative w-10 h-10 flex items-center justify-center rounded-lg ${bgColor} z-10`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="space-y-2 flex-1">
          <p className="text-white font-semibold lowercase">{title}</p>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </a>
    </div>
  );
};

export default CommunityCard;
