import { getMockSiteData } from "@/lib/mock-api";
import AboutPageClient from "./AboutPageClient";

export default async function AboutPage() {
  const siteData = await getMockSiteData();

  return <AboutPageClient siteData={siteData} />;
}
