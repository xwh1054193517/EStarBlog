"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSize?: number;
}

export function FileUploader({
  onUpload,
  accept = "image/*,video/*,.pdf,.doc,.docx",
  maxSize = 20 * 1024 * 1024,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.size > maxSize) {
        setError(`文件大小不能超过 ${maxSize / 1024 / 1024}MB`);
        return;
      }
      setError(null);
      setUploading(true);
      setProgress(0);

      try {
        await onUpload(file);
        setProgress(100);
      } catch (err) {
        setError(err instanceof Error ? err.message : "上传失败");
      } finally {
        setUploading(false);
        setTimeout(() => setProgress(0), 1000);
      }
    },
    [onUpload, maxSize]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="space-y-3">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        {uploading ? (
          <div className="space-y-3">
            <FileIcon className="mx-auto h-10 w-10 text-gray-400 animate-pulse" />
            <p className="text-sm text-gray-600">上传中...</p>
            <Progress value={progress} className="w-48 mx-auto" />
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              拖拽文件到此处，或{" "}
              <span className="text-blue-600 font-medium">点击选择</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              支持图片、视频、PDF、Word 文档，最大 20MB
            </p>
          </>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          <X className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
