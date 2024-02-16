import ArticlesTable from "@/components/ArticlesTable";
import Header from "@/components/Header";

const ArticlesPage = () => {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Header />
      <div className="max-w-4xl">
        <ArticlesTable />
      </div>
    </div>
  );
}

export default ArticlesPage;