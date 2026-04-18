import { getMockSiteData, getMockArticles } from "@/lib/mock-api";
import ArchivePageClient from "./ArchivePageClient";

export default async function ArchivePage() {
  const siteData = await getMockSiteData();
  const articles = await getMockArticles();

  return <ArchivePageClient articles={articles} siteData={siteData} />;
}
