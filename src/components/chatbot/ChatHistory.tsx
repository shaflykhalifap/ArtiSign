// components/ChatHistory.jsx
export default function ChatHistory() {
  return (
    <div className="bg-[#2c2c2c] text-white p-4 rounded-xl mt-4 w-full max-w-md">
      <div className="flex justify-between items-center mb-2">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-full">
          ＋ Chat Baru
        </button>
        <button className="text-sm">🗑️ Hapus riwayat</button>
      </div>
      <div className="bg-blue-700 p-2 rounded text-sm mt-2">
        Belajar BISINDO yang benar
      </div>
    </div>
  );
}
