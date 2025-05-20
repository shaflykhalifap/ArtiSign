import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AboutSidebar from "../components/layout/AboutSidebar";
import Container from "../components/common/Container";
import Footer from "../components/layout/Footer";
import AboutActive from "../components/about/AboutActive";
import CommunityActive from "../components/about/CommunityActive";
import TermsActive from "../components/about/TermsActive";
import PrivacyActive from "../components/about/PrivacyActive";

type AboutTab = "about" | "community" | "terms" | "privacy";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState<AboutTab>("about");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/about/community") {
      setActiveTab("community");
    } else if (location.pathname === "/about/terms") {
      setActiveTab("terms");
    } else if (location.pathname === "/about/privacy") {
      setActiveTab("privacy");
    } else {
      setActiveTab("about");
    }
  }, [location.pathname]);

  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return <AboutActive />;
      case "community":
        return <CommunityActive />;
      case "terms":
        return <TermsActive />;
      case "privacy":
        return <PrivacyActive />;
      default:
        return <AboutActive />;
    }
  };

  return (
    <>
      <div className="flex flex-1 bg-[#1a1a1a] text-white">
        <AboutSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 p-12 ml-56">
          <Container>{renderContent()}</Container>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
