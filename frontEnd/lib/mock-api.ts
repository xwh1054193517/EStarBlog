import { mockArticle, mockSiteData, mockArticles } from "@/lib/mock-data";
import { getSiteConfig } from "@/lib/api/siteConfigApi";
import { getPublicCategories, getPublicTags } from "@/lib/api/publicApi";
import type { Article, SiteData, TagsOverview, MomentItem } from "@/lib/types";

const wait = (ms = 60) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getMockSiteData(): Promise<SiteData> {
  try {
    const config = await getSiteConfig();
    const [categories, tags] = await Promise.all([getPublicCategories(), getPublicTags()]);
    return {
      ...mockSiteData,
      blogConfig: {
        ...mockSiteData.blogConfig,
        ...config.blog
      } as SiteData["blogConfig"],
      basicConfig: {
        ...mockSiteData.basicConfig,
        ...config.basic
      },
      categories: categories.map((c) => ({
        ...c,
        id: c.id as unknown as number,
        url: `/categories/${c.slug}`,
        count: c.postCount ?? 0
      })) as SiteData["categories"],
      tags: tags.map((t) => ({
        ...t,
        id: t.id as unknown as number,
        url: `/tags/${t.slug}`,
        count: t.postCount ?? 0
      })) as SiteData["tags"]
    };
  } catch (error) {
    console.warn("Failed to fetch categories/tags from API, using mock:", error);
    return mockSiteData;
  }
}

export async function getMockArticleBySlug(_slug: string): Promise<Article> {
  await wait();
  return mockArticle;
}

export async function getMockArticles(): Promise<Article[]> {
  await wait();
  return mockArticles;
}

export async function getMockTagsOverview(): Promise<TagsOverview> {
  await wait();

  const siteData = await getMockSiteData();
  const tags = [...siteData.tags].sort((a, b) => b.count - a.count);

  return {
    tags,
    totalTags: tags.length,
    totalTaggedPosts: tags.reduce((sum, tag) => sum + tag.count, 0),
    hottestTag: tags[0] ?? null
  };
}

export async function getMockMoments(): Promise<MomentItem[]> {
  await wait();
  return mockSiteData.moments;
}
