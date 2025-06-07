import { Sparkles, Users, Scroll, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

type AboutTab = "general" | "community" | "terms" | "privacy";

interface AboutSidebarProps {
  activeTab: AboutTab;
  setActiveTab: (tab: AboutTab) => void;
}

const AboutSidebar = ({ activeTab, setActiveTab }: AboutSidebarProps) => {
  const navigate = useNavigate();

  const handleTabChange = (tab: AboutTab) => {
    console.log("Tab clicked:", tab);

    try {
      setActiveTab(tab);

      if (tab === "general") {
        navigate("/about/general");
      } else {
        navigate(`/about/${tab}`);
      }

      console.log("Navigation successful to:", `/about/${tab}`);
    } catch (error) {
      console.error("Error in handleTabChange:", error);
    }
  };

  console.log("Current activeTab:", activeTab);

  return (
    <aside className="hidden lg:block w-96 bg-[#1a1a1a] p-8 flex flex-col border-r border-gray-800 fixed top-0 left-44 bottom-0 z-10">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-lg font-bold text-white mb-2">tentang</h1>
          <div className="h-1 w-20 bg-blue-500" />
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-4">
          <button
            onClick={() => handleTabChange("general")}
            className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
              activeTab === "general"
                ? "bg-white text-black font-semibold"
                : "hover:bg-gray-800 text-white"
            }`}
            type="button"
          >
            <div className="p-2 bg-[#2A7CE1] rounded-lg flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span>apa itu ArtiSign?</span>
          </button>

          <button
            onClick={() => handleTabChange("community")}
            className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
              activeTab === "community"
                ? "bg-white text-black font-semibold"
                : "hover:bg-gray-800 text-white"
            }`}
            type="button"
          >
            <div className="p-2 bg-[#37AA41] rounded-lg flex items-center justify-center">
              <Users size={18} className="text-white" />
            </div>
            <span>komunitas & support</span>
          </button>

          <button
            onClick={() => handleTabChange("terms")}
            className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
              activeTab === "terms"
                ? "bg-white text-black font-semibold"
                : "hover:bg-gray-800 text-white"
            }`}
            type="button"
          >
            <div className="p-2 bg-gray-600 rounded-lg flex items-center justify-center">
              <Scroll size={18} className="text-white" />
            </div>
            <span>ketentuan & etika</span>
          </button>

          <button
            onClick={() => handleTabChange("privacy")}
            className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
              activeTab === "privacy"
                ? "bg-white text-black font-semibold"
                : "hover:bg-gray-800 text-white"
            }`}
            type="button"
          >
            <div className="p-2 bg-gray-600 rounded-lg flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <span>kebijakan privasi</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default AboutSidebar;
