"use client";

/**
 * 统一风格的分类管理表格
 */

import { useState } from "react";
import { Edit, Trash2, FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/ui/confirm-dialog";
import { ModernTable } from "@/components/ui/modern-table";
import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  deleteCategory,
  batchDeleteCategories,
  Category
} from "@/lib/api/categoryApi";
import { toast } from "sonner";

interface UnifiedCategoriesTableProps {
  onEdit?: (category: Category) => void;
  onCreate?: () => void;
  onCategoryDeleted?: () => void;
}

export default function CategoryTable({
  onEdit,
  onCreate,
  onCategoryDeleted
}: UnifiedCategoriesTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteCategoryItem, setDeleteCategory] = useState<Category | null>(null);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["categories", page, pageSize, searchQuery],
    queryFn: () => getCategories({ page, pageSize, search: searchQuery || undefined }),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true
  });

  const categories: Category[] = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 0;

  const handleDelete = async (category: Category) => {
    try {
      await deleteCategory(category.id);
      toast.success(`分类 "${category.name}" 已删除`);
      setSelectedIds((prev) => prev.filter((id) => id !== category.id));
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "删除失败");
    }
  };

  const handleBatchDelete = async (ids: string[]) => {
    try {
      await batchDeleteCategories(ids);
      toast.success(`${ids.length} 个分类已删除`);
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
      title: "分类",
      width: "w-40",
      render: (_: unknown, category: Category) => (
        <div className="flex items-center space-x-2">
          {category.color && (
            <div
              className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-600 shrink-0"
              style={{ backgroundColor: category.color }}
            />
          )}
          <span className="font-medium text-gray-900 dark:text-gray-100">{category.name}</span>
        </div>
      )
    },
    {
      key: "slug",
      title: "URL",
      width: "flex-1",
      render: (_: unknown, category: Category) => (
        <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm text-gray-600 dark:text-gray-300">
          {category.slug}
        </code>
      )
    },
    {
      key: "postCount",
      title: "文章数量",
      width: "w-32",
      className: "text-center",
      render: (_: unknown, category: Category) => (
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {category.postCount || 0} 篇
        </span>
      )
    },
    {
      key: "sortOrder",
      title: "排序",
      width: "w-24",
      className: "text-center",
      render: (_: unknown, category: Category) => (
        <span className="font-medium text-gray-700 dark:text-gray-300">{category.sortOrder}</span>
      )
    },
    {
      key: "actions",
      title: "操作",
      width: "w-24",
      className: "text-center",
      render: (_: unknown, category: Category) => (
        <div className="flex items-center justify-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => onEdit?.(category)}
            title="编辑"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={() => setDeleteCategory(category)}
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
        open={!!deleteCategoryItem}
        onClose={() => setDeleteCategory(null)}
        onConfirm={async () => {
          if (deleteCategoryItem) await handleDelete(deleteCategoryItem);
        }}
        itemType="分类"
        itemName={deleteCategoryItem?.name || ""}
      />

      <DeleteConfirmDialog
        open={isBatchDeleting}
        onClose={() => setIsBatchDeleting(false)}
        onConfirm={async () => {
          await handleBatchDelete(selectedIds);
        }}
        itemType="分类"
        itemName={`选中的 ${selectedIds.length} 个分类`}
      />

      <ModernTable<Category>
        data={categories}
        columns={columns}
        loading={isLoading}
        error={error ? (error instanceof Error ? error.message : String(error)) : null}
        searchable={true}
        searchPlaceholder="搜索分类名称..."
        onSearch={handleSearch}
        onForceRefresh={() => refetch()}
        selectable={true}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        createButton={{
          label: "新建分类",
          onClick: onCreate,
          icon: <Plus className="mr-2 h-4 w-4" />
        }}
        batchActions={batchActions}
        emptyIcon={<FolderOpen className="h-10 w-10 text-gray-400" />}
        emptyTitle="暂无分类"
        emptyDescription="创建第一个分类来组织您的内容"
        getRecordId={(category) => category.id}
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
