"use client";

import { X, Download, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogPortal,
  DialogPrimitive
} from "@/components/ui/dialog";
import { formatFileSize, type UploadFile } from "@/lib/api/uploadApi";

interface FilePreviewModalProps {
  file: UploadFile | null;
  open: boolean;
  onClose: () => void;
}

export function FilePreviewModal({ file, open, onClose }: FilePreviewModalProps) {
  const [copied, setCopied] = useState(false);

  if (!file) return null;

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogTitle className="sr-only">{file.fileName} 预览</DialogTitle>
        <div className="flex flex-col h-[80vh] max-h-[80vh]">
          <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
            <h3 className="font-medium text-gray-900 truncate flex-1 mr-4">{file.fileName}</h3>
          </div>

          <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-50 min-h-0">
            {file.fileType === "image" && (
              <img
                src={file.fileUrl}
                alt={file.fileName}
                className="max-w-full max-h-[50vh] object-contain rounded-lg"
              />
            )}
            {file.fileType === "video" && (
              <video src={file.fileUrl} controls className="max-w-full max-h-[50vh] rounded-lg" />
            )}
            {file.fileType === "document" && (
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <span className="text-4xl font-bold text-blue-600">
                    {file.fileName.split(".").pop()?.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600">预览暂不可用，请下载查看</p>
              </div>
            )}
            {file.fileType === "other" && (
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-500">
                    {file.fileName.split(".").pop()?.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600">此文件类型暂不支持预览</p>
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t bg-white flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-sm text-gray-500 space-y-1">
                <p>大小：{formatFileSize(file.fileSize)}</p>
                <p>上传时间：{new Date(file.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="flex-1 sm:flex-initial"
                >
                  {copied ? (
                    <Check className="h-4 w-4 mr-1 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  {copied ? "已复制" : "复制链接"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex-1 sm:flex-initial"
                >
                  <Download className="h-4 w-4 mr-1" />
                  下载
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
