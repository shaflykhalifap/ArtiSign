import { useState } from "react";
import CameraInput from "./CameraInput";
import TextOutput from "./TextOutput";

const SignLanguageContainer = () => {
  const [outputText, setOutputText] = useState("");

  // Fungsi ini akan dipanggil oleh komponen CameraInput ketika
  // hasil terjemahan sudah siap (nanti akan diimplementasikan oleh tim ML)
  const handleTranslationResult = (result: string) => {
    setOutputText(result);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-0 rounded-xl overflow-hidden border border-gray-800">
      <CameraInput setInputText={handleTranslationResult} />
      <TextOutput outputText={outputText} />
    </div>
  );
};

export default SignLanguageContainer;
