import Link from "next/link";
import type { TagItem } from "@/lib/types";
import { getTagFontSize } from "@/lib/utils";

export default function TagsCard({ tags }: { tags: TagItem[] }) {
  return (
    <div className="card-widget card-tags">
      <div className="item-headline">
        <i className="ri-price-tag-3-fill" />
        <span>标签</span>
      </div>
      <div className="card-tag-cloud is-expanded">
        {tags.map((tag) => (
          <Link key={tag.id} href={tag.url} style={{ fontSize: getTagFontSize(tag, tags) }}>
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
