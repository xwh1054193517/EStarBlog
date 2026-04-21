import { getMockSiteData } from "@/lib/mock-api";
import { getArticles } from "@/lib/api/article-api";
import ArchivePageClient from "../../ArchivePageClient";
import { Article } from "@/lib/types";

interface ArchiveYearMonthPageProps {
  params: Promise<{ year: string; month: string }>;
}

export default async function ArchiveYearMonthPage({ params }: ArchiveYearMonthPageProps) {
  const { year, month } = await params;

  let articles: Article[] = [];
  const siteData = await getMockSiteData();

  try {
    const articlesData = await getArticles({ year, month, page: 1, pageSize: 100 });
    articles = articlesData.items;
  } catch (error) {
    console.warn("Failed to fetch archive data from API:", error);
  }

  return <ArchivePageClient articles={articles} siteData={siteData} />;
}
