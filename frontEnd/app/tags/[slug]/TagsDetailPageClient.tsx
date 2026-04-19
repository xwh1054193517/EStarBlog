"use client";

import { useState } from "react";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ArticleSortList from "@/components/features/archive/ArticleSortList";
import Pagination from "@/components/ui/Pagination";
import { useArticles } from "@/lib/api/article-api";
import type { TagItem, SiteData } from "@/lib/types";

interface TagsDetailPageClientProps {
  slug: string;
  tag: TagItem;
  siteData: SiteData;
}

export default function TagsDetailPageClient({ slug, tag, siteData }: TagsDetailPageClientProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError } = useArticles({
    page,
    pageSize,
    tag: slug
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <DefaultLayout siteData={siteData} pageType="page">
      <div id="page">
        {isLoading ? (
          <div className="loading">加载中...</div>
        ) : isError ? (
          <div className="error">加载失败，请稍后重试</div>
        ) : (
          <>
            <ArticleSortList
              articles={data?.list ?? []}
              title={`标签 - ${tag.name}`}
              total={data?.total}
            />
            {data && data.total > pageSize && (
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(data.total / pageSize)}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </DefaultLayout>
  );
}
