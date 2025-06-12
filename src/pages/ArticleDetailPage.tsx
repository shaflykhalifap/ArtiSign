import { useParams, useNavigate } from "react-router-dom";
import Container from "../components/common/Container";
import Footer from "../components/layout/Footer";
import { ArrowLeft } from "lucide-react";
import ShareButton from "../components/article/ShareButton";
import { useArticle } from "../hooks/useArticle";

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { article, loading, error } = useArticle(id);

  const handleBackClick = () => {
    navigate("/article");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="px-4 py-8 sm:px-6 sm:py-10 md:p-12 bg-[#1a1a1a]">
        <Container>
          <div className="text-center py-8 sm:py-12 md:py-16">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              artikel tidak ditemukan
            </h2>
            <p className="text-gray-400 mb-6 text-sm sm:text-base">
              maaf, artikel yang kamu cari tidak dapat ditemukan.
            </p>
            <button
              onClick={handleBackClick}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base"
            >
              kembali ke daftar artikel
            </button>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 md:p-12 bg-[#1a1a1a]">
      <Container>
        <button
          onClick={handleBackClick}
          className="flex items-center text-blue-400 hover:text-blue-300 mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft size={16} className="mr-1" />
          kembali ke artikel
        </button>

        <img
          src={article.image}
          alt={article.title}
          className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg sm:rounded-xl mb-4 sm:mb-6"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/800x400?text=Artikel+ArtiSign";
            e.currentTarget.onerror = null;
          }}
        />

        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-md">
            v{article.version}
          </span>
          <span className="text-xs sm:text-sm text-gray-400">
            {article.date}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          {article.title}
        </h1>

        <div className="h-1 w-16 sm:w-20 bg-blue-500 mb-6 sm:mb-8" />

        <div className="prose prose-sm sm:prose prose-lg md:prose-xl prose-invert max-w-none">
          <div className="text-gray-300 leading-relaxed">{article.content}</div>
        </div>

        <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-gray-700 flex justify-center sm:justify-end">
          <ShareButton title={article.title} />
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default ArticleDetailPage;
