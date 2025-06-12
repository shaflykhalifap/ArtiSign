import HeroSection from "../components/home/HeroSection";
import HighlightSection from "../components/home/HighlightSection";
import Footer from "../components/layout/Footer";
import HomeFeature from "../components/home/HomeFeature";
import PlatformBenefits from "../components/home/PlatformBenefits";

const HomePage = () => {
  return (
    <>
      <div className="flex-1">
        <HeroSection />
        <HighlightSection />
        <HomeFeature />
        <PlatformBenefits />
      </div>

      <Footer />
    </>
  );
};

export default HomePage;
