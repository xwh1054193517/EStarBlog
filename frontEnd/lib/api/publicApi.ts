import { api } from "./useFetch";
import type { Category } from "./categoryApi";

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  description?: string;
  postCount?: number;
  createdAt: string;
  updatedAt: string;
}

export async function getPublicCategories(): Promise<Category[]> {
  return api.get<Category[]>("/categories");
}

export async function getPublicTags(): Promise<Tag[]> {
  return api.get<Tag[]>("/tags");
}
