import { useState, useEffect } from "react";
import articlesData, { Article } from "../data/ArticlesData";

export const useArticle = (id: string | undefined) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        if (!id) {
          setError(true);
          setLoading(false);
          return;
        }

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
  }, [id]);

  return { article, loading, error };
};
