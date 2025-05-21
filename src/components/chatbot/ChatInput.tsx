import { useState } from "react";
import { Globe, Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage?.(inputText);
    setInputText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center px-4 py-3 border-t border-gray-700"
    >
      <button type="button" className="text-white mr-2 hover:text-blue-400">
        <Globe size={20} />
      </button>
      <input
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="flex-1 bg-transparent border border-blue-500 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400"
        placeholder="Tanya apapun..."
      />
      <button
        type="submit"
        className="ml-2 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
        disabled={!inputText.trim()}
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default ChatInput;
