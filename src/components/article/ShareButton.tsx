import { useState } from "react";

import { FaWhatsapp, FaFacebookF } from "react-icons/fa6";
import { Share2, Copy, Check, Twitter } from "lucide-react";

type IconType =
  | { type: "component"; component: React.ComponentType<{ size?: number }> }
  | { type: "function"; render: () => React.ReactNode };

type ShareOptionType = {
  name: string;
  icon: IconType;
  onClick: () => void;
};

interface ShareButtonProps {
  url?: string;
  title?: string;
}

const ShareButton = ({
  url = window.location.href,
  title = "Check out this article",
}: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareOptions: ShareOptionType[] = [
    {
      name: "Copy Link",
      icon: { type: "component", component: copied ? Check : Copy },
      onClick: handleCopyLink,
    },
    {
      name: "Twitter",
      icon: { type: "component", component: Twitter },
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
      },
    },
    {
      name: "Facebook",
      icon: { type: "component", component: FaFacebookF },
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
      },
    },
    {
      name: "WhatsApp",
      icon: { type: "component", component: FaWhatsapp },
      onClick: () => {
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(
            title + ": " + url
          )}`,
          "_blank"
        );
      },
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
      >
        <Share2 size={16} />
        Share Artikel
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 p-3 bg-gray-800 rounded-lg shadow-lg border border-gray-700 min-w-[200px]">
          <p className="text-sm text-gray-300 mb-2">Share via:</p>

          {shareOptions
            .filter((option) => option.name === "Copy Link")
            .map((option) => (
              <button
                key={option.name}
                onClick={option.onClick}
                className="flex items-center justify-center gap-2 p-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors w-full"
              >
                {option.icon.type === "function" ? (
                  option.icon.render()
                ) : (
                  <option.icon.component size={16} />
                )}
                {option.name}
              </button>
            ))}

          <div className="grid grid-cols-3 gap-2 mt-2">
            {shareOptions
              .filter((option) => option.name !== "Copy Link")
              .map((option) => (
                <button
                  key={option.name}
                  onClick={option.onClick}
                  title={option.name}
                  className="flex items-center justify-center p-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors w-full h-10"
                >
                  {option.icon.type === "function" ? (
                    option.icon.render()
                  ) : (
                    <option.icon.component size={20} />
                  )}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
