import CharacterCounter from "./CharacterCounter";

interface TranslateInputProps {
  inputText: string;
  maxChars: number;
  handleTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TranslateInput = ({
  inputText,
  maxChars,
  handleTextChange,
}: TranslateInputProps) => {
  return (
    <div className="flex-1 bg-[#12121C] flex flex-col">
      <div className="p-4 border-b border-gray-700 flex items-center justify-center gap-2 relative">
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full"
            aria-label="Bendera Indonesia"
          >
            <rect width="24" height="12" fill="#E70011" />
            <rect y="12" width="24" height="12" fill="#FFFFFF" />
          </svg>
        </div>
        <span>Bahasa Indonesia</span>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[11.5rem] h-0.5 bg-blue-500"></div>
      </div>
      <div className="flex-1 flex flex-col">
        <textarea
          value={inputText}
          onChange={handleTextChange}
          placeholder="ketik atau tempelkan teks di sini..."
          className="flex-1 bg-transparent p-4 text-white resize-none outline-none"
        ></textarea>
        <CharacterCounter
          currentLength={inputText.length}
          maxLength={maxChars}
        />
      </div>
    </div>
  );
};

export default TranslateInput;
