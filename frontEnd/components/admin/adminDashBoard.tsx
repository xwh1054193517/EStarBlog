"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  FolderOpen,
  Tags,
  Eye,
  Clock,
  CheckCircle2,
  Star,
  BarChart3,
  Activity
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getDashboardStats } from "@/lib/api/statsApi";
import { getProfile } from "@/lib/api/authApi";
import { AdminLoading } from "@/components/ui/loading";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  gradient: string;
}

function StatCard({ title, value, description, icon, gradient }: Omit<StatCardProps, "trend">) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-lg hover:scale-[1.02] duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {value.toLocaleString()}
          </div>
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center shadow-lg`}
        >
          {icon}
        </div>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return "夜深了";
  if (hour < 9) return "早上好";
  if (hour < 12) return "上午好";
  if (hour < 14) return "中午好";
  if (hour < 18) return "下午好";
  if (hour < 22) return "晚上好";
  return "夜深了";
}

function calculateDays() {
  const now = new Date();
  const startDate = new Date("2025-09-30");
  const targetDate = new Date("2026-03-05");
  const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return { daysSinceStart };
}

export default function adminDashBoard() {
  const { daysSinceStart } = calculateDays();
  const greeting = getGreeting();

  const [stats, setStats] = useState({
    postCount: 0,
    publishedPostCount: 0,
    draftPostCount: 0,
    categoryCount: 0,
    tagCount: 0,
    onlineUsers: 0
  });
  const [displayName, setDisplayName] = useState("博主");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashboardStats, profile] = await Promise.all([getDashboardStats(), getProfile()]);

        setStats(dashboardStats);
        setDisplayName(profile.username || "博主");
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const publishRate =
    stats.postCount > 0 ? Math.round((stats.publishedPostCount / stats.postCount) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <AdminLoading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 欢迎信息卡片 */}
      <div className="bg-black dark:bg-white rounded-2xl p-8 text-white dark:text-black shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">
              {greeting}，{displayName} 👋
            </h2>
            <p className="text-gray-300 dark:text-gray-600 text-lg mb-6">欢迎回到你的创作空间</p>

            <div className="grid grid-cols-2 gap-6 max-w-md">
              <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="h-5 w-5" />
                  <span className="text-sm font-medium">已坚持</span>
                </div>
                <div className="text-3xl font-bold">{daysSinceStart}</div>
                <div className="text-xs opacity-70 mt-1">天</div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BarChart3 className="h-16 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* 核心数据统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="全部文章"
          value={stats.postCount}
          description={`${stats.publishedPostCount} 已发布 · ${stats.draftPostCount} 草稿`}
          icon={<FileText className="h-6 w-6 text-white dark:text-black" />}
          gradient="bg-black dark:bg-white"
        />

        <StatCard
          title="在线用户"
          value={stats.onlineUsers}
          description="当前在线用户数"
          icon={<Eye className="h-6 w-6 text-white dark:text-black" />}
          gradient="bg-black dark:bg-white"
        />

        <StatCard
          title="分类"
          value={stats.categoryCount}
          description="内容分类数量"
          icon={<FolderOpen className="h-6 w-6 text-white dark:text-black" />}
          gradient="bg-black dark:bg-white"
        />

        <StatCard
          title="标签"
          value={stats.tagCount}
          description="文章标签数量"
          icon={<Tags className="h-6 w-6 text-white dark:text-black" />}
          gradient="bg-black dark:bg-white"
        />
      </div>

      {/* 发布进度和精选文章 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 发布进度 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">发布进度</h3>
            <CheckCircle2 className="h-5 w-5 text-gray-900 dark:text-gray-100" />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">已发布文章</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {stats.publishedPostCount} / {stats.postCount}
                </span>
              </div>
              <Progress value={publishRate} className="h-2" />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {publishRate}% 完成
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-black dark:text-white">
                  {stats.publishedPostCount}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">已发布</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {stats.draftPostCount}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">草稿</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                  {stats.postCount - stats.publishedPostCount - stats.draftPostCount}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">其他</div>
              </div>
            </div>
          </div>
        </div>

        {/* 快速统计 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">内容概览</h3>
            <Star className="h-5 w-5 text-yellow-500" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-black dark:text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">发布率</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {publishRate}%
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                  <FolderOpen className="h-5 w-5 text-black dark:text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  每分类文章数
                </span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {stats.categoryCount > 0 ? Math.round(stats.postCount / stats.categoryCount) : 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                  <Tags className="h-5 w-5 text-black dark:text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  每标签文章数
                </span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {stats.postCount > 0 ? (stats.tagCount / stats.postCount).toFixed(1) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
