import { Link2, Github } from "lucide-react";
import { BsDiscord } from "react-icons/bs";
import CommunityCard from "../common/CommunityCard";

const CommunityActive = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CommunityCard
          icon={Github}
          title="GitHub"
          description="lihat source code ArtiSign, berkontribusi, atau melaporkan masalah"
          link="https://github.com/shaflykhalifap/ArtiSign/tree/main"
          bgColor="bg-[#24292e]"
        />

        <CommunityCard
          icon={BsDiscord}
          title="Discord"
          description="chat dengan komunitas dan developers tentang ArtiSign atau meminta bantuan"
          link="https://discord.gg/rQWSzxST"
          bgColor="bg-[#5865F2]"
        />
      </div>

      <h2 className="text-l font-bold text-white mb-2 flex items-center gap-2">
        cara terbaik untuk bertanya dan berbagi hal yang menarik
        <Link2 size={16} className="text-white/60" />
      </h2>
      <p className="text-gray-300">
        jika kamu ingin melaporkan bug atau masalah yang sering terjadi, silakan
        lakukan di gitHub.
        <br />
        <br />
        gunakan discord untuk pertanyaan lainnya.jelaskan masalahmu dengan jelas
        di komen #artisign-buddy, agar tim atau komunitas bisa membantumu.
        seluruh dukungan bersifat sukarela dan tidak dijamin, jadi harap
        bersabar jika tidak langsung mendapat balasan.
      </p>
    </div>
  );
};

export default CommunityActive;
