import type { SiteData } from "@/lib/types";
import { mockSiteData } from "@/lib/mock-data";

export async function getSiteData(): Promise<SiteData> {
  return mockSiteData;
}

export function getMockSiteData(): SiteData {
  return mockSiteData;
}
