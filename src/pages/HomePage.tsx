import HeroSection from "../components/home/HeroSection";
import HighlightSection from "../components/home/HighlightSection";
import Footer from "../components/layout/Footer";
import HomeFeature from "../components/home/HomeFeature";

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
