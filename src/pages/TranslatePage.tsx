import { useState } from "react";
import Footer from "../components/layout/Footer";
import TranslateTabSelector from "../components/translate/TranslateTabSelector";
import TranslateContainer from "../components/translate/TranslateContainer";
import useFetch from "../hooks/useFetch";
import { getLetters, getWords } from "../api/endpoints";

const TranslatePage = () => {
  const [activeTab, setActiveTab] = useState<"text" | "audio" | "camera">(
    "text"
  );
  const [inputText, setInputText] = useState("");
  const maxChars = 500;

  // Custom Hooks
  const {
    data: letters,
    loading: lettersLoading,
    error: lettersError,
  } = useFetch(getLetters);
  const {
    data: words,
    loading: wordsLoading,
    error: wordsError,
  } = useFetch(getWords);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setInputText(text);
    }
  };

  // Loading State
  if (lettersLoading || wordsLoading) {
    return <div>Loading....</div>;
  }

  // Error State
  if (lettersError || wordsError) {
    return (
      <div className="max-w-4xl mx-auto w-full p-8 text-red-500">
        <h2>Error loading data</h2>
        <p>{lettersError || wordsError}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 bg-[#1a1a1a] text-white p-8 flex flex-col">
        <div className="max-w-4xl mx-auto w-full">
          <TranslateTabSelector
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        <div className="max-w-4xl mx-auto w-full mt-6 flex-1 flex flex-col">
          <TranslateContainer
            inputText={inputText}
            maxChars={maxChars}
            handleTextChange={handleTextChange}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            availableLetters={letters || []} // Gunakan data dari useFetch
            availableWords={words || []} // Gunakan data dari useFetch
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TranslatePage;
