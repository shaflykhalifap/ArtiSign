import { useState } from "react";
import CameraInput from "./CameraInput";
import TextOutput from "./TextOutput";

interface SignLanguageContainerProps {
  setActiveTab?: (tab: "text" | "audio" | "camera") => void;
}

const SignLanguageContainer = ({
  setActiveTab,
}: SignLanguageContainerProps = {}) => {
  const [outputText, setOutputText] = useState("");

  const handleTranslationResult = (result: string) => {
    setOutputText(result);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-0 rounded-xl overflow-hidden border border-gray-800">
      <CameraInput
        setInputText={handleTranslationResult}
        setActiveTab={setActiveTab}
      />
      <TextOutput outputText={outputText} />
    </div>
  );
};

export default SignLanguageContainer;
