import { useState } from "react";
import { FaWhatsapp, FaFacebookF } from "react-icons/fa6";
import { Copy, Check, Twitter } from "lucide-react";

type IconType =
  | { type: "component"; component: React.ComponentType<{ size?: number }> }
  | { type: "function"; render: () => React.ReactNode };

export type ShareOptionType = {
  name: string;
  icon: IconType;
  onClick: () => void;
};

export const useShare = (url: string, title: string) => {
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

  const toggleShareMenu = () => setIsOpen(!isOpen);

  return {
    isOpen,
    toggleShareMenu,
    copied,
    shareOptions,
  };
};
