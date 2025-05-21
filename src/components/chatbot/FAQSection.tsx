import { ThumbsUp, ThumbsDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQSection: React.FC = () => {
  const faqs: FaqItem[] = [
    { q: "Apa itu AI Chatbot?", a: "AI Chatbot adalah..." },
    { q: "Manfaat AI Chatbot?", a: "Manfaatnya antara lain..." },
    { q: "Apakah privasi terjaga?", a: "Ya, data Anda aman..." },
  ];

  return (
    <div className="bg-[#2c2c2c] text-white p-4 rounded-xl w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">AI Chatbot</h2>
      {faqs.map((item, idx) => (
        <details key={idx} className="mb-2">
          <summary className="cursor-pointer py-1">{item.q}</summary>
          <p className="ml-4 text-sm mt-1">{item.a}</p>
        </details>
      ))}
      <div className="mt-4 text-sm flex items-center">
        Tanggapan Anda soal Chatbot ini?
        <button className="ml-2">
          <ThumbsUp size={16} />
        </button>
        <button className="ml-1">
          <ThumbsDown size={16} />
        </button>
      </div>
    </div>
  );
};

export default FAQSection;
