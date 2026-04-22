import DefaultLayout from "@/components/layouts/DefaultLayout";
import PostList from "@/components/features/article/PostList";
import { getMockSiteData, getMockMoments, getMockArticles } from "@/lib/mock-api";
import { getArticles } from "@/lib/api/article-api";
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
  const siteData = await getMockSiteData();
  const moments = await getMockMoments();

  let articles = [];
  try {
    const articlesData = await getArticles({ page: 1, pageSize: 10 });
    console.warn("articlesData", articlesData);
    articles = articlesData.items;
  } catch (error) {
    console.warn("Failed to fetch articles from API, using mock:", error);
    articles = await getMockArticles();
  }

  return (
    <DefaultLayout siteData={siteData} pageType="home" moments={moments}>
      <HomePageClient articles={articles} />
    </DefaultLayout>
  );
}
