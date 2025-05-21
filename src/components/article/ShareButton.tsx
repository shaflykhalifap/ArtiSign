import { useState } from "react";
import { Share2, Copy, Check, Twitter, Facebook, Linkedin } from "lucide-react";

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

  const shareOptions = [
    {
      name: "Copy Link",
      icon: copied ? Check : Copy,
      onClick: handleCopyLink,
    },
    {
      name: "Twitter",
      icon: Twitter,
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
      icon: Facebook,
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
      name: "LinkedIn",
      icon: Linkedin,
      onClick: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
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
        share artikel
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 p-3 bg-gray-800 rounded-lg shadow-lg border border-gray-700 min-w-[200px]">
          <p className="text-sm text-gray-300 mb-2">Share via:</p>
          <div className="grid grid-cols-2 gap-2">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={option.onClick}
                className="flex items-center gap-2 p-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
              >
                <option.icon size={16} />
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
