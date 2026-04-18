"use client";

/*
 * 标签管理页面
 */

import { useEffect, useState } from "react";
import ModernAdminLayout from "@/components/admin/modernAdminLayout";
import TagTable from "@/components/admin/tag-table";
import TagModal from "@/components/admin/tag-modal";

interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

export default function TagList() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setShowDialog(true);
  };

  const handleCreate = () => {
    setEditingTag(null);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingTag(null);
  };
  return (
    <ModernAdminLayout>
      <div className="space-y-4">
        {/* 标题 */}
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-gradient-to-b from-red-600 to-orange-600 rounded-full"></div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">标签列表</h1>
        </div>

        {/* 标签列表 */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md border border-gray-200 dark:border-gray-700">
          <TagTable onEdit={handleEdit} onCreate={handleCreate} />
        </div>
        {/* 创建/编辑对话框 */}
        <TagModal open={showDialog} onClose={handleCloseDialog} tag={editingTag} />
      </div>
    </ModernAdminLayout>
  );
}
