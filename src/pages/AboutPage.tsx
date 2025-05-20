import { useState } from "react";
import AboutSidebar from "../components/AboutSidebar";
import Container from "../components/Container";
import Footer from "../components/Footer";
import AboutActive from "../components/AboutActive";

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

            {activeTab === "community" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Komunitas & Support</h1>
                <p className="text-gray-300">
                  Bergabunglah dengan komunitas kami untuk berkolaborasi dan
                  mendapatkan bantuan dari pengguna lain.
                </p>
              </div>
            )}

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
