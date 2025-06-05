interface TranslateOutputProps {
  inputText: string;
}

const TranslateOutput = ({ inputText }: TranslateOutputProps) => {
  return (
    <div className="flex-1 bg-[#1F1F1F] flex flex-col">
      <div className="p-4 border-b bg-[#12121C] border-gray-700 flex items-center justify-center gap-2 relative">
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-[#313131]">
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full p-1"
            aria-label="Bahasa Isyarat"
            fill="currentColor"
          >
            <path d="M9.5,6.5C9.5,6.5 9.5,5.5 10.5,5.5C11.5,5.5 11.5,6.5 11.5,6.5V10.5H13.5V4.5C13.5,4.5 13.5,3.5 14.5,3.5C15.5,3.5 15.5,4.5 15.5,4.5V10.5H17.5V6.5C17.5,6.5 17.5,5.5 18.5,5.5C19.5,5.5 19.5,6.5 19.5,6.5V13.5C19.5,13.5 19.5,14.5 18.5,14.5L14.5,14.5C14.5,14.5 13.5,14.5 13,15L9.5,19C9.5,19 9,19.5 8,19.5C7,19.5 6.5,19 6.5,19L3.5,16C3.5,16 3,15.5 3,14.5C3,13.5 3.5,13 3.5,13L9,7.5C9,7.5 9.5,7 9.5,6.5Z" />
          </svg>
        </div>
        <span>Bahasa Isyarat</span>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[11.5rem] h-0.5 bg-blue-500"></div>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        {inputText ? (
          <div className="text-gray-300">
            {/* Here would go the sign language translation output */}
            {/* This could be an animation, video, or visualization */}
            <p>terjemahan akan muncul di sini</p>
          </div>
        ) : (
          <div className="text-gray-500 text-center">
            <p>terjemahan bahasa isyarat akan muncul di sini</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslateOutput;
