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
    <div className="bg-[#292A2C] inline-flex rounded-lg overflow-hidden w-full sm:w-auto">
      <button
        className={`flex-1 sm:flex-none px-2 sm:px-4 md:px-5 py-2 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base ${
          activeTab === "text"
            ? "bg-white/80 text-black font-medium"
            : "text-gray-400 hover:bg-[#1f1f1f]"
        }`}
        onClick={() => setActiveTab("text")}
      >
        <Type size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
        <span className="text-xs sm:text-sm md:text-base">teks</span>
      </button>
      <button
        className={`flex-1 sm:flex-none px-2 sm:px-4 md:px-5 py-2 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base ${
          activeTab === "audio"
            ? "bg-white/80 text-black font-medium"
            : "text-gray-400 hover:bg-[#1f1f1f]"
        }`}
        onClick={() => setActiveTab("audio")}
      >
        <Mic size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
        <span className="text-xs sm:text-sm md:text-base">suara</span>
      </button>
      <button
        className={`flex-1 sm:flex-none px-2 sm:px-4 md:px-5 py-2 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base ${
          activeTab === "camera"
            ? "bg-white/80 text-black font-medium"
            : "text-gray-400 hover:bg-[#1f1f1f]"
        }`}
        onClick={() => setActiveTab("camera")}
      >
        <Camera size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
        <span className="text-xs sm:text-sm md:text-base">kamera</span>
      </button>
    </div>
  );
};

export default TranslateTabSelector;
