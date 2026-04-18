import { getMockSiteData, getMockMoments } from "@/lib/mock-api";
import MomentPageClient from "./MomentPageClient";

export default async function MomentPage() {
  const siteData = await getMockSiteData();
  const moments = await getMockMoments();

  return <MomentPageClient moments={moments} siteData={siteData} />;
}
