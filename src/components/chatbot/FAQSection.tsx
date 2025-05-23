import { ChevronDown, ChevronUp } from "lucide-react";
import faqs from "../../data/FAQChatbotData";
import useAccordion from "../../hooks/useAccordion";

const FAQSection: React.FC = () => {
  const { openIndex, toggleItem } = useAccordion();

  return (
    <div className="bg-[#2c2c2c] text-white p-4 rounded-xl w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">AI Chatbot</h2>

      {faqs.map((item, idx) => (
        <div
          key={idx}
          className="mb-2 border-b border-gray-700 last:border-b-0"
        >
          <button
            onClick={() => toggleItem(idx)}
            className="w-full text-left flex justify-between items-center py-3 cursor-pointer hover:text-blue-400 transition-colors"
          >
            <span className="font-medium">{item.question}</span>
            {openIndex === idx ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === idx
                ? "max-h-40 opacity-100 mb-3"
                : "max-h-0 opacity-0"
            }`}
          >
            <p className="text-sm text-gray-300 pl-2 border-l-2 border-blue-500">
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQSection;
