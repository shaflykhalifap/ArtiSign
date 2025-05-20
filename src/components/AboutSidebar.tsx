type AboutTab = "about" | "community" | "terms" | "privacy";

const AboutSidebar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: AboutTab;
  setActiveTab: (tab: AboutTab) => void;
}) => {
  return (
    <aside className="w-64 bg-[#1a1a1a] p-6 flex flex-col justify-between border-r border-gray-800">
      <div className="space-y-6">
        <nav className="space-y-4">
          <button
            onClick={() => setActiveTab("about")}
            className={`w-full text-left px-3 py-2 rounded transition ${
              activeTab === "about"
                ? "bg-white text-black font-semibold"
                : "hover:bg-gray-800"
            }`}
          >
            Apa itu ArtiSign?
          </button>
          <button
            onClick={() => setActiveTab("community")}
            className={`w-full text-left px-3 py-2 rounded transition flex items-center gap-2 ${
              activeTab === "community"
                ? "bg-white text-black font-semibold"
                : "hover:bg-gray-800"
            }`}
          >
            Komunitas & Support
          </button>
          <button
            onClick={() => setActiveTab("terms")}
            className={`w-full text-left px-3 py-2 rounded transition ${
              activeTab === "terms"
                ? "bg-white text-black font-semibold"
                : "hover:bg-gray-800"
            }`}
          >
            Ketentuan dan Etika
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`w-full text-left px-3 py-2 rounded transition ${
              activeTab === "privacy"
                ? "bg-white text-black font-semibold"
                : "hover:bg-gray-800"
            }`}
          >
            Kebijakan Privasi
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default AboutSidebar;
