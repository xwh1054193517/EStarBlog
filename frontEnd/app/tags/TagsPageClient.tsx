"use client";

import Link from "next/link";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import type { TagItem, SiteData } from "@/lib/types";

interface TagsPageClientProps {
  tags: TagItem[];
  siteData: SiteData;
}

export default function TagsPageClient({ tags, siteData }: TagsPageClientProps) {
  return (
    <DefaultLayout siteData={siteData} pageType="page" showSidebar={false}>
      <div id="page">
        <h1 className="page-title">标签</h1>
        <div className="tag-lists">
          <ul className="tag-list">
            {tags.map((tag) => (
              <li key={tag.id} className="tag-list-item">
                <Link href={tag.url} className="tag-list-link">
                  {tag.name}
                </Link>
                <span className="tag-list-count">({tag.count})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DefaultLayout>
  );
}