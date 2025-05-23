import Container from "../components/common/Container";
import ArticleCard from "../components/article/ArticleCard";
import Footer from "../components/layout/Footer";
import articlesData from "../data/ArticlesData";

function ArticlePage() {
  return (
    <div className="p-12 bg-[#1a1a1a]">
      <Container>
        <h2 className="text-xl font-bold text-white mb-2">artikel</h2>
        <div className="h-1 w-20 bg-blue-500 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articlesData.map((article, idx) => (
            <ArticleCard key={idx} {...article} />
          ))}
        </div>
      </Container>
      <Footer />
    </div>
  );
}

export default ArticlePage;
