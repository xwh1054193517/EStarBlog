"use client";

import Link from "next/link";
import type { Article } from "@/lib/types";

interface PostListProps {
  articles: Article[];
  onWaterfallReady?: () => void;
}

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}
const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80";

export default function PostList({ articles, onWaterfallReady }: PostListProps) {
  return (
    <div id="post-list">
      {articles.map((article) => (
        <div key={article.slug} className="post-items">
          {(article.isTop || article.isEssence) && (
            <div className="post-badge">
              {article.isTop && <span className="badge-top">置顶</span>}
              {article.isEssence && !article.isTop && <span className="badge-essence">精选</span>}
            </div>
          )}

          <div className="post-cover">
            <Link href={article.url}>
              <img
                src={article.cover || DEFAULT_COVER}
                alt={article.title}
                loading="lazy"
                decoding="async"
              />
            </Link>
          </div>

          <div className="post-infoText">
            <Link className="article-title" href={article.url}>
              {article.title}
            </Link>
            <div className="article-meta-wrap">
              <span className="article-date">
                <i className="ri-calendar-2-fill"></i>
                <span className="article-meta-label">发表于</span>
                <span>{formatDate(article.publishTime)}</span>
              </span>
              {article.category && (
                <span className="article-meta">
                  <i className="ri-inbox-2-fill"></i>
                  <Link className="article-meta__categories" href={article.category.url}>
                    {article.category.name}
                  </Link>
                </span>
              )}
              {article.tags && article.tags.length > 0 && (
                <span className="article-meta tags">
                  {article.tags.map((tag, index) => (
                    <span key={`${tag.id}-${index}`}>
                      {index > 0 && <span className="article-meta-link">•</span>}
                      <i className="ri-price-tag-3-fill"></i>
                      <Link className="article-meta__tags" href={tag.url}>
                        {tag.name}
                      </Link>
                    </span>
                  ))}
                </span>
              )}
            </div>
            <div className="post-desc">{article.summary}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
