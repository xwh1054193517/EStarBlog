"use client";

import DefaultLayout from "@/components/layouts/DefaultLayout";
import ArticleSortList from "@/components/features/archive/ArticleSortList";
import type { Article, SiteData } from "@/lib/types";

interface ArchivePageClientProps {
  articles: Article[];
  siteData: SiteData;
}

export default function ArchivePageClient({ articles, siteData }: ArchivePageClientProps) {
  return (
    <DefaultLayout siteData={siteData} pageType="page" showSidebar={true}>
      <div id="page">
        <ArticleSortList articles={articles} groupByYear={true} title="归档" total={articles.length} />
      </div>
    </DefaultLayout>
  );
}