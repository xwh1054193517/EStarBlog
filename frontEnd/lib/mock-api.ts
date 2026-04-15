import { mockArticle, mockSiteData } from "@/lib/mock-data";
import type { Article, SiteData, TagsOverview } from "@/lib/types";

const wait = (ms = 60) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getMockSiteData(): Promise<SiteData> {
  await wait();
  return mockSiteData;
}

export async function getMockArticleBySlug(_slug: string): Promise<Article> {
  await wait();
  return mockArticle;
}

export async function getMockTagsOverview(): Promise<TagsOverview> {
  await wait();

  const tags = [...mockSiteData.tags].sort((a, b) => b.count - a.count);

  return {
    tags,
    totalTags: tags.length,
    totalTaggedPosts: tags.reduce((sum, tag) => sum + tag.count, 0),
    hottestTag: tags[0] ?? null
  };
}
