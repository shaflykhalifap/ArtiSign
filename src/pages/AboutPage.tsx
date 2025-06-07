import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AboutSidebar from "../components/layout/AboutSidebar";
import Container from "../components/common/Container";
import Footer from "../components/layout/Footer";
import AboutActive from "../components/about/AboutActive";
import CommunityActive from "../components/about/CommunityActive";
import TermsActive from "../components/about/TermsActive";
import PrivacyActive from "../components/about/PrivacyActive";
import AboutMobileMenu from "../components/about/AboutMobileMenu";

type AboutTab = "general" | "community" | "terms" | "privacy";

const AboutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AboutTab>("general");

  // Update activeTab based on URL
  useEffect(() => {
    const path = location.pathname;

    if (path === "/about") {
      setActiveTab("general");
    } else if (path.includes("/about/")) {
      const tab = path.split("/about/")[1] as AboutTab;
      setActiveTab(tab);
    }
  }, [location.pathname]);

  const handleSetActiveTab = (tab: AboutTab) => {
    setActiveTab(tab);
    navigate(`/about/${tab}`);
  };

  const handleBackToMenu = () => {
    navigate("/about");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "general":
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

  // Check if we're on the root /about path for mobile menu
  const showMobileMenu = location.pathname === "/about";

  return (
    <>
      <div className="flex flex-1 bg-[#1a1a1a] text-white min-h-screen">
        {/* Desktop: Sidebar */}
        <div className="hidden lg:block">
          <AboutSidebar
            activeTab={activeTab}
            setActiveTab={handleSetActiveTab}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 lg:ml-80">
          <div className="p-6 lg:p-12">
            <Container>
              {/* Mobile/Tablet: Show menu cards when on /about root or show content */}
              <div className="lg:hidden">
                {showMobileMenu ? (
                  <AboutMobileMenu setActiveTab={handleSetActiveTab} />
                ) : (
                  <div>
                    <button
                      onClick={handleBackToMenu}
                      className="flex items-center text-blue-400 hover:text-blue-300 mb-6"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      kembali ke menu
                    </button>
                    {renderContent()}
                  </div>
                )}
              </div>

              {/* Desktop: Always show content */}
              <div className="hidden lg:block">
                <div className="max-w-4xl">{renderContent()}</div>
              </div>
            </Container>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
