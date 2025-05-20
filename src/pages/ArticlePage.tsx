import Container from "../components/common/Container";
import ArticleCard from "../components/article/ArticleCard";
import Footer from "../components/layout/Footer";

interface Article {
  id: string;
  image: string;
  title: string;
  date: string;
  version: string;
}

function ArticlePage() {
  const articles: Article[] = [
    {
      id: "pentingnya-ajarkan-bahasa-isyarat",
      image: "../assets/img/artikel-footage-1.jpg",
      title: "pentingnya ajarkan anak-anak bahasa isyarat",
      date: "senin | 19 mei, 2025",
      version: "1.0",
    },
    {
      id: "mengenal-sibi-bisindo",
      image: "../assets/img/artikel-footage-2.webp",
      title: "mengenal bahasa isyarat di indonesia: SIBI dan BISINDO",
      date: "rabu | 21 mei, 2025",
      version: "1.1",
    },
    {
      id: "tiga-hal-bahasa-isyarat",
      image: "../assets/img/artikel-footage-3.jpg",
      title: "tiga hal yang harus diketahui mengenai bahasa isyarat",
      date: "kamis | 22 mei, 2025",
      version: "1.2",
    },
    {
      id: "empati-bahasa-isyarat-sekolah",
      image: "../assets/img/artikel-footage-4.png",
      title: "mengajarkan empati lewat bahasa isyarat di sekolah",
      date: "senin | 26 mei, 2025",
      version: "1.3",
    },
  ];

  return (
    <div className="p-12">
      <Container>
        <h2 className="text-xl font-bold text-white mb-2">artikel</h2>
        <div className="h-1 w-20 bg-blue-500 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article, idx) => (
            <ArticleCard key={idx} {...article} />
          ))}
        </div>
      </Container>
      <Footer />
    </div>
  );
}

export default ArticlePage;
