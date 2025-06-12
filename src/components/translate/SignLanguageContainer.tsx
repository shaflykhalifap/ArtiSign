import { useState } from "react";
import CameraInput from "./CameraInput";
import TextOutput from "./TextOutput";

interface SignLanguageContainerProps {
  setActiveTab?: (tab: "text" | "audio" | "camera") => void;
}

const SignLanguageContainer = ({
  setActiveTab,
}: SignLanguageContainerProps = {}) => {
  const [staticPrediction, setStaticPrediction] = useState<string | null>(null);
  const [staticConfidence, setStaticConfidence] = useState<number>(0);
  const [dynamicPrediction, setDynamicPrediction] = useState<string | null>(
    null
  );
  const [dynamicConfidence, setDynamicConfidence] = useState<number>(0);

  const handleStaticPrediction = (prediction: string, confidence: number) => {
    setStaticPrediction(prediction);
    setStaticConfidence(confidence);
  };

  const handleDynamicPrediction = (prediction: string, confidence: number) => {
    setDynamicPrediction(prediction);
    setDynamicConfidence(confidence);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-0 rounded-xl overflow-hidden border border-gray-800">
      <CameraInput
        onStaticPrediction={handleStaticPrediction}
        onDynamicPrediction={handleDynamicPrediction}
        setActiveTab={setActiveTab}
      />
      <TextOutput
        staticPrediction={staticPrediction}
        staticConfidence={staticConfidence}
        dynamicPrediction={dynamicPrediction}
        dynamicConfidence={dynamicConfidence}
      />
    </div>
  );
};

export default SignLanguageContainer;
