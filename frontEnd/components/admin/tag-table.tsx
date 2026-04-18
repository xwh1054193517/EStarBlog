"use client";

/**
 * 统一风格的标签管理表格
 */

import { useState } from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Edit, Trash2, Tags, FileText, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/ui/confirm-dialog";
import { ModernTable } from "@/components/ui/modern-table";
import { useQuery } from "@tanstack/react-query";
import { getTags, deleteTag, batchDeleteTags, Tag, PaginatedTagsResponse } from "@/lib/api/tagApi";
import { toast } from "sonner";

interface UnifiedTagsTableProps {
  onEdit?: (tag: Tag & { color?: string }) => void;
  onCreate?: () => void;
  onTagDeleted?: () => void;
}

export default function TagTable({ onEdit, onCreate, onTagDeleted }: UnifiedTagsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTagItem, setDeleteTag] = useState<Tag | null>(null);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tags", page, pageSize, searchQuery],
    queryFn: () => getTags({ page, pageSize, search: searchQuery || undefined }),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true
  });
  const tags: Tag[] = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 0;

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "yyyy年MM月dd日", { locale: zhCN });
  };

  const handleDelete = async (tag: Tag) => {
    try {
      await deleteTag(tag.id);
      toast.success(`标签 "${tag.name}" 已删除`);
      setSelectedIds((prev) => prev.filter((id) => id !== tag.id));
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "删除失败");
    }
  };

  const handleBatchDelete = async (ids: string[]) => {
    try {
      await batchDeleteTags(ids);
      toast.success(`${ids.length} 个标签已删除`);
      setSelectedIds([]);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "批量删除失败");
    } finally {
      setIsBatchDeleting(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const columns = [
    {
      key: "name",
      title: "标签",
      width: "w-40",
      render: (_: unknown, tag: Tag) => (
        <div className="flex items-center space-x-2">
          {tag.color && (
            <div
              className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-600 shrink-0"
              style={{ backgroundColor: tag.color }}
            />
          )}
          <Badge variant="secondary" className="font-medium rounded-lg">
            {tag.name}
          </Badge>
        </div>
      )
    },
    {
      key: "slug",
      title: "URL",
      width: "flex-1",
      render: (_: unknown, tag: Tag) => (
        <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm text-gray-600 dark:text-gray-300">
          {tag.slug}
        </code>
      )
    },
    {
      key: "postCount",
      title: "文章数量",
      width: "w-32",
      className: "text-center",
      render: (_: unknown, tag: Tag) => (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-black dark:text-white" />
          </div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {tag.postCount || 0} 篇
          </span>
        </div>
      )
    },
    {
      key: "createdAt",
      title: "创建时间",
      width: "w-40",
      className: "text-center",
      render: (_: unknown, tag: Tag) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(tag.createdAt)}
        </span>
      )
    },
    {
      key: "actions",
      title: "操作",
      width: "w-24",
      className: "text-center",
      render: (_: unknown, tag: Tag) => (
        <div className="flex items-center justify-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => onEdit?.(tag)}
            title="编辑"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={() => setDeleteTag(tag)}
            title="删除"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const batchActions = [
    {
      label: "批量删除",
      onClick: () => setIsBatchDeleting(true),
      variant: "danger" as const,
      icon: <Trash2 className="h-4 w-4 mr-2" />
    }
  ];

  return (
    <>
      <DeleteConfirmDialog
        open={!!deleteTagItem}
        onClose={() => setDeleteTag(null)}
        onConfirm={async () => {
          if (deleteTagItem) await handleDelete(deleteTagItem);
        }}
        itemType="标签"
        itemName={deleteTagItem?.name || ""}
      />

      <DeleteConfirmDialog
        open={isBatchDeleting}
        onClose={() => setIsBatchDeleting(false)}
        onConfirm={async () => {
          await handleBatchDelete(selectedIds);
        }}
        itemType="标签"
        itemName={`选中的 ${selectedIds.length} 个标签`}
      />
      <ModernTable<Tag>
        data={tags}
        columns={columns}
        loading={isLoading}
        error={error ? (error instanceof Error ? error.message : String(error)) : null}
        searchable={true}
        searchPlaceholder="搜索标签名称..."
        onSearch={handleSearch}
        onForceRefresh={() => refetch()}
        selectable={true}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        createButton={{
          label: "新建标签",
          onClick: onCreate,
          icon: <Plus className="mr-2 h-4 w-4" />
        }}
        batchActions={batchActions}
        emptyIcon={<Tags className="h-10 w-10 text-gray-400" />}
        emptyTitle="暂无标签"
        emptyDescription="创建第一个标签来组织您的内容"
        getRecordId={(tag) => tag.id}
        onRetry={refetch}
        pagination={{
          page,
          pageSize,
          total,
          totalPages,
          onPageChange: setPage
        }}
      />
    </>
  );
}
