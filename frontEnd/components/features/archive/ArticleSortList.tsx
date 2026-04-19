"use client";

import Link from "next/link";
import type { Article } from "@/lib/types";

interface ArticleSortListProps {
  articles: Article[];
  groupByYear?: boolean;
  title?: string;
  total?: number;
}

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}

export default function ArticleSortList({
  articles,
  groupByYear = false,
  title,
  total
}: ArticleSortListProps) {
  const displayTotal = total ?? articles.length;

  const groupedArticles = groupByYear
    ? (() => {
        const groups = new Map<string, Article[]>();
        articles.forEach((article) => {
          if (article.publishTime) {
            const year = new Date(article.publishTime).getFullYear().toString();
            if (!groups.has(year)) {
              groups.set(year, []);
            }
            groups.get(year)!.push(article);
          }
        });
        return Array.from(groups.entries())
          .sort((a, b) => Number(b[0]) - Number(a[0]))
          .map(([year, articles]) => ({
            year,
            articles: articles.sort((a, b) => {
              const bTime = b.publishTime ? new Date(b.publishTime).getTime() : 0;
              const aTime = a.publishTime ? new Date(a.publishTime).getTime() : 0;
              return bTime - aTime;
            })
          }));
      })()
    : null;

  return (
    <div className="article-sort">
      {title && (
        <div className="article-sort-header">
          <h1 className="article-sort-title">{title}</h1>
          <div className="article-sort-meta">
            <i className="ri-file-list-line"></i>
            <span>共 {displayTotal} 篇文章</span>
          </div>
        </div>
      )}

      {groupByYear && groupedArticles
        ? groupedArticles.map((group) => (
            <div key={group.year}>
              <div className="article-sort-item year">{group.year}</div>
              {group.articles.map((article) => (
                <div key={article.slug} className="article-sort-item">
                  <Link href={article.url} className="article-sort-item-img">
                    <img src={article.cover || DEFAULT_COVER} alt={article.title} loading="lazy" />
                  </Link>
                  <div className="article-sort-item-info">
                    <div className="article-sort-item-time">
                      <i className="ri-calendar-2-fill"></i>
                      <span>{formatDate(article.publishTime)}</span>
                    </div>
                    <Link href={article.url} className="article-sort-item-title">
                      {article.title}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ))
        : articles.map((article) => (
            <div key={article.id} className="article-sort-item">
              <Link href={article.url} className="article-sort-item-img">
                <img src={article.cover || DEFAULT_COVER} alt={article.title} loading="lazy" />
              </Link>
              <div className="article-sort-item-info">
                <div className="article-sort-item-time">
                  <i className="ri-calendar-2-fill"></i>
                  <span>{formatDate(article.publishTime)}</span>
                </div>
                <Link href={article.url} className="article-sort-item-title">
                  {article.title}
                </Link>
              </div>
            </div>
          ))}
    </div>
  );
}
