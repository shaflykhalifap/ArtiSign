import { PlusCircle, Trash2, X } from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
}

export default function ChatHistory() {
  const [chatSessions, setChatSessions] = useLocalStorage<ChatSession[]>(
    "chatHistory",
    []
  );

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: `Chat ${chatSessions.length + 1}`,
      createdAt: Date.now(),
    };

    setChatSessions([newChat, ...chatSessions]);
  };

  const deleteChat = (id: string) => {
    setChatSessions(chatSessions.filter((chat) => chat.id !== id));
  };

  const clearHistory = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua riwayat chat?")) {
      localStorage.removeItem("chatHistory");
      setChatSessions([]);
    }
  };

  return (
    <div className="bg-[#2c2c2c] text-white p-4 rounded-xl mt-4 w-full max-w-md">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={createNewChat}
          className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={16} className="mr-2" />
          chat baru
        </button>
        <button
          onClick={clearHistory}
          className="text-sm flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <Trash2 size={16} className="mr-1" />
          hapus riwayat
        </button>
      </div>

      {chatSessions.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-2">
          belum ada riwayat chat
        </p>
      ) : (
        <div className="max-h-48 overflow-y-auto">
          {chatSessions.map((chat) => (
            <div
              key={chat.id}
              className="bg-blue-700 p-2 rounded text-sm mt-2 cursor-pointer hover:bg-blue-800 transition-colors relative flex justify-between items-center"
            >
              <div className="flex-grow">{chat.title}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                className="text-gray-300 hover:text-white ml-2"
                title="Delete chat"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
