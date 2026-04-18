"use client";

import Link from "next/link";
import type { Article } from "@/lib/types";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function countWords(text: string): number {
  const cleaned = text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/[#*_~\[\]]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
  return cleaned.length;
}

function estimateReadingTime(text: string, wordsPerMinute = 300): number {
  const words = countWords(text);
  return Math.ceil(words / wordsPerMinute);
}

interface PostHeaderProps {
  article: Article;
}

export default function PostHeader({ article }: PostHeaderProps) {
  const wordCount = countWords(article.content);
  const readingTime = estimateReadingTime(article.content);

  return (
    <header
      className="post-header"
      style={{
        backgroundImage: article.cover ? `url(${article.cover})` : "none"
      }}
    >
      <div className="post-info">
        <h1 className="post-title">{article.title}</h1>

        <div className="post-meta post-meta-mobile">
          <span className="post-meta-item">
            <i className="ri-calendar-line"></i>
            <span>发表于 {formatDate(article.publishTime)}</span>
          </span>
          {article.updateTime && (
            <span className="post-meta-item">
              <i className="ri-refresh-line"></i>
              <span>更新于 {formatDate(article.updateTime)}</span>
            </span>
          )}
          {article.location && (
            <span className="post-meta-item">
              <i className="ri-map-pin-line"></i>
              <span>{article.location}</span>
            </span>
          )}
          {article.category && (
            <span className="post-meta-item">
              <i className="ri-folder-line"></i>
              <Link href={article.category.url}>{article.category.name}</Link>
            </span>
          )}
          <span className="post-meta-item">
            <i className="ri-file-word-line"></i>
            <span>总字数: {wordCount}</span>
          </span>
          <span className="post-meta-item">
            <i className="ri-time-line"></i>
            <span>阅读时长: {readingTime}分钟</span>
          </span>
          <span className="post-meta-item">
            <i className="ri-eye-line"></i>
            <span>浏览量: {article.viewCount}</span>
          </span>
          <span className="post-meta-item">
            <i className="ri-message-3-line"></i>
            <span>评论数: {article.commentCount}</span>
          </span>
        </div>

        <div className="post-meta-desktop">
          <div className="post-meta">
            <span className="post-meta-item">
              <i className="ri-calendar-line"></i>
              <span>发表于 {formatDate(article.publishTime)}</span>
            </span>
            {article.updateTime && (
              <span className="post-meta-item">
                <i className="ri-refresh-line"></i>
                <span>更新于 {formatDate(article.updateTime)}</span>
              </span>
            )}
            {article.location && (
              <span className="post-meta-item">
                <i className="ri-map-pin-line"></i>
                <span>{article.location}</span>
              </span>
            )}
            {article.category && (
              <span className="post-meta-item">
                <i className="ri-folder-line"></i>
                <Link href={article.category.url}>{article.category.name}</Link>
              </span>
            )}
          </div>
          <div className="post-meta">
            <span className="post-meta-item">
              <i className="ri-file-word-line"></i>
              <span>总字数: {wordCount}</span>
            </span>
            <span className="post-meta-item">
              <i className="ri-time-line"></i>
              <span>阅读时长: {readingTime}分钟</span>
            </span>
            <span className="post-meta-item">
              <i className="ri-eye-line"></i>
              <span>浏览量: {article.viewCount}</span>
            </span>
            <span className="post-meta-item">
              <i className="ri-message-3-line"></i>
              <span>评论数: {article.commentCount}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
