import { getMockSiteData } from "@/lib/mock-api";
import TagsPageClient from "./TagsPageClient";

export default async function TagsPage() {
  const siteData = await getMockSiteData();

  return <TagsPageClient tags={siteData.tags} siteData={siteData} />;
}