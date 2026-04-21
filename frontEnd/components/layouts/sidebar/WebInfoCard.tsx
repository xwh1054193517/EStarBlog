"use client";

import { useQuery } from "@tanstack/react-query";
import type { SiteStats as SiteStatsType } from "@/lib/api/statsApi";
import { getSiteStats } from "@/lib/api/statsApi";

export default function WebInfoCard() {
  const { data: stats } = useQuery<SiteStatsType>({
    queryKey: ["siteStats"],
    queryFn: getSiteStats,
    refetchInterval: 60000,
  });

  if (!stats) {
    return (
      <div className="card-widget card-webinfo">
        <div className="item-headline">
          <i className="ri-line-chart-fill" />
          <span>网站信息</span>
        </div>
        <div className="webinfo">
          <div className="webinfo-item">
            <div className="item-name">本站访客量 :</div>
            <div className="item-count">-</div>
          </div>
          <div className="webinfo-item">
            <div className="item-name">本站总浏览量 :</div>
            <div className="item-count">-</div>
          </div>
          <div className="webinfo-item">
            <div className="item-name">当前在线人数 :</div>
            <div className="item-count">-</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-widget card-webinfo">
      <div className="item-headline">
        <i className="ri-line-chart-fill" />
        <span>网站信息</span>
      </div>
      <div className="webinfo">
        <div className="webinfo-item">
          <div className="item-name">本站访客量 :</div>
          <div className="item-count">{stats.totalVisitors}</div>
        </div>
        <div className="webinfo-item">
          <div className="item-name">本站总浏览量 :</div>
          <div className="item-count">{stats.totalPageViews}</div>
        </div>
        <div className="webinfo-item">
          <div className="item-name">当前在线人数 :</div>
          <div className="item-count">{stats.onlineUsers}</div>
        </div>
      </div>
    </div>
  );
}
