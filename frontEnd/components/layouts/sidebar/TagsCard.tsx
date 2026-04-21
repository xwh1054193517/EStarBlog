"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import type { TagItem } from "@/lib/types";
import { getTagFontSize } from "@/lib/utils";
import { useExpandable } from "@/hooks/useExpandable";

export default function TagsCard({ tags }: { tags: TagItem[] }) {
  const tagCloudRef = useRef<HTMLDivElement>(null);
  const [needsExpand, setNeedsExpand] = useState(false);
  const { isExpanded, toggleExpand } = useExpandable(false);

  useEffect(() => {
    if (tagCloudRef.current && tagCloudRef.current.scrollHeight > 150) {
      setNeedsExpand(true);
    }
  }, [tags]);

  return (
    <div className="card-widget card-tags">
      <div className={`item-headline${isExpanded ? " is-expanded" : ""}`}>
        <i className="ri-price-tag-3-fill" />
        <span>标签</span>
        {needsExpand && (
          <i
            className={`collapse-icon ri-arrow-left-s-fill${isExpanded ? " is-expanded" : ""}`}
            onClick={toggleExpand}
          />
        )}
      </div>
      <div
        ref={tagCloudRef}
        className={`card-tag-cloud${needsExpand ? " can-expand" : ""}${isExpanded ? " is-expanded" : ""}`}
      >
        {tags.map((tag) => (
          <Link key={tag.slug} href={tag.url} style={{ fontSize: getTagFontSize(tag, tags) }}>
            {tag.name}
          </Link>
        ))}
      </div>
      {needsExpand && (
        <div className="expand-toggle" onClick={toggleExpand}>
          <span>{isExpanded ? "收起" : "展开更多"}</span>
        </div>
      )}
    </div>
  );
}
