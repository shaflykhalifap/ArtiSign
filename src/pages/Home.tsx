import HeroSection from "../components/HeroSection";
import HighlightSection from "../components/HighlightSection";
import Footer from "../components/Footer";
import HomeFeature from "../components/HomeFeature";

const Home = () => {
  return (
    <>
      <div className="flex-1">
        <HeroSection />
        <HighlightSection />
        <HomeFeature />
      </div>

      <Footer />
    </>
  );
};

export default Home;
