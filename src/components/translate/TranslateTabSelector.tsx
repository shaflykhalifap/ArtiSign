import { Type, Mic, Camera } from "lucide-react";

type TabType = "text" | "audio" | "camera";

interface TranslateTabSelectorProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TranslateTabSelector = ({
  activeTab,
  setActiveTab,
}: TranslateTabSelectorProps) => {
  return (
    <div className="bg-[#292A2C] inline-flex rounded-lg overflow-hidden">
      <button
        className={`px-5 py-2 flex items-center gap-2 ${
          activeTab === "text"
            ? "bg-[#111] text-white"
            : "text-gray-400 hover:bg-[#1f1f1f]"
        }`}
        onClick={() => setActiveTab("text")}
      >
        <Type size={18} />
        <span>teks</span>
      </button>
      <button
        className={`px-5 py-2 flex items-center gap-2 ${
          activeTab === "audio"
            ? "bg-[#111] text-white"
            : "text-gray-400 hover:bg-[#1f1f1f]"
        }`}
        onClick={() => setActiveTab("audio")}
      >
        <Mic size={18} />
        <span>suara</span>
      </button>
      <button
        className={`px-5 py-2 flex items-center gap-2 ${
          activeTab === "camera"
            ? "bg-[#111] text-white"
            : "text-gray-400 hover:bg-[#1f1f1f]"
        }`}
        onClick={() => setActiveTab("camera")}
      >
        <Camera size={18} />
        <span>kamera</span>
      </button>
    </div>
  );
};

export default TranslateTabSelector;
