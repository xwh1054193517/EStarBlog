import type { ArchiveItem, TagItem } from "@/lib/types";

export function formatFriendly(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

export function countWords(content: string) {
  return content.replace(/[#*_`>\-\n]/g, " ").trim().split(/\s+/).filter(Boolean).length;
}

export function estimateReadingTime(content: string, wordsPerMinute = 300) {
  return Math.max(1, Math.ceil(countWords(content) / wordsPerMinute));
}

export function getRunningDays(established: string) {
  const start = new Date(established).getTime();
  return Math.max(0, Math.floor((Date.now() - start) / 86400000));
}

export function isExternalLink(url: string) {
  return /^https?:\/\//.test(url);
}

export function getDisplayArchives(archives: ArchiveItem[]) {
  const visible = archives.slice(0, 6).map((item) => ({
    ...item,
    displayText: `${item.year} ${item.month}`,
    isEarlier: false
  }));

  if (archives.length > 6) {
    visible.push({
      year: "",
      month: "",
      count: archives.slice(6).reduce((sum, item) => sum + item.count, 0),
      displayText: "在此之前",
      isEarlier: true
    });
  }

  return visible;
}

export function getTagFontSize(tag: TagItem, tags: TagItem[]) {
  const maxCount = Math.max(...tags.map((item) => item.count), 1);
  return `${0.9 + 0.6 * (tag.count / maxCount)}em`;
}

export function getMomentContentTypes(moment: {
  content: { images?: string[]; video?: string; link?: string; music?: string };
}) {
  const types: string[] = [];
  if (moment.content.images?.length) types.push("image");
  if (moment.content.video) types.push("video");
  if (moment.content.link) types.push("link");
  if (moment.content.music) types.push("music");
  return types;
}
