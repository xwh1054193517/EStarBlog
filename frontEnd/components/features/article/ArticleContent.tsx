"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { renderMarkdown } from "@/lib/markdown";
import mermaid from "mermaid";

interface ArticleContentProps {
  content: string;
}

interface ImageZoomState {
  isOpen: boolean;
  src: string;
  alt: string;
}

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose"
});

export default function ArticleContent({ content }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [zoomState, setZoomState] = useState<ImageZoomState>({
    isOpen: false,
    src: "",
    alt: ""
  });

  const openZoom = useCallback((src: string, alt: string) => {
    setZoomState({ isOpen: true, src, alt });
    document.body.style.overflow = "hidden";
  }, []);

  const closeZoom = useCallback(() => {
    setZoomState((prev) => ({ ...prev, isOpen: false }));
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG" && target.closest(".markdown-content")) {
        const img = target as HTMLImageElement;
        openZoom(img.src || "", img.alt || "");
      }
    };

    contentRef.current.addEventListener("click", handleClick);
    return () => {
      contentRef.current?.removeEventListener("click", handleClick);
    };
  }, [openZoom]);

  const renderMermaidDiagrams = useCallback(async () => {
    if (!contentRef.current) return;

    const elements = contentRef.current.querySelectorAll(".mermaid:not(:has(svg))");

    for (const element of elements) {
      try {
        const text = element.textContent || "";
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, text);
        element.innerHTML = svg;
      } catch (error) {
        console.error("Mermaid 渲染失败:", error);
        (element as HTMLElement).classList.add("mermaid-error");
        element.textContent = `Mermaid 渲染失败: ${error}`;
      }
    }
  }, []);

  useEffect(() => {
    renderMermaidDiagrams();
  }, [content, renderMermaidDiagrams]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && zoomState.isOpen) {
        closeZoom();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [zoomState.isOpen, closeZoom]);

  if (!content) {
    return null;
  }

  const renderedHtml = renderMarkdown(content);

  return (
    <>
      <article className="post-content">
        <div ref={contentRef} className="markdown-content" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
      </article>

      {zoomState.isOpen && (
        <div className="image-zoom-overlay" onClick={closeZoom}>
          <div className="image-zoom-container">
            <img src={zoomState.src} alt={zoomState.alt} className="image-zoom-img" />
            <button className="image-zoom-close" onClick={closeZoom}>
              <i className="ri-close-line"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
