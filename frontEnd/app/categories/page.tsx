import { getMockSiteData } from "@/lib/mock-api";
import CategoriesPageClient from "./CategoriesPageClient";

export default async function CategoriesPage() {
  const siteData = await getMockSiteData();

  return <CategoriesPageClient categories={siteData.categories} siteData={siteData} />;
}
