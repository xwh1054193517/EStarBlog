import DefaultLayout from "@/components/layouts/DefaultLayout";
import PostList from "@/components/features/article/PostList";
import { getMockSiteData, getMockMoments, getMockArticles } from "@/lib/mock-api";
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
  const siteData = await getMockSiteData();
  const moments = await getMockMoments();
  const articles = await getMockArticles();

  return (
    <DefaultLayout siteData={siteData} pageType="home" moments={moments}>
      <HomePageClient articles={articles} />
    </DefaultLayout>
  );
}
