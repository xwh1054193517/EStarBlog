"use client";

import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import type { TocItem } from "@/lib/toc";

interface TocCardProps {
  toc: TocItem[];
}

export default function TocCard({ toc }: TocCardProps) {
  const tocListRef = useRef<HTMLElement | null>(null);
  const activeIdRef = useRef<string>("");
  const [activeId, setActiveId] = useState<string>("");

  const scrollTocToActive = useCallback((id: string) => {
    if (!tocListRef.current) return;

    requestAnimationFrame(() => {
      const activeButton = tocListRef.current?.querySelector(
        `[data-toc-id="${id}"]`
      ) as HTMLElement;
      if (!activeButton) return;

      const container = tocListRef.current!;
      const containerHeight = container.clientHeight;
      const buttonTop = activeButton.offsetTop;
      const buttonHeight = activeButton.clientHeight;

      const targetScroll = buttonTop - containerHeight / 2 + buttonHeight / 2;

      container.scrollTo({
        top: targetScroll,
        behavior: "smooth"
      });
    });
  }, []);

  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleScroll = useCallback(() => {
    const referencePoint = 64;

    if (toc.length === 0) return;

    let closestHeading: TocItem | undefined;
    let closestDistance = Infinity;

    for (const heading of toc) {
      const element = document.getElementById(heading.id);
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      const distanceToReference = Math.abs(rect.top - referencePoint);

      if (rect.top <= referencePoint + 50 && distanceToReference < closestDistance) {
        closestDistance = distanceToReference;
        closestHeading = heading;
      }
    }

    const targetId = closestHeading?.id ?? toc[0]?.id ?? "";
    if (targetId !== activeIdRef.current) {
      activeIdRef.current = targetId;
      setActiveId(targetId);
      scrollTocToActive(targetId);
    }
  }, [toc, scrollTocToActive]);

  useEffect(() => {
    if (toc.length > 0 && !activeIdRef.current) {
      activeIdRef.current = toc[0].id;
      setActiveId(toc[0].id);
    }
  }, [toc]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const tocItems = useMemo(() => toc, [toc]);

  if (tocItems.length === 0) return null;

  return (
    <div className="card-widget">
      <div className="item-headline">
        <i className="ri-list-unordered" />
        <span>目录</span>
      </div>
      <nav ref={tocListRef} className="toc-list" aria-label="文章目录">
        {tocItems.map((item) => (
          <button
            key={item.id}
            data-toc-id={item.id}
            onClick={() => scrollToHeading(item.id)}
            className={`toc-item toc-level-${item.level}${activeId === item.id ? " active" : ""}`}
            aria-label={`跳转到 ${item.text}`}
            aria-current={activeId === item.id ? "location" : undefined}
          >
            <span className="toc-text">{item.text}</span>
          </button>
        ))}
      </nav>
      <style jsx>{`
        .toc-list {
          margin: 10px 0 0;
          padding: 0;
          max-height: calc(100vh - 176px);
          overflow-y: auto;
          scroll-behavior: smooth;
        }

        .toc-list::-webkit-scrollbar {
          width: 3px;
        }

        .toc-list::-webkit-scrollbar-thumb {
          background: color-mix(in srgb, var(--estar-btn-hover) 50%, transparent);
          border-radius: 3px;
        }

        .toc-list::-webkit-scrollbar-thumb:hover {
          background: color-mix(in srgb, var(--estar-btn-hover) 70%, transparent);
        }

        .toc-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .toc-item {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          padding: 6px 8px;
          margin: 2px 0;
          cursor: pointer;
          transition: all 0.3s;
          border-radius: 6px;
          border-left: 2px solid transparent;
          line-height: 1.5;
          color: inherit;
          font-family: inherit;
          font-size: inherit;
        }

        .toc-item:hover {
          background-color: rgba(73, 177, 245, 0.1);
          border-left-color: var(--estar-btn-hover);
        }

        .toc-item.active {
          background-color: var(--estar-btn-hover);
          color: #fff;
          border-left-color: var(--estar-btn-hover);
        }

        .toc-item.active .toc-text {
          font-weight: 500;
        }

        .toc-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
          font-size: 0.9rem;
        }

        .toc-level-1 {
          padding-left: 8px;
          font-weight: 500;
        }

        .toc-level-1:hover {
          padding-left: 4px;
        }

        .toc-level-2 {
          padding-left: 16px;
          font-size: 0.95em;
        }

        .toc-level-2:hover {
          padding-left: 12px;
        }

        .toc-level-3 {
          padding-left: 24px;
          font-size: 0.9em;
          opacity: 0.9;
        }

        .toc-level-3:hover {
          padding-left: 20px;
        }

        .toc-level-4 {
          padding-left: 32px;
          font-size: 0.85em;
          opacity: 0.85;
        }

        .toc-level-4:hover {
          padding-left: 28px;
        }

        .toc-level-5 {
          padding-left: 40px;
          font-size: 0.8em;
          opacity: 0.8;
        }

        .toc-level-5:hover {
          padding-left: 36px;
        }

        .toc-level-6 {
          padding-left: 48px;
          font-size: 0.75em;
          opacity: 0.75;
        }

        .toc-level-6:hover {
          padding-left: 44px;
        }

        @media screen and (max-width: 900px) {
          .card-widget {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
