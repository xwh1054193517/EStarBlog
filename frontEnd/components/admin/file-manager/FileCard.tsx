"use client";

import { Eye, Trash2, Download, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatFileSize, type UploadFile } from "@/lib/api/uploadApi";

interface FileCardProps {
  file: UploadFile;
  onPreview: (file: UploadFile) => void;
  onDelete: (file: UploadFile) => void;
}

export function FileCard({ file, onPreview, onDelete }: FileCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(file.fileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("复制失败");
    }
  };

  const handleDownload = () => {
    window.open(file.fileUrl, "_blank");
  };

  const getFileIcon = () => {
    switch (file.fileType) {
      case "image":
        return (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
              src={file.fileUrl}
              alt={file.fileName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        );
      case "video":
        return (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <video src={file.fileUrl} className="w-full h-full object-cover" />
          </div>
        );
      case "document":
        return (
          <div className="w-full h-full bg-blue-50 flex items-center justify-center">
            <span className="text-4xl font-bold text-blue-600">
              {file.fileName.split(".").pop()?.toUpperCase()}
            </span>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-2xl font-semibold text-gray-500">
              {file.fileName.split(".").pop()?.toUpperCase()}
            </span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div
        className="aspect-square cursor-pointer relative group"
        onClick={() => onPreview(file)}
      >
        {getFileIcon()}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(file);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            预览
          </Button>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <p className="text-sm font-medium text-gray-900 truncate" title={file.fileName}>
          {file.fileName}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatFileSize(file.fileSize)}</span>
          <span>{new Date(file.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="flex-1 h-8"
          >
            {copied ? (
              <Check className="h-3 w-3 mr-1 text-green-600" />
            ) : (
              <Copy className="h-3 w-3 mr-1" />
            )}
            {copied ? "已复制" : "复制"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDownload}
            className="flex-1 h-8"
          >
            <Download className="h-3 w-3 mr-1" />
            下载
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(file)}
            className="flex-1 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            删除
          </Button>
        </div>
      </div>
    </div>
  );
}
