import { getMockSiteData } from "@/lib/mock-api";
import ArticleDetail from "./ArticleDetail";

export default async function ArticlePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const siteData = await getMockSiteData();

  return <ArticleDetail slug={slug} siteData={siteData} />;
}
