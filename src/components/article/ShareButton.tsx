import { Share2 } from "lucide-react";
import { useShare } from "../../hooks/useShare";

interface ShareButtonProps {
  url?: string;
  title?: string;
}

const ShareButton = ({
  url = window.location.href,
  title = "Check out this article",
}: ShareButtonProps) => {
  const { isOpen, toggleShareMenu, shareOptions } = useShare(url, title);

  return (
    <div className="relative">
      <button
        onClick={toggleShareMenu}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-600 transition-colors"
      >
        <Share2 size={16} />
        bagikan artikel
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
