"use client";

import DefaultLayout from "@/components/layouts/DefaultLayout";
import MusicPlayer from "@/components/features/moment/MusicPlayer";
import { useWaterfall } from "@/hooks/useWaterfall";
import type { SiteData, MomentItem } from "@/lib/types";
import { useEffect, useState, useRef } from "react";

interface MomentPageClientProps {
  moments: MomentItem[];
  siteData: SiteData;
}

function formatMomentTime(date: string | Date | null | undefined): string {
  if (!date) return "-";

  const now = new Date();
  const target = new Date(date);
  const diffHours = Math.floor((now.getTime() - target.getTime()) / (1000 * 60 * 60));
  const diffDays = Math.floor((now.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

  if (diffHours < 24) {
    if (diffHours < 1) {
      const diffMinutes = Math.floor((now.getTime() - target.getTime()) / (1000 * 60));
      return diffMinutes < 1 ? "刚刚" : `${diffMinutes}分钟前`;
    }
    return `${diffHours}小时前`;
  }

  if (diffDays < 3) {
    return `${diffDays}天前`;
  }

  const nowYear = now.getFullYear();
  const targetYear = target.getFullYear();
  const month = target.getMonth() + 1;
  const day = target.getDate();

  if (nowYear === targetYear) {
    return `${month}月${day}日`;
  }

  return `${targetYear}年${month}月${day}日`;
}

function getMomentContentType(moment: MomentItem): string {
  if (moment.content.images?.length) return "图片动态";
  if (moment.content.video) return "视频动态";
  if (moment.content.music) return "音乐动态";
  if (moment.content.link) return "链接分享";
  return "动态";
}

export default function MomentPageClient({ moments, siteData }: MomentPageClientProps) {
  const { basicConfig } = siteData;
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomState, setZoomState] = useState<{ isOpen: boolean; src: string; alt: string }>({
    isOpen: false,
    src: "",
    alt: ""
  });

  const { isLayoutReady } = useWaterfall({
    containerSelector: "#moment-list",
    columns: 3,
    gap: 15,
    debounceDelay: 150,
    breakpoints: { mobile: 768, tablet: 1200 }
  });

  const openZoom = (src: string, alt: string) => {
    setZoomState({ isOpen: true, src, alt });
    document.body.style.overflow = "hidden";
  };

  const closeZoom = () => {
    setZoomState((prev) => ({ ...prev, isOpen: false }));
    document.body.style.overflow = "";
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    openZoom(target.src, target.alt || "");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && zoomState.isOpen) {
        closeZoom();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [zoomState.isOpen]);

  return (
    <DefaultLayout siteData={siteData} pageType="page" showSidebar={false}>
      <div id="moment-page">
        <h1 className="page-title">动态</h1>

        {moments.length === 0 ? (
          <div className="empty-state">
            <i className="ri-chat-3-line"></i>
            <p>暂无动态</p>
          </div>
        ) : (
          <div ref={containerRef} id="moment-list" className="moment-list">
            {moments.map((moment) => (
              <div key={moment.id} className={`moment-item ${isLayoutReady ? "layout-ready" : ""}`}>
                <div className="moment-header">
                  <div className="moment-avatar">
                    {basicConfig.authorAvatar && (
                      <img src={basicConfig.authorAvatar} alt="avatar" loading="lazy" />
                    )}
                  </div>
                  <div className="moment-meta">
                    <div className="moment-author">{basicConfig.author}</div>
                    <div className="moment-time">{formatMomentTime(moment.publishTime)}</div>
                  </div>
                </div>

                <div className="moment-content">
                  {moment.content.text && <div className="moment-text">{moment.content.text}</div>}

                  {moment.content.images && moment.content.images.length > 0 && (
                    <div
                      className={`moment-images images-${Math.min(moment.content.images.length, 6)}`}
                    >
                      {moment.content.images.slice(0, 6).map((image, index) => (
                        <div key={index} className="image-item">
                          <img
                            src={image}
                            alt={`图片 ${index + 1}`}
                            loading="lazy"
                            onClick={handleImageClick}
                          />
                          {index === 5 && moment.content.images!.length > 6 && (
                            <div className="more-images-overlay">
                              <i className="ri-image-line"></i>
                              <span>+{moment.content.images!.length - 6}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {moment.content.video && (
                    <div className="moment-video">
                      {!moment.content.video.platform ||
                      moment.content.video.platform === "local" ? (
                        <video src={moment.content.video.url} controls preload="metadata"></video>
                      ) : moment.content.video.platform === "bilibili" ? (
                        <iframe
                          src={`//player.bilibili.com/player.html?bvid=${moment.content.video.video_id}&autoplay=0`}
                          scrolling="no"
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>
                      ) : moment.content.video.platform === "youtube" ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${moment.content.video.video_id}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : null}
                    </div>
                  )}

                  {moment.content.music && <MusicPlayer music={moment.content.music} />}

                  {moment.content.link && (
                    <a
                      href={moment.content.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="moment-link"
                    >
                      {moment.content.link.favicon && (
                        <img
                          src={moment.content.link.favicon}
                          alt="favicon"
                          className="link-favicon"
                          loading="lazy"
                        />
                      )}
                      <div className="link-info">
                        <div className="link-title">{moment.content.link.title}</div>
                        <div className="link-url">{moment.content.link.url}</div>
                      </div>
                      <i className="ri-external-link-line"></i>
                    </a>
                  )}
                </div>

                {/* <div className="moment-footer">
                  <div className="moment-info">
                    {moment.content.location && (
                      <span className="location">
                        <i className="ri-map-pin-line"></i>
                        {moment.content.location}
                      </span>
                    )}
                    {moment.content.tags && (
                      <span className="tags">
                        <i className="ri-price-tag-3-line"></i>
                        {moment.content.tags}
                      </span>
                    )}
                  </div>
                </div> */}
              </div>
            ))}
          </div>
        )}

        {moments.length > 0 && (
          <div className="moment-tip">
            <i className="ri-information-line"></i>
            <span>只显示最近30条动态</span>
          </div>
        )}
      </div>

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
    </DefaultLayout>
  );
}
