import { Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import Translate from "./pages/TranslatePage";
import Chatbot from "./pages/ChatbotPage";
import ArticlePage from "./pages/ArticlePage";
import AboutPage from "./pages/AboutPage";
import Sidebar from "./components/layout/Sidebar";
import AboutActive from "./components/about/AboutActive";
import TermsActive from "./components/about/TermsActive";
import PrivacyActive from "./components/about/PrivacyActive";
import CommunityActive from "./components/about/CommunityActive";

const App = () => {
  return (
    <div className="flex">
      <div className="fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </div>

      <div className="flex-1 ml-[180px] flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/translate" element={<Translate />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/article" element={<ArticlePage />} />
          <Route path="/about" element={<AboutPage />}>
            <Route index element={<AboutActive />} />
            <Route path="terms" element={<TermsActive />} />
            <Route path="privacy" element={<PrivacyActive />} />
            <Route path="community" element={<CommunityActive />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
