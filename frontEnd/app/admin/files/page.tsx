"use client";

import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Grid, List, Trash2 } from "lucide-react";
import ModernAdminLayout from "@/components/admin/modernAdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUploader, FileCard, FilePreviewModal } from "@/components/admin/file-manager";
import { DeleteConfirmDialog } from "@/components/ui/confirm-dialog";
import { getMyAssets, uploadFile, deleteFile, type UploadFile } from "@/lib/api/uploadApi";
import { toast } from "sonner";

export default function FileManagerPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [fileType, setFileType] = useState<string>("all");
  const [previewFile, setPreviewFile] = useState<UploadFile | null>(null);
  const [deleteFileItem, setDeleteFileItem] = useState<UploadFile | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data, isLoading } = useQuery({
    queryKey: ["assets", page],
    queryFn: () => getMyAssets(page, 20)
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadFile(file),
    onSuccess: () => {
      toast.success("上传成功");
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "上传失败");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (objectName: string) => deleteFile(objectName),
    onSuccess: () => {
      toast.success("删除成功");
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "删除失败");
    }
  });

  const handleUpload = useCallback(
    async (file: File) => {
      await uploadMutation.mutateAsync(file);
    },
    [uploadMutation]
  );

  const handleDelete = useCallback(() => {
    if (deleteFileItem) {
      deleteMutation.mutate(deleteFileItem.objectName);
      setDeleteFileItem(null);
    }
  }, [deleteFileItem, deleteMutation]);

  const filteredFiles = data?.data.filter((file) => {
    const matchesSearch = file.fileName.toLowerCase().includes(search.toLowerCase());
    const matchesType = fileType === "all" || file.fileType === fileType;
    return matchesSearch && matchesType;
  });

  return (
    <ModernAdminLayout>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></div>
          <h1 className="text-xl font-semibold text-gray-900">文件管理</h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <FileUploader onUpload={handleUpload} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索文件名..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部类型</option>
              <option value="image">图片</option>
              <option value="video">视频</option>
              <option value="document">文档</option>
              <option value="other">其他</option>
            </select>

            <div className="flex gap-1 border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid" ? "bg-black text-white" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list" ? "bg-black text-white" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : filteredFiles && filteredFiles.length > 0 ? (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredFiles.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onPreview={setPreviewFile}
                      onDelete={setDeleteFileItem}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {file.fileType === "image" ? (
                          <img
                            src={file.fileUrl}
                            alt={file.fileName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-gray-500">
                            {file.fileName.split(".").pop()?.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.fileName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(file.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setPreviewFile(file)}>
                          预览
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteFileItem(file)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    上一页
                  </Button>
                  <span className="text-sm text-gray-600">
                    第 {page} / {data.totalPages} 页
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= data.totalPages}
                  >
                    下一页
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              {search || fileType !== "all" ? "没有找到匹配的文件" : "暂无上传文件"}
            </div>
          )}
        </div>
      </div>

      <FilePreviewModal
        file={previewFile}
        open={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />

      {deleteFileItem && (
        <DeleteConfirmDialog
          open={!!deleteFileItem}
          onClose={() => setDeleteFileItem(null)}
          onConfirm={handleDelete}
          itemName={deleteFileItem.fileName}
          itemType="文件"
        />
      )}
    </ModernAdminLayout>
  );
}
