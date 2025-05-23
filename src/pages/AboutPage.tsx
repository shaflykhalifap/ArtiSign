import AboutSidebar from "../components/layout/AboutSidebar";
import Container from "../components/common/Container";
import Footer from "../components/layout/Footer";
import AboutActive from "../components/about/AboutActive";
import CommunityActive from "../components/about/CommunityActive";
import TermsActive from "../components/about/TermsActive";
import PrivacyActive from "../components/about/PrivacyActive";
import { useActiveTab } from "../hooks/useActiveTab";

const AboutPage = () => {
  const { activeTab, setActiveTab } = useActiveTab("about");

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
