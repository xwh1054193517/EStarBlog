import { api } from "./useFetch";

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  postCount?: number;
}

export interface PaginatedTagsResponse {
  data: Tag[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateTagDto {
  name: string;
  slug: string;
  color?: string;
  description?: string;
}

export interface UpdateTagDto {
  name?: string;
  slug?: string;
  color?: string;
  description?: string;
}

export interface GetTagsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export async function getTags(params: GetTagsParams = {}): Promise<PaginatedTagsResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.pageSize) queryParams.set("pageSize", String(params.pageSize));
  if (params.search) queryParams.set("search", params.search);

  const query = queryParams.toString();
  return api.get<PaginatedTagsResponse>(`/admin/tags${query ? `?${query}` : ""}`);
}

export async function createTag(data: CreateTagDto): Promise<Tag> {
  return api.post<Tag>("/admin/tags", data);
}

export async function updateTag(id: string, data: UpdateTagDto): Promise<Tag> {
  return api.patch<Tag>(`/admin/tags/${id}`, data);
}

export async function deleteTag(id: string): Promise<void> {
  return api.delete<void>(`/admin/tags/${id}`);
}

export async function batchDeleteTags(ids: string[]): Promise<void> {
  return api.post<void>("/admin/tags/batch", { ids });
}
