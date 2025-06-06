import { useState } from "react";
import Footer from "../components/layout/Footer";
import TranslateTabSelector from "../components/translate/TranslateTabSelector";
import TranslateContainer from "../components/translate/TranslateContainer";

const TranslatePage = () => {
  const [activeTab, setActiveTab] = useState<"text" | "audio" | "camera">(
    "text"
  );
  const [inputText, setInputText] = useState("");
  const maxChars = 500;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setInputText(text);
    }
  };

  return (
    <>
      <div className="flex-1 bg-[#1a1a1a] text-white p-8 flex flex-col">
        <div className="max-w-4xl mx-auto w-full">
          <TranslateTabSelector
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Translation Interface */}
        <div className="max-w-4xl mx-auto w-full mt-6 flex-1 flex flex-col">
          <TranslateContainer
            inputText={inputText}
            maxChars={maxChars}
            handleTextChange={handleTextChange}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TranslatePage;
