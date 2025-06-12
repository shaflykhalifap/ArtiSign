import Chatbox from "../components/chatbot/Chatbox";
import ChatInput from "../components/chatbot/ChatInput";
import FAQSection from "../components/chatbot/FAQSection";
import ChatHistory from "../components/chatbot/ChatHistory";

const ChatbotPage: React.FC = () => {
  const handleSendMessage = (message: string) => {
    alert(`Message sent: ${message}`);
  };

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-white">
      <main className="flex flex-1 flex-col lg:flex-row justify-between p-6 overflow-hidden">
        <div className="flex flex-col justify-between w-full lg:w-2/3 h-full">
          <div className="flex-grow overflow-hidden flex flex-col">
            <div className="flex-grow overflow-y-auto">
              <Chatbox />
            </div>
            <div className="mt-auto">
              <ChatInput onSendMessage={handleSendMessage} />
              <p className="text-xs mt-1 text-center text-gray-400">
                Respon bisa saja tidak akurat. Tolong di cek kembali.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-4 lg:mt-0 lg:ml-4">
          <FAQSection />
          <ChatHistory />
        </div>
      </main>
    </div>
  );
};

export default ChatbotPage;
