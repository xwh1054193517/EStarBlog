import { api } from "./useFetch";

export interface BlogConfig {
  title: string;
  subtitle: string;
  typingTexts: string[];
  announcement: string;
  established: string;
}

export interface BasicConfig {
  author: string;
  authorDesc: string;
  authorAvatar: string;
  homeUrl: string;
}

export interface SiteConfigResponse {
  blog: BlogConfig;
  basic: BasicConfig;
}

export async function getSiteConfig(): Promise<SiteConfigResponse> {
  return api.get<SiteConfigResponse>("/site-config");
}

export async function getBlogConfig(): Promise<BlogConfig> {
  return api.get<BlogConfig>("/site-config/blog");
}

export async function getBasicConfig(): Promise<BasicConfig> {
  return api.get<BasicConfig>("/site-config/basic");
}

export async function updateBlogConfig(data: Partial<BlogConfig>): Promise<BlogConfig> {
  return api.patch<BlogConfig>("/site-config/blog", data);
}

export async function updateBasicConfig(data: Partial<BasicConfig>): Promise<BasicConfig> {
  return api.patch<BasicConfig>("/site-config/basic", data);
}
