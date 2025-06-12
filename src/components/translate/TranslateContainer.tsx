import TranslateInput from "./TranslateInput";
import TranslateOutput from "./TranslateOutput";
import AudioInput from "./AudioInput";
import SignLanguageContainer from "./SignLanguageContainer";
import { Letter, Word } from "../../types/textTranslate";

interface TranslateContainerProps {
  inputText: string;
  maxChars: number;
  handleTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  activeTab: "text" | "audio" | "camera";
  setActiveTab?: (tab: "text" | "audio" | "camera") => void;
  availableLetters: Letter[];
  availableWords: Word[];
}

const TranslateContainer = ({
  inputText,
  maxChars,
  handleTextChange,
  activeTab,
  setActiveTab,
}: TranslateContainerProps) => {
  return (
    <div className="flex-1 flex flex-col md:flex-row gap-0 rounded-xl overflow-hidden border border-gray-800">
      {activeTab === "text" ? (
        <TranslateInput
          inputText={inputText}
          maxChars={maxChars}
          handleTextChange={handleTextChange}
        />
      ) : activeTab === "audio" ? (
        <AudioInput
          setInputText={(text: string) => {
            const e = {
              target: { value: text },
            } as React.ChangeEvent<HTMLTextAreaElement>;
            handleTextChange(e);
          }}
          setActiveTab={setActiveTab}
        />
      ) : (
        <SignLanguageContainer setActiveTab={setActiveTab} />
      )}
      {activeTab !== "camera" && <TranslateOutput inputText={inputText} />}
    </div>
  );
};

export default TranslateContainer;
