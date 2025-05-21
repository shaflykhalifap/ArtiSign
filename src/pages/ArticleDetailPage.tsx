import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Container from "../components/common/Container";
import Footer from "../components/layout/Footer";
import { ArrowLeft } from "lucide-react";
import articlesData, { Article } from "../data/ArticleData";

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        const foundArticle = articlesData.find((article) => article.id === id);

        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          setError(true);
          console.error(`Article with ID "${id}" not found`);
        }
        setLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } catch (err) {
      setError(true);
      setLoading(false);
      console.error("Error loading article:", err);
    }
  }, [id, navigate]);

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
      <div className="p-12">
        <Container>
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-white mb-4">
              Artikel tidak ditemukan
            </h2>
            <p className="text-gray-400 mb-6">
              Maaf, artikel yang kamu cari tidak dapat ditemukan.
            </p>
            <button
              onClick={handleBackClick}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Kembali ke daftar artikel
            </button>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="p-12">
      <Container>
        <button
          onClick={handleBackClick}
          className="flex items-center text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft size={16} className="mr-1" />
          kembali ke artikel
        </button>

        <img
          src={article.image}
          alt={article.title}
          className="w-full h-80 object-cover rounded-xl mb-6"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/800x400?text=Artikel+ArtiSign";
            e.currentTarget.onerror = null;
          }}
        />

        <div className="flex items-center space-x-3 mb-6">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-md">
            v{article.version}
          </span>
          <span className="text-sm text-gray-400">{article.date}</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-6">{article.title}</h1>

        <div className="h-1 w-20 bg-blue-500 mb-8" />

        <div className="prose prose-lg prose-invert max-w-none">
          {article.content}
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default ArticleDetailPage;
