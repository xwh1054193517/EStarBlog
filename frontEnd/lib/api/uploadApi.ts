import { api, getCookie } from "./useFetch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export type FileType = "image" | "video" | "document" | "other";

export interface UploadFile {
  id: string;
  objectName: string;
  fileName: string;
  fileType: FileType;
  fileSize: number;
  fileUrl: string;
  createdAt: string;
}

interface AssetFromApi {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  storageKey: string;
  url: string;
  createdAt: string;
}

export interface AssetsResponse {
  data: UploadFile[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function convertAsset(asset: AssetFromApi): UploadFile {
  return {
    id: asset.id,
    objectName: asset.storageKey,
    fileName: asset.originalName || asset.filename,
    fileType: getFileType(asset.mimeType),
    fileSize: asset.size,
    fileUrl: asset.url,
    createdAt: asset.createdAt,
  };
}

export interface PresignedUrlResponse {
  objectName: string;
  url: string;
}

function getFileType(mimeType: string | undefined): FileType {
  if (!mimeType) return "other";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (
    mimeType.includes("pdf") ||
    mimeType.includes("document") ||
    mimeType.includes("text/")
  )
    return "document";
  return "other";
}

export async function getMyAssets(
  page = 1,
  pageSize = 20
): Promise<AssetsResponse> {
  const response = await api.get<{
    data: AssetFromApi[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>("/uploads/my-assets", {
    params: { page, pageSize },
  });

  return {
    ...response,
    data: response.data.map(convertAsset),
  };
}

export async function uploadFile(
  file: File,
  prefix?: string,
  onProgress?: (progress: number) => void
): Promise<UploadFile> {
  const formData = new FormData();
  formData.append("file", file);
  if (prefix) {
    formData.append("prefix", prefix);
  }

  const token = getCookie("accessToken");
  const url = `${API_BASE_URL}/uploads/upload${prefix ? `?prefix=${encodeURIComponent(prefix)}` : ""}`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          const result: UploadFile = {
            id: response.id,
            objectName: response.storageKey,
            fileName: response.originalName || file.name,
            fileType: getFileType(response.mimeType || file.type),
            fileSize: response.size || file.size,
            fileUrl: response.url,
            createdAt: response.createdAt || new Date().toISOString(),
          };
          resolve(result);
        } catch {
          reject(new Error("Failed to parse response"));
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));

    xhr.open("POST", url);
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
    xhr.send(formData);
  });
}

export async function getPresignedUrl(
  objectName: string,
  expiresIn = 3600
): Promise<PresignedUrlResponse> {
  return api.get<PresignedUrlResponse>(
    `/uploads/${encodeURIComponent(objectName)}/presigned-url`,
    {
      params: { expiresIn },
      skipAuth: true,
    }
  );
}

export async function deleteFile(objectName: string): Promise<void> {
  return api.delete(`/uploads/${encodeURIComponent(objectName)}`);
}

export function getFileUrl(objectName: string): string {
  return `${API_BASE_URL}/uploads/${encodeURIComponent(objectName)}/download`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
