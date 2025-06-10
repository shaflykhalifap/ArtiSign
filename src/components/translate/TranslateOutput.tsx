import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import signLanguageGestures from "../../data/SignLanguageGestures";
import { Character } from "../character/Character";

interface FingerData {
  rotation: [number, number, number];
  visible: boolean;
}

interface HandConfig {
  rotation: [number, number, number];
  position?: [number, number, number];
  fingerConfig: {
    thumb: FingerData;
    index: FingerData;
    middle: FingerData;
    ring: FingerData;
    pinky: FingerData;
  };
}

interface GestureConfig {
  leftHand?: HandConfig;
  rightHand?: HandConfig;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <spotLight position={[0, 10, 0]} intensity={0.5} angle={Math.PI / 4} />
    </>
  );
}

interface TranslateOutputProps {
  inputText: string;
}

const TranslateOutput: React.FC<TranslateOutputProps> = ({ inputText }) => {
  const [currentLetter, setCurrentLetter] = useState<string>("");
  const [currentGesture, setCurrentGesture] = useState<GestureConfig>(
    signLanguageGestures.DEFAULT
  );
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (inputText) {
      const letters = inputText
        .toUpperCase()
        .split("")
        .filter((char: string) => /[A-Z]/.test(char));

      if (letters.length > 0) {
        setIsTranslating(true);
        let currentIndex = 0;

        const updateLetter = () => {
          const letter = letters[currentIndex];
          setCurrentLetter(letter);

          const gesture =
            (signLanguageGestures as unknown as Record<string, GestureConfig>)[
              letter
            ] || signLanguageGestures.DEFAULT;
          setCurrentGesture(gesture);

          currentIndex = (currentIndex + 1) % letters.length;
        };

        updateLetter();
        intervalId = setInterval(updateLetter, 2500);
      } else {
        setCurrentLetter("");
        setCurrentGesture(signLanguageGestures.DEFAULT);
        setIsTranslating(false);
      }
    } else {
      setCurrentLetter("");
      setCurrentGesture(signLanguageGestures.DEFAULT);
      setIsTranslating(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [inputText]);

  return (
    <div className="flex-1 bg-[#1F1F1F] flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-[#12121C] border-gray-700 flex items-center justify-center gap-2 relative flex-shrink-0">
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-[#313131]">
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full p-1 text-blue-400"
            aria-label="Bahasa Isyarat"
            fill="currentColor"
          >
            <path d="M9.5,6.5C9.5,6.5 9.5,5.5 10.5,5.5C11.5,5.5 11.5,6.5 11.5,6.5V10.5H13.5V4.5C13.5,4.5 13.5,3.5 14.5,3.5C15.5,3.5 15.5,4.5 15.5,4.5V10.5H17.5V6.5C17.5,6.5 17.5,5.5 18.5,5.5C19.5,5.5 19.5,6.5 19.5,6.5V13.5C19.5,13.5 19.5,14.5 18.5,14.5L14.5,14.5C14.5,14.5 13.5,14.5 13,15L9.5,19C9.5,19 9,19.5 8,19.5C7,19.5 6.5,19 6.5,19L3.5,16C3.5,16 3,15.5 3,14.5C3,13.5 3.5,13 3.5,13L9,7.5C9,7.5 9.5,7 9.5,6.5Z" />
          </svg>
        </div>
        <span className="text-gray-200">Bahasa Isyarat BISINDO</span>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[13rem] h-0.5 bg-blue-500"></div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-0">
        {inputText ? (
          <>
            <div className="w-full h-2/3 mb-4">
              <Canvas
                camera={{ position: [0, 0.5, 2.5], fov: 50 }}
                className="rounded-lg"
              >
                <Lights />
                <Character currentGesture={currentGesture} />
                <OrbitControls
                  enableZoom={true}
                  enablePan={false}
                  maxDistance={5}
                  minDistance={1.5}
                />
              </Canvas>
            </div>

            <div className="text-center text-gray-300">
              <div className="flex items-center justify-center gap-2 mb-2">
                <p className="text-4xl font-bold text-blue-400 h-12 flex items-center">
                  {currentLetter}
                </p>
                {isTranslating && (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-400 mb-1">
                menampilkan huruf:{" "}
                <span className="text-blue-300 font-medium">
                  {currentLetter}
                </span>
              </p>
              <p className="text-sm text-gray-500">Teks: "{inputText}"</p>
              <p className="text-xs text-gray-600 mt-1">
                {currentGesture?.leftHand && currentGesture?.rightHand
                  ? "menggunakan kedua tangan"
                  : currentGesture?.leftHand
                  ? "menggunakan tangan kiri"
                  : currentGesture?.rightHand
                  ? "menggunakan tangan kanan"
                  : "posisi default"}
              </p>
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-center">
            <div className="w-full h-64 mb-4">
              <Canvas
                camera={{ position: [0, 0.5, 2.5], fov: 50 }}
                className="rounded-lg"
              >
                <Lights />
                <Character currentGesture={signLanguageGestures.DEFAULT} />
                <OrbitControls
                  enableZoom={true}
                  enablePan={false}
                  maxDistance={5}
                  minDistance={1.5}
                />
              </Canvas>
            </div>
            <p className="text-lg">
              masukkan teks untuk menerjemahkan ke bahasa isyarat
            </p>
            <p className="text-sm text-gray-600 mt-2">
              karakter 3D akan menampilkan gerakan BISINDO dengan kedua tangan
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslateOutput;
