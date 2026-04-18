"use client";

import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import type { TocItem } from "@/lib/types";

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
    </div>
  );
}
