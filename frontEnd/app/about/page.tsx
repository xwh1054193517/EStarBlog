import { getMockSiteData } from "@/lib/mock-api";
import AboutPageClient from "./AboutPageClient";
export const dynamic = "force-dynamic";
export default async function AboutPage() {
  const siteData = await getMockSiteData();

  return <AboutPageClient siteData={siteData} />;
}
