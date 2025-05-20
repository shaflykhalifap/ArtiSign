import Sidebar from "../components/Sidebar";
import HeroSection from "../components/HeroSection";
import HighlightSection from "../components/HighlightSection";

const Home = () => {
  return (
    <div className="flex">
      <div className="fixed top-0 left-0 h-full">
        <Sidebar />
      </div>

      <div className="flex-1 ml-[180px]">
        <HeroSection />
        <HighlightSection />
      </div>
    </div>
  );
};

export default Home;
