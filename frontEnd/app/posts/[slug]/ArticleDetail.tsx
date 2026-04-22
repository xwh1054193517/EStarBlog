"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import ArticleContent from "@/components/features/article/ArticleContent";
import { useArticle, incrementArticleView } from "@/lib/api/article-api";
import { extractToc } from "@/lib/toc";
import type { SiteData } from "@/lib/types";

interface ArticleDetailProps {
  slug: string;
  siteData: SiteData;
}

export default function ArticleDetail({ slug, siteData }: ArticleDetailProps) {
  const { data: article, isLoading, isError } = useArticle(slug);

  useEffect(() => {
    if (slug) {
      incrementArticleView(slug);
    }
  }, [slug]);

  if (isLoading) {
    return (
      <DefaultLayout siteData={siteData} pageType="post" article={undefined as never} toc={[]}>
        <div id="post">
          <div className="article-detail-loading">
            <div className="loading-skeleton">
              <div className="skeleton-header"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-meta"></div>
                <div className="skeleton-paragraph"></div>
                <div className="skeleton-paragraph"></div>
                <div className="skeleton-paragraph"></div>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (isError || !article) {
    return (
      <DefaultLayout siteData={siteData} pageType="post" article={undefined as never} toc={[]}>
        <div id="post">
          <div className="article-detail-error">
            <p>文章加载失败，请稍后重试</p>
            <Link href="/" className="back-home">
              返回首页
            </Link>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  const toc = extractToc(article.content);

  return (
    <DefaultLayout siteData={siteData} pageType="post" article={article} toc={toc}>
      <div id="post">
        <ArticleContent content={article.content} />
      </div>
    </DefaultLayout>
  );
}
