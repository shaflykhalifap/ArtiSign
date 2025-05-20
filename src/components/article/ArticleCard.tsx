import { useNavigate } from "react-router-dom";

interface ArticleCardProps {
  id: string;
  image: string;
  title: string;
  date: string;
  version: string;
}

const ArticleCard = (props: ArticleCardProps) => {
  const { id, image, title, date, version } = props;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/article/${id}`);
  };

  return (
    <div
      className="max-w-md cursor-pointer rounded-xl overflow-hidden shadow-lg bg-[#292A2C] hover:bg-gray-800 transition-all duration-300 hover:shadow-2xl"
      onClick={handleClick}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover rounded-t-xl hover:scale-105 transition-all duration-500"
      />
      <div className="p-5 space-y-3">
        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-md">
          v{version}
        </span>

        <h2 className="text-lg font-semibold text-white leading-snug">
          {title}
        </h2>

        <div className="flex items-center text-sm text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {date}
        </div>

        <div className="pt-2">
          <span className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
            Baca artikel
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
