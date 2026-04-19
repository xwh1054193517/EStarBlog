import { api } from "./useFetch";
import type { ArchiveItem } from "@/lib/types";

export async function getArchives(): Promise<ArchiveItem[]> {
  return api.get<ArchiveItem[]>("/posts/archives");
}
