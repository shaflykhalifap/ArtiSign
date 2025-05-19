import Sidebar from "../components/Sidebar";
import HeroSection from "../components/HeroSection";

const Beranda = () => {
  return (
    <div className="flex">
      <div className="fixed top-0 left-0 h-full">
        <Sidebar />
      </div>

      <div className="flex-1 ml-[180px]">
        <HeroSection />
      </div>
    </div>
  );
};

export default Beranda;
