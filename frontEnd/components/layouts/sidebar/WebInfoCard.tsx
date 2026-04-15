import type { SiteStats } from "@/lib/types";
import { getRunningDays } from "@/lib/utils";

export default function WebInfoCard({
  stats,
  established
}: {
  stats: SiteStats;
  established: string;
}) {
  return (
    <div className="card-widget card-webinfo">
      <div className="item-headline">
        <i className="ri-line-chart-fill" />
        <span>网站信息</span>
      </div>
      <div className="webinfo">
        <div className="webinfo-item">
          <div className="item-name">本站总字数 :</div>
          <div className="item-count">{stats.totalWords}</div>
        </div>
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
        <div className="webinfo-item">
          <div className="item-name">网站运行天数 :</div>
          <div className="item-count">{getRunningDays(established)}</div>
        </div>
      </div>
    </div>
  );
}
