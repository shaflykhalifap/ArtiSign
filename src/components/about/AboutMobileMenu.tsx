import {
  Sparkles,
  Users,
  Scroll,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

type AboutTab = "general" | "community" | "terms" | "privacy";

interface AboutMobileMenuProps {
  setActiveTab: (tab: AboutTab) => void;
}

const AboutMobileMenu = ({ setActiveTab }: AboutMobileMenuProps) => {
  const menuItems = [
    {
      id: "general" as AboutTab,
      title: "apa itu ArtiSign?",
      icon: Sparkles,
      bgColor: "#2A7CE1",
    },
    {
      id: "community" as AboutTab,
      title: "komunitas & support",
      icon: Users,
      bgColor: "#37AA41",
    },
    {
      id: "terms" as AboutTab,
      title: "ketentuan dan etika",
      icon: Scroll,
      bgColor: "#6B7280",
    },
    {
      id: "privacy" as AboutTab,
      title: "kebijakan privasi",
      icon: ShieldCheck,
      bgColor: "#6B7280",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">tentang</h1>
        <div className="h-1 w-20 bg-blue-500" />
      </div>

      <div className="space-y-3">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full bg-[#2A2A2A] hover:bg-[#333333] rounded-lg p-4 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className="p-2 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: item.bgColor }}
                >
                  <IconComponent size={20} className="text-white" />
                </div>
                <span className="text-white font-medium text-left">
                  {item.title}
                </span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AboutMobileMenu;
