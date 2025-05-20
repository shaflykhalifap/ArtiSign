import Sidebar from "../components/Sidebar";
import HeroSection from "../components/HeroSection";
import HighlightSection from "../components/HighlightSection";
import Footer from "../components/Footer";
import HomeFeature from "../components/HomeFeature";

const Home = () => {
  return (
    <div className="flex">
      <div className="fixed top-0 left-0 h-full z-10">
        <Sidebar />
      </div>

      <div className="flex-1 ml-[180px] flex flex-col min-h-screen">
        <div className="flex-1">
          <HeroSection />
          <HighlightSection />
          <HomeFeature />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
