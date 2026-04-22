import { useQuery } from "@tanstack/react-query";
import { api } from "./useFetch";
import type { Article, TocSection } from "@/lib/types";

export interface ArticleListResponse {
  items: Article[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ArticleListResult {
  items: Article[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchArticleItem {
  id: string;
  title: string;
  excerpt: string;
  cover?: string;
  url: string;
  publishTime: string;
  category?: {
    id: number;
    name: string;
    url: string;
  };
}

export interface SearchArticlesResult {
  list: SearchArticleItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface PostFromApi {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  published: boolean;
  featured: boolean;
  views: number;
  readingTime?: number | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string; slug: string } | null;
  tags: { id: string; name: string; slug: string }[];
}

function safeNumber(value: string | number | null | undefined, fallback: number = 0): number {
  if (value === null || value === undefined) return fallback;
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
}

function convertPostToArticle(post: PostFromApi): Article {
  return {
    id: safeNumber(post.id),
    slug: post.slug,
    url: `/posts/${post.slug}`,
    title: post.title,
    summary: post.excerpt || "",
    cover: post.coverImage || undefined,
    content: post.content,
    publishTime: post.publishedAt || post.createdAt,
    updateTime: post.updatedAt,
    viewCount: post.views,
    commentCount: 0,
    category: post.category
      ? {
          id: safeNumber(post.category.id),
          name: post.category.name,
          url: `/categories/${post.category.slug}`
        }
      : { id: 0, name: "未分类", url: "/categories/uncategorized" },
    sections: [] as TocSection[],
    isTop: post.featured,
    isEssence: false,
    tags: post.tags.map((tag) => ({
      id: safeNumber(tag.id),
      name: tag.name,
      url: `/tags/${tag.slug}`
    }))
  };
}

function convertPostToSearchArticle(post: PostFromApi): SearchArticleItem {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || "",
    cover: post.coverImage || undefined,
    url: `/posts/${post.slug}`,
    publishTime: post.publishedAt || post.createdAt,
    category: post.category
      ? {
          id: safeNumber(post.category.id),
          name: post.category.name,
          url: `/categories/${post.category.slug}`
        }
      : undefined
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function getArticleCount(): Promise<number> {
  const result = await getArticles({ page: 1, pageSize: 1 });
  return result.pagination.total;
}

export async function getArticles(params?: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  category?: string;
  tag?: string;
  year?: string;
  month?: string;
}): Promise<ArticleListResult> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize));
  if (params?.keyword) searchParams.set("keyword", params.keyword);
  if (params?.category) searchParams.set("category", params.category);
  if (params?.tag) searchParams.set("tag", params.tag);
  if (params?.year) searchParams.set("year", params.year);
  if (params?.month) searchParams.set("month", params.month);

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/posts${queryString ? `?${queryString}` : ""}`;
  console.warn("url", url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.status}`);
  }

  const data = await response.json();
  console.warn("data", data);
  return {
    items: (data.items || []).map(convertPostToArticle),
    pagination: data.pagination || {
      page: params?.page || 1,
      pageSize: params?.pageSize || 10,
      total: 0,
      totalPages: 0
    }
  };
}

export async function searchArticles(
  keyword: string,
  params?: {
    page?: number;
    pageSize?: number;
  }
): Promise<SearchArticlesResult> {
  const searchParams = new URLSearchParams();
  searchParams.set("keyword", keyword);
  searchParams.set("page", String(params?.page ?? 1));
  searchParams.set("pageSize", String(params?.pageSize ?? 5));

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/posts?${queryString}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to search articles: ${response.status}`);
  }

  const data = await response.json();
  const pagination = data.pagination || {
    page: params?.page || 1,
    pageSize: params?.pageSize || 5,
    total: 0,
    totalPages: 0
  };

  return {
    list: (data.items || []).map(convertPostToSearchArticle),
    total: pagination.total,
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalPages: pagination.totalPages
  };
}

export function useArticles(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  year?: string;
  month?: string;
}) {
  return useQuery<ArticleListResult>({
    queryKey: ["articles", params],
    queryFn: async () => {
      const response = await api.get<{
        items: PostFromApi[];
        pagination: {
          page: number;
          pageSize: number;
          total: number;
          totalPages: number;
        };
      }>("/posts", { params: params as any });
      return {
        items: response.items.map(convertPostToArticle),
        pagination: response.pagination
      };
    }
  });
}

export function useArticle(slug: string) {
  return useQuery<Article>({
    queryKey: ["article", slug],
    queryFn: async () => {
      const post = await api.get<PostFromApi>(`/posts/${slug}`);
      return convertPostToArticle(post);
    },
    enabled: !!slug
  });
}

export async function incrementArticleView(slug: string): Promise<void> {
  try {
    await api.post(`/posts/${slug}/views`);
  } catch (error) {
    console.warn("Failed to increment article view:", error);
  }
}

export interface AdminPostItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  featured: boolean;
  views: number;
  readingTime: number | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string; slug: string } | null;
  tags: { id: string; name: string; slug: string }[];
}

export interface AdminPostListResponse {
  items: AdminPostItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminPostQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  category?: string;
  tag?: string[];
  published?: boolean;
  featured?: boolean;
}

export async function getAdminPosts(query?: AdminPostQuery): Promise<AdminPostListResponse> {
  const response = await api.post<AdminPostListResponse>("/admin/posts/list", query);
  return {
    items: response.items || [],
    pagination: response.pagination || {
      page: query?.page || 1,
      pageSize: query?.pageSize || 10,
      total: 0,
      totalPages: 0
    }
  };
}

export async function updatePost(
  id: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    published?: boolean;
    featured?: boolean;
    categoryId?: string;
    tags?: string[];
    publishedAt?: string;
  }
): Promise<AdminPostItem> {
  return api.patch<AdminPostItem>(`/admin/posts/${id}`, data);
}

export async function deletePost(id: string): Promise<void> {
  return api.delete<void>(`/admin/posts/${id}`);
}
