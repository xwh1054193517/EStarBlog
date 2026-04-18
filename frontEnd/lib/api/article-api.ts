import { useQuery } from "@tanstack/react-query";
import { api } from "./useFetch";
import type { Article } from "@/lib/types";

export interface ArticleListResponse {
  list: Article[];
  total: number;
  page: number;
  pageSize: number;
}

export function useArticles(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
}) {
  return useQuery<ArticleListResponse>({
    queryKey: ["articles", params],
    queryFn: () =>
      api.get<ArticleListResponse>("/posts", { params: params as any })
  });
}

export function useArticle(slug: string) {
  return useQuery<Article>({
    queryKey: ["article", slug],
    queryFn: () => api.get<Article>(`/posts/${slug}`),
    enabled: !!slug
  });
}
