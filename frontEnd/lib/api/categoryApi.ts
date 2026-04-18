import { api } from "./useFetch";

export interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
  description?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  postCount?: number;
}

export interface PaginatedCategoriesResponse {
  data: Category[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  color?: string;
  icon?: string;
  description?: string;
  sortOrder?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  color?: string;
  icon?: string;
  description?: string;
  sortOrder?: number;
}

export interface GetCategoriesParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export async function getCategories(
  params: GetCategoriesParams = {}
): Promise<PaginatedCategoriesResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.pageSize) queryParams.set("pageSize", String(params.pageSize));
  if (params.search) queryParams.set("search", params.search);

  const query = queryParams.toString();
  return api.get<PaginatedCategoriesResponse>(`/admin/categories${query ? `?${query}` : ""}`);
}

export async function createCategory(data: CreateCategoryDto): Promise<Category> {
  return api.post<Category>("/admin/categories", data);
}

export async function updateCategory(id: string, data: UpdateCategoryDto): Promise<Category> {
  return api.patch<Category>(`/admin/categories/${id}`, data);
}

export async function deleteCategory(id: string): Promise<void> {
  return api.delete<void>(`/admin/categories/${id}`);
}

export async function batchDeleteCategories(ids: string[]): Promise<void> {
  return api.post<void>("/admin/categories/batch", { ids });
}
