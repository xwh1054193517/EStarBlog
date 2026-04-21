"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { searchArticles, type SearchArticleItem } from "@/lib/api/article-api";

const PAGE_SIZE = 5;

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function highlightText(text: string, keyword: string) {
  const safeText = escapeHtml(text || "");
  const trimmedKeyword = keyword.trim();
  if (!trimmedKeyword) return safeText;

  const escapedKeyword = trimmedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedKeyword})`, "gi");
  return safeText.replace(regex, "<mark>$1</mark>");
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export default function SearchModal({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [articles, setArticles] = useState<SearchArticleItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resetTimerRef = useRef<number | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  const totalPages = useMemo(() => Math.ceil(total / PAGE_SIZE), [total]);
  const hasSearched = keyword.trim().length > 0;

  useEffect(() => {
    setMounted(true);

    return () => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
      if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const searchTerm = keyword.trim();
    if (!searchTerm) {
      setArticles([]);
      setTotal(0);
      setPage(1);
      setLoading(false);
      if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
      return;
    }

    setPage(1);
    if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(() => {
      void runSearch(1, searchTerm);
    }, 500);

    return () => {
      if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
    };
  }, [keyword, open]);

  async function runSearch(nextPage = 1, currentKeyword = keyword.trim()) {
    if (!currentKeyword) {
      setArticles([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    setPage(nextPage);

    try {
      const data = await searchArticles(currentKeyword, {
        page: nextPage,
        pageSize: PAGE_SIZE
      });
      setArticles(data.list);
      setTotal(data.total);
    } catch {
      setArticles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    onClose();
    if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    resetTimerRef.current = window.setTimeout(() => {
      setKeyword("");
      setArticles([]);
      setTotal(0);
      setPage(1);
      setLoading(false);
    }, 300);
  }

  function handlePrevPage() {
    if (page > 1) {
      void runSearch(page - 1);
    }
  }

  function handleNextPage() {
    if (page < totalPages) {
      void runSearch(page + 1);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className={`search-modal${open ? " search-modal-open" : ""}`}
      aria-hidden={!open}
      onClick={handleClose}
    >
      <div className="search-modal-box" onClick={(event) => event.stopPropagation()}>
        <div className="search-modal-header">
          <span className="search-modal-title">{"\u641c\u7d22"}</span>
          <button
            className="search-modal-close"
            onClick={handleClose}
            aria-label={"\u5173\u95ed\u641c\u7d22"}
          >
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="search-modal-search">
          <input
            ref={inputRef}
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder={"\u8f93\u5165\u5173\u952e\u5b57\u641c\u7d22..."}
          />
          {loading ? <i className="ri-loader-4-line spin search-loading-icon" /> : null}
        </div>

        {hasSearched ? (
          <div className="search-modal-results">
            {loading ? (
              <div className="search-modal-loading">
                <i className="ri-loader-4-line spin" />
              </div>
            ) : articles.length > 0 ? (
              <>
                {articles.map((item) => (
                  <Link
                    key={item.id || item.url}
                    href={item.url}
                    className="search-modal-item"
                    onClick={handleClose}
                  >
                    {item.cover ? <img src={item.cover} alt={item.title} loading="lazy" /> : null}
                    <div className="search-modal-info">
                      <h3
                        dangerouslySetInnerHTML={{
                          __html: highlightText(item.title, keyword)
                        }}
                      />
                      {item.excerpt ? (
                        <p
                          className="search-modal-excerpt"
                          dangerouslySetInnerHTML={{
                            __html: highlightText(item.excerpt, keyword)
                          }}
                        />
                      ) : null}
                      <div className="search-modal-meta">
                        <span>{formatDate(item.publishTime)}</span>
                        {item.category ? <span>{item.category.name}</span> : null}
                      </div>
                    </div>
                  </Link>
                ))}

                {totalPages > 1 ? (
                  <div className="search-modal-pagination">
                    <button
                      onClick={handlePrevPage}
                      disabled={page <= 1}
                      aria-label={"\u4e0a\u4e00\u9875"}
                    >
                      <i className="ri-arrow-left-s-line" />
                    </button>
                    <span>
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={page >= totalPages}
                      aria-label={"\u4e0b\u4e00\u9875"}
                    >
                      <i className="ri-arrow-right-s-line" />
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="search-modal-empty">
                <i className="ri-search-line" />
                <p>{"\u672a\u627e\u5230\u76f8\u5173\u6587\u7ae0"}</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}
