export interface TocItem {
  id: string;
  text: string;
  level: number;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function generateHeadingId(text: string): string {
  const id = text
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return id || `heading-${simpleHash(text)}`;
}

export function extractToc(content: string): TocItem[] {
  const toc: TocItem[] = [];
  const seen = new Map<string, number>();

  const headingRegex = /^\s{0,3}(#{1,6})\s+(.+?)\s*#*$/gm;

  function uniqueSlug(text: string) {
    const base = generateHeadingId(text);
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  }

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = uniqueSlug(text);

    toc.push({ id, text, level });
  }

  return toc;
}
