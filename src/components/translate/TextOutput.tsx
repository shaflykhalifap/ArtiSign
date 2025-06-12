interface TextOutputProps {
  staticPrediction: string | null;
  staticConfidence: number;
  dynamicPrediction: string | null;
  dynamicConfidence: number;
}

const TextOutput = ({
  staticPrediction,
  // staticConfidence,
  dynamicPrediction,
}: // dynamicConfidence,
TextOutputProps) => {
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

      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
        {staticPrediction || dynamicPrediction ? (
          <div className="w-full max-w-md space-y-4">
            {/* Static Prediction (Letters) */}
            {staticPrediction && (
              <div className="bg-[#212121] p-4 rounded-lg border border-yellow-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-yellow-400 text-sm font-medium">
                    huruf
                  </span>
                </div>
                <p className="text-white text-xl font-semibold mb-2">
                  {staticPrediction}
                </p>
                {/* <p className="text-yellow-300 text-sm">
                  Confidence: {Math.round(staticConfidence * 100)}%
                </p> */}
              </div>
            )}

            {/* Dynamic Prediction (Words/Sentences) */}
            {dynamicPrediction && (
              <div className="bg-[#212121] p-4 rounded-lg border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-green-400 text-sm font-medium">
                    kata/kalimat
                  </span>
                </div>
                <p className="text-white text-xl font-semibold mb-2">
                  {dynamicPrediction}
                </p>
                {/* <p className="text-green-300 text-sm">
                  confidence: {Math.round(dynamicConfidence * 100)}%
                </p> */}
              </div>
            )}
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
