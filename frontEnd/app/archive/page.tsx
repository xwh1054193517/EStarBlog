import { getMockSiteData, getMockArticles } from "@/lib/mock-api";
import { getArticles } from "@/lib/api/article-api";
import { getArchives } from "@/lib/api/archiveApi";
import ArchivePageClient from "./ArchivePageClient";

export default async function ArchivePage() {
  const siteData = await getMockSiteData();
  let articles = [];
  let archives = siteData.archives;

  try {
    const [archivesData, articlesData] = await Promise.all([
      getArchives(),
      getArticles({ page: 1, pageSize: 100 })
    ]);
    archives = archivesData;
    articles = articlesData.items;
  } catch (error) {
    console.warn("Failed to fetch archive data from API, using mock:", error);
    articles = await getMockArticles();
  }

  return <ArchivePageClient articles={articles} siteData={{ ...siteData, archives }} />;
}
