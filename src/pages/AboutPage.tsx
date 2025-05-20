import { useState } from "react";
import AboutSidebar from "../components/layout/AboutSidebar";
import Container from "../components/common/Container";
import Footer from "../components/layout/Footer";
import AboutActive from "../components/about/AboutActive";
import CommunityActive from "../components/about/CommunityActive";

type AboutTab = "about" | "community" | "terms" | "privacy";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState<AboutTab>("about");

  return (
    <>
      <div className="flex flex-1 bg-[#1a1a1a] text-white">
        <AboutSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 p-8 ml-64">
          <Container>
            {activeTab === "about" && <AboutActive />}

            {activeTab === "community" && <CommunityActive />}

            {activeTab === "terms" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Ketentuan dan Etika</h1>
                <p className="text-gray-300">
                  Panduan penggunaan platform ArtiSign yang bertanggung jawab.
                </p>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Kebijakan Privasi</h1>
                <p className="text-gray-300">
                  Informasi tentang bagaimana kami mengelola data pengguna.
                </p>
              </div>
            )}
          </Container>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
