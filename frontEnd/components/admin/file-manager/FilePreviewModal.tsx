"use client";

import { X, Download, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium text-gray-900 truncate flex-1 mr-4">{file.fileName}</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-50">
            {file.fileType === "image" && (
              <img
                src={file.fileUrl}
                alt={file.fileName}
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
              />
            )}
            {file.fileType === "video" && (
              <video
                src={file.fileUrl}
                controls
                className="max-w-full max-h-[60vh] rounded-lg"
              />
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

          <div className="p-4 border-t bg-white">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-gray-500 space-y-1">
                <p>大小：{formatFileSize(file.fileSize)}</p>
                <p>上传时间：{new Date(file.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-4 w-4 mr-1 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  {copied ? "已复制" : "复制链接"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
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
