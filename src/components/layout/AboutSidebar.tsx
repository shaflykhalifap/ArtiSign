import { Sparkles, Users, Scroll, ShieldCheck } from "lucide-react";

type AboutTab = "about" | "community" | "terms" | "privacy";

const AboutSidebar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: AboutTab;
  setActiveTab: (tab: AboutTab) => void;
}) => {
  return (
    <aside className="w-70 bg-[#1a1a1a] p-6 flex flex-col justify-between border-gray-800 fixed top-0 left-[180px] bottom-0">
      <div className="space-y-6">
        <nav className="space-y-4">
          <button
            onClick={() => setActiveTab("about")}
            className={`w-full text-left px-3 py-2 rounded transition flex items-center gap-2 ${
              activeTab === "about"
                ? "bg-[#D9D9D9] text-black font-semibold"
                : "hover:bg-gray-800"
            }`}
          >
            <div className="p-1.5 bg-[#2A7CE1] rounded flex items-center justify-center">
              <Sparkles size={18} color="#ffff" />
            </div>
            apa itu ArtiSign?
          </button>

          <button
            onClick={() => setActiveTab("community")}
            className={`w-full text-left px-3 py-2 rounded transition flex items-center gap-2 ${
              activeTab === "community"
                ? "bg-[#D9D9D9] text-black font-semibold"
                : "hover:bg-gray-800"
            }`}
          >
            <div className="p-1.5 bg-[#37AA41] rounded flex items-center justify-center">
              <Users size={18} color="#ffff" />
            </div>
            komunitas & support
          </button>

          <button
            onClick={() => setActiveTab("terms")}
            className={`w-full text-left px-3 py-2 rounded transition flex items-center gap-2 ${
              activeTab === "terms"
                ? "bg-[#D9D9D9] text-black font-semibold"
                : "hover:bg-gray-800"
            }`}
          >
            <div className="p-1.5 bg-white/60 rounded flex items-center justify-center">
              <Scroll size={18} color="#ffff" />
            </div>
            ketentuan & etika
          </button>

          <button
            onClick={() => setActiveTab("privacy")}
            className={`w-full text-left px-3 py-2 rounded transition flex items-center gap-2 ${
              activeTab === "privacy"
                ? "bg-[#D9D9D9] text-black font-semibold"
                : "hover:bg-gray-800"
            }`}
          >
            <div className="p-1.5 bg-white/60 rounded flex items-center justify-center">
              <ShieldCheck size={18} color="#ffff" />
            </div>
            kebijakan privasi
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default AboutSidebar;
