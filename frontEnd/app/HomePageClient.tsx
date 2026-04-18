"use client";

import PostList from "@/components/features/article/PostList";
import { useWaterfall } from "@/hooks/useWaterfall";
import type { Article } from "@/lib/types";

interface HomePageClientProps {
  articles: Article[];
}

export default function HomePageClient({ articles }: HomePageClientProps) {
  useWaterfall({
    containerSelector: "#post-list",
    columns: 2,
    gap: 16,
    debounceDelay: 50,
    breakpoints: { mobile: 768, tablet: 1200 }
  });

  if (articles.length === 0) {
    return (
      <div className="article-list-empty">
        <i className="ri-article-line"></i>
        <p>暂无文章</p>
      </div>
    );
  }

  return <PostList articles={articles} />;
}