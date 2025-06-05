interface TextOutputProps {
  outputText: string;
}

const TextOutput = ({ outputText }: TextOutputProps) => {
  return (
    <div className="flex-1 bg-[#1F1F1F] flex flex-col">
      <div className="p-4 border-b bg-[#12121C] border-gray-700 flex items-center justify-center gap-2 relative">
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
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 h-0.5 bg-blue-500"></div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        {outputText ? (
          <div className="bg-[#212121] p-5 rounded-lg w-full max-w-md border border-gray-700">
            <p className="text-white text-lg leading-relaxed">{outputText}</p>
          </div>
        ) : (
          <div className="text-gray-500 text-center">
            <p>hasil terjemahan dari bahasa isyarat akan muncul di sini</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextOutput;
