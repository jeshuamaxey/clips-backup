"use client";

import useArticles from "@/hooks/useArticles";

const ArticlesTable = () => {
  const articlesQuery = useArticles();

  if (articlesQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (articlesQuery.isError) {
    return <p>Error: {articlesQuery.error.message}</p>;
  }

  const articles = articlesQuery.data!;

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
        </tr>
      </thead>
      <tbody>
        {articles.map((article) => (
          <tr key={article.id}>
            <td>{article.title_raw}</td>
            <td>{article.author_raw}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ArticlesTable;