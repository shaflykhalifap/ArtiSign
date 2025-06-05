import TranslateInput from "./TranslateInput";
import TranslateOutput from "./TranslateOutput";
import AudioInput from "./AudioInput";

interface TranslateContainerProps {
  inputText: string;
  maxChars: number;
  handleTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  activeTab: "text" | "audio" | "camera";
}

const TranslateContainer = ({
  inputText,
  maxChars,
  handleTextChange,
  activeTab,
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
        />
      ) : (
        // Camera input will be implemented later
        <div className="flex-1 bg-[#12121C] flex items-center justify-center">
          <p className="text-gray-400">Fitur kamera akan segera hadir</p>
        </div>
      )}
      <TranslateOutput inputText={inputText} />
    </div>
  );
};

export default TranslateContainer;
