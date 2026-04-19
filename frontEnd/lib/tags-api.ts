import { getPublicTags } from "@/lib/api/publicApi";
import type { TagItem, TagsOverview } from "@/lib/types";

function safeNumber(value: string | number | null | undefined, fallback: number = 0): number {
  if (value === null || value === undefined) return fallback;
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
}

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
  const tags = await getPublicTags();
  const tagItems: TagItem[] = tags.map((t) => ({
    id: safeNumber(t.id),
    name: t.name,
    slug: t.slug,
    url: `/tags/${t.slug}`,
    count: t.postCount ?? 0
  }));
  return buildOverview(tagItems);
}
