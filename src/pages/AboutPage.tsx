import { useState } from "react";
import AboutSidebar from "../components/AboutSidebar";
import Container from "../components/Container";
import Footer from "../components/Footer";

type AboutTab = "about" | "community" | "terms" | "privacy";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState<AboutTab>("about");

  return (
    <>
      <div className="flex flex-1 bg-[#1a1a1a] text-white">
        <AboutSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 p-8">
          <Container>
            {activeTab === "about" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Apa itu ArtiSign?</h1>
                <p className="text-gray-300">
                  ArtiSign adalah platform penerjemah bahasa Indonesia ke bahasa
                  isyarat Indonesia (BISINDO) yang dirancang untuk membantu
                  komunikasi antara komunitas tuli dan dengar.
                </p>
                <p className="text-gray-300">
                  Dikembangkan dengan teknologi AI modern, ArtiSign mampu
                  menerjemahkan teks bahasa Indonesia menjadi animasi gerakan
                  bahasa isyarat yang akurat dan mudah dipahami.
                </p>
                <h2 className="text-xl font-bold mt-6">Misi Kami</h2>
                <p className="text-gray-300">
                  Misi kami adalah menghapuskan hambatan komunikasi dan
                  menjembatani kesenjangan antara komunitas tuli dan dengar
                  melalui teknologi yang inklusif dan mudah diakses.
                </p>
              </div>
            )}

            {activeTab === "community" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Komunitas & Support</h1>
                <p className="text-gray-300">
                  Bergabunglah dengan komunitas kami untuk berkolaborasi dan
                  mendapatkan bantuan dari pengguna lain.
                </p>
                {/* Community content */}
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
