"use client";

import { useState } from "react";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ArticleSortList from "@/components/features/archive/ArticleSortList";
import Pagination from "@/components/ui/Pagination";
import { useArticles } from "@/lib/api/article-api";
import type { CategoryItem, SiteData } from "@/lib/types";

interface CategoryPageClientProps {
  slug: string;
  category: CategoryItem;
  siteData: SiteData;
}

export default function CategoryPageClient({ slug, category, siteData }: CategoryPageClientProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError } = useArticles({
    page,
    pageSize,
    category: slug
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
              articles={data?.items ?? []}
              title={`分类 - ${category.name}`}
              total={data?.pagination?.total}
            />
            {data && data.pagination && data.pagination.total > pageSize && (
              <Pagination
                currentPage={page}
                totalPages={data.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </DefaultLayout>
  );
}
