"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import mermaid from "mermaid";
import { generateHeadingId } from "@/lib/toc";
import type { Components } from "react-markdown";
// 由于 unified 包可能未安装，我们使用 any 类型来避免类型错误
type PluggableList = any[];

interface ArticleContentProps {
  content: string;
}

interface ImageZoomState {
  isOpen: boolean;
  src: string;
  alt: string;
}

function rehypeHeadingIds(): PluggableList[0] {
  return function transformer(tree: any) {
    const seen = new Map<string, number>();

    function visit(nodes: any[]) {
      for (const node of nodes) {
        if (node.type === "element" && /^h[1-6]$/.test(node.tagName)) {
          const text = node.children
            .filter((c: any) => c.type === "text")
            .map((c: any) => c.value)
            .join("");

          const base = generateHeadingId(text);
          const count = seen.get(base) || 0;
          seen.set(base, count + 1);
          node.properties = node.properties || {};
          node.properties.id = count === 0 ? base : `${base}-${count}`;
        }

        if (node.children && Array.isArray(node.children)) {
          visit(node.children);
        }
      }
    }

    visit(tree.children || []);
    return tree;
  };
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

  const rehypePlugins = useMemo(() => [rehypeHeadingIds], []);

  const components: Components = useMemo(
    () => ({
      img: ({ src, alt }) => (
        <img
          src={src as string}
          alt={alt || ""}
          style={{ cursor: "zoom-in" }}
          onClick={() => openZoom((src as string) || "", alt || "")}
        />
      )
    }),
    [openZoom]
  );

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

  return (
    <>
      <article className="post-content">
        <div ref={contentRef} className="markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={rehypePlugins}
            components={components}
          >
            {content}
          </ReactMarkdown>
        </div>
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
