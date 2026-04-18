import { api } from "./useFetch";

export interface DashboardStats {
  postCount: number;
  publishedPostCount: number;
  draftPostCount: number;
  categoryCount: number;
  tagCount: number;
  onlineUsers: number;
}

export interface SiteStats {
  postCount: number;
  categoryCount: number;
  tagCount: number;
  onlineUsers: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return api.get<DashboardStats>("/admin/stats/dashboard");
}

export async function getSiteStats(): Promise<SiteStats> {
  return api.get<SiteStats>("/stats/site");
}
