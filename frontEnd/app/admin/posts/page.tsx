"use client";

/**
 * 文章管理页面
 *
 * 提供文章的创建、编辑、删除和批量操作功能
 * 包括筛选、搜索和分页功能
 */

import { useState, useRef } from "react";
import ModernAdminLayout from "@/components/admin/modernAdminLayout";
import PostTable from "@/components/admin/post-table";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Upload, FolderUp, FileUp, ChevronDown } from "lucide-react";

export default function PostsPage() {
  return (
    <ModernAdminLayout>
      <div className="space-y-4">
        {/* 页面标题和操作按钮 */}
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">文章管理</h1>
        </div>

        {/* 文章列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <PostTable enableTableFilters={true} />
        </div>
      </div>
    </ModernAdminLayout>
  );
}
