import { getMockTagsOverview } from "@/lib/mock-api";
import type { TagItem, TagsOverview } from "@/lib/types";

function buildOverview(tags: TagItem[]): TagsOverview {
  const sortedTags = [...tags].sort((a, b) => b.count - a.count);

  return {
    tags: sortedTags,
    totalTags: sortedTags.length,
    totalTaggedPosts: sortedTags.reduce((sum, tag) => sum + tag.count, 0),
    hottestTag: sortedTags[0] ?? null
  };
}

export async function getTagsOverview(): Promise<TagsOverview> {
  const apiBaseUrl = process.env.BLOG_API_BASE_URL;

  if (!apiBaseUrl) {
    return getMockTagsOverview();
  }

  try {
    const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/tags`, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.status}`);
    }

    const tags = (await response.json()) as TagItem[];
    return buildOverview(tags);
  } catch {
    return getMockTagsOverview();
  }
}
