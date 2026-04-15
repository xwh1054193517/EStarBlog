"use client";

import { useEffect, useState } from "react";
import type { Article } from "@/lib/types";

export default function TocCard({ article }: { article: Article }) {
  const [activeId, setActiveId] = useState(article.sections[0]?.id ?? "");

  useEffect(() => {
    const handleScroll = () => {
      const referencePoint = 64;
      let targetId = article.sections[0]?.id ?? "";

      for (const section of article.sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        if (rect.top <= referencePoint + 50) {
          targetId = section.id;
        }
      }

      setActiveId(targetId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [article.sections]);

  if (!article.sections.length) return null;

  return (
    <div className="card-widget">
      <div className="item-headline">
        <i className="ri-list-unordered" />
        <span>目录</span>
      </div>

      <nav className="toc-list" aria-label="文章目录">
        {article.sections.map((item) => (
          <button
            key={item.id}
            className={`toc-item toc-level-${item.level}${activeId === item.id ? " active" : ""}`}
            onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            <span className="toc-text">{item.text}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
