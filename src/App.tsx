// --- Import React and React Router DOM ---
import { Routes, Route } from "react-router-dom";

// --- Import Components ---
import HomePage from "./pages/HomePage";
import TranslatePage from "./pages/TranslatePage";
import ChatbotPage from "./pages/ChatbotPage";
import ArticlePage from "./pages/ArticlePage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import AboutPage from "./pages/AboutPage";
import Sidebar from "./components/layout/Sidebar";
import AboutActive from "./components/about/AboutActive";
import TermsActive from "./components/about/TermsActive";
import PrivacyActive from "./components/about/PrivacyActive";
import CommunityActive from "./components/about/CommunityActive";

const App = () => {
  return (
    <div
      className="
      /* Mobile/Tablet: Full width layout dengan bottom navigation */
      min-h-screen bg-[#1a1a1a] pb-20
      /* Desktop: Flex layout dengan sidebar */
      lg:flex lg:pb-0
    "
    >
      {/* Sidebar - Responsive */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        className="
        /* Mobile/Tablet: Full width, konten terpusat */
        w-full min-h-screen flex flex-col
        /* Desktop: Flex-1 setelah sidebar (tidak ada margin left) */
        lg:flex-1 lg:min-h-screen
      "
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/translate" element={<TranslatePage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/article" element={<ArticlePage />} />
          <Route path="/article/:id" element={<ArticleDetailPage />} />
          <Route path="/about" element={<AboutPage />}>
            <Route index element={<AboutActive />} />
            <Route path="terms" element={<TermsActive />} />
            <Route path="privacy" element={<PrivacyActive />} />
            <Route path="community" element={<CommunityActive />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
};

export default App;
