"use client";

/**
 * 统一风格的文章管理表格
 * 性能优化：添加useMemo、useCallback、防抖等优化
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { toast } from "sonner";
import {
  Eye,
  Edit,
  Trash2,
  Star,
  Clock,
  Calendar,
  FileText,
  Plus,
  MoreHorizontal,
  Download,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/ui/confirm-dialog";
import { getAdminPosts, updatePost, deletePost } from "@/lib/api/article-api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ModernTable } from "@/components/ui/modern-table";
import { cn } from "@/lib/utils";
import { getPublicCategories, getPublicTags, Tag } from "@/lib/api/publicApi";
import { Category } from "@/lib/api/categoryApi";

// 文章数据类型
interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  published: boolean;
  featured: boolean;
  views: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  publishedAt?: string | Date;
  author: {
    username: string;
  };
  category?: {
    id: string;
    slug: string;
    name: string;
    color?: string;
  };
  tags: Array<{
    id: string;
    slug: string;
    name: string;
    color?: string;
  }>;
}

// API 响应类型
interface PostsResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface OptionItem {
  label: string;
  value: string;
  slug?: string;
  color?: string;
}

type TableFilters = Record<string, string | string[] | null | undefined>;

interface PostsTableProps {
  searchQuery?: string;
  statusFilter?: string;
  categoryFilter?: string;
  onSelectionChange?: (selectedIds: string[]) => void;
  enableTableFilters?: boolean;
}

export default function PostsTable({
  searchQuery,
  statusFilter,
  categoryFilter,
  onSelectionChange,
  enableTableFilters = false
}: PostsTableProps) {
  // 动画类状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // 数据类状态
  const [tableSearchQuery, setTableSearchQuery] = useState(searchQuery || "");
  const [tableFilters, setTableFilters] = useState<TableFilters>({});
  const [posts, setPosts] = useState<Post[]>([]);
  const [availableTags, setAvailableTags] = useState<OptionItem[]>([]);
  const [availableCategories, setAvailableCategories] = useState<OptionItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  // 操作类状态
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);
  const router = useRouter();

  // 查询所有标签和分类
  const fetchAvailableTagsAndCategories = useCallback(async () => {
    try {
      const [categories, tags] = await Promise.all([getPublicCategories(), getPublicTags()]);
      const tagsData = (tags || [])
        .filter(
          (tag): tag is Tag =>
            typeof tag?.id === "string" &&
            tag.id.trim().length > 0 &&
            typeof tag?.name === "string" &&
            tag.name.trim().length > 0 &&
            typeof tag?.slug === "string" &&
            tag.slug.trim().length > 0
        )
        .map((tag) => ({
          label: tag.name as string,
          value: tag.slug as string,
          color: tag.color as string
        }));
      const CateGoriesData = (categories || [])
        .filter(
          (category): category is Category =>
            typeof category?.name === "string" && category.name.trim().length > 0
        )
        .map((category) => ({
          label: category.name as string,
          value: category.slug as string,
          color: category.color as string
        }));
      setAvailableTags(tagsData);
      setAvailableCategories(CateGoriesData);
    } catch (error) {
      console.log(error || "查询标签和分类失败");
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const categoryValue = tableFilters.category;
      const tagValue = tableFilters.tag;
      const statusValue = tableFilters.status;
      const featuredValue = tableFilters.featured;

      const category = Array.isArray(categoryValue) ? categoryValue[0] : categoryValue;
      const tag = Array.isArray(tagValue) ? tagValue : undefined;

      let published: boolean | undefined;
      if (statusValue === "published") {
        published = true;
      } else if (statusValue === "draft") {
        published = false;
      }

      const featured =
        featuredValue === "true" ? true : featuredValue === "false" ? false : undefined;

      const data = await getAdminPosts({
        page: pagination.page,
        pageSize: pagination.limit,
        keyword: tableSearchQuery.trim() || undefined,
        category: category || undefined,
        tag: tag,
        published: published,
        featured
      });
      setPosts(data.items as unknown as Post[]);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("获取文章列表失败"));
      toast.error("获取文章列表失败");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, tableSearchQuery, tableFilters]);

  // 处理表头筛选
  const handleTableFilters = useCallback((filters: TableFilters) => {
    setTableFilters(filters);
    setPagination((prev) => ({ ...prev, page: 1 })); // 重置到第一页
  }, []);

  // 处理搜索
  const handleSearch = useCallback((query: string) => {
    setTableSearchQuery(query);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  useEffect(() => {
    setTableSearchQuery(searchQuery || "");
  }, [searchQuery]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (enableTableFilters) {
      fetchAvailableTagsAndCategories();
    }
  }, [enableTableFilters, fetchAvailableTagsAndCategories]);

  // 优化：缓存格式化日期
  const formatDate = useCallback((date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "MM月dd日 HH:mm", { locale: zhCN });
  }, []);

  // 文章状态
  const getStatusBadge = useCallback((post: Post) => {
    if (post.featured) {
      return (
        <Badge className="bg-black dark:bg-white text-white dark:text-black border-0">
          <Star className="h-3 w-3 mr-1" />
          精选
        </Badge>
      );
    }
    if (post.published) {
      return (
        <Badge className="bg-gray-600 dark:bg-gray-400 text-white dark:text-black border-0">
          已发布
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-gray-600 dark:text-gray-400">
        <Clock className="h-3 w-3 mr-1" />
        草稿
      </Badge>
    );
  }, []);

  // 优化：使用useCallback缓存事件处理函数
  const handleTogglePublish = useCallback(
    async (post: Post) => {
      try {
        await updatePost(post.id, { published: !post.published });
        toast(post.published ? "取消发布成功" : "发布成功");
        await fetchPosts();
      } catch {
        toast.error("操作失败,请稍后重试");
      }
    },
    [fetchPosts]
  );

  const handleToggleFeature = useCallback(
    async (post: Post) => {
      if (!post.published) {
        toast.error("仅已发布的文章才能设为精选");
        return;
      }
      try {
        await updatePost(post.id, { featured: !post.featured });
        toast(post.featured ? "取消精选成功" : "设为精选成功");
        await fetchPosts();
      } catch {
        toast.error("操作失败,请稍后重试");
      }
    },
    [fetchPosts]
  );

  const handleDelete = useCallback(
    async (post: Post) => {
      try {
        await deletePost(post.id);
        toast.success("文章已成功删除");
        await fetchPosts();
      } catch {
        toast.error("删除失败,请稍后重试");
      }
    },
    [fetchPosts]
  );

  // 优化：使用useMemo缓存静态配置
  const statusOptions = useMemo(
    () => [
      { label: "已发布", value: "published" },
      { label: "草稿", value: "draft" }
    ],
    []
  );

  const featuredOptions = useMemo(
    () => [
      { label: "是", value: "true" },
      { label: "否", value: "false" }
    ],
    []
  );
  // 优化：使用useMemo缓存columns配置，避免每次渲染重新创建
  const columns = useMemo(
    () => [
      {
        key: "title",
        title: "文章信息",
        width: "flex-1 min-w-[240px]",
        render: (_: unknown, post: Post) => (
          <div className="w-full min-w-0 space-y-2">
            <Link
              href={`/admin/posts/${post.id}/edit`}
              className="post-table__title block w-full text-base font-semibold text-gray-900 transition-colors hover:opacity-70 dark:text-gray-100"
            >
              {post.title}
            </Link>

            <div className="post-table__meta flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
              <div className="post-table__meta-item flex min-w-0 items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              {post.category && (
                <div className="post-table__meta-item flex min-w-0 items-center gap-1">
                  <span>{post.category.name}</span>
                </div>
              )}
            </div>
          </div>
        )
      },
      {
        key: "category",
        title: "分类",
        width: "w-32",
        filter: enableTableFilters
          ? {
              type: "select" as const,
              options: availableCategories,
              placeholder: "筛选分类"
            }
          : undefined,
        render: (_: unknown, post: Post) => (
          <div className="flex items-center space-x-2">
            {post.category ? (
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {post.category.name}
              </span>
            ) : (
              <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
            )}
          </div>
        )
      },
      {
        key: "tags",
        title: "标签",
        width: "w-56",
        filter: enableTableFilters
          ? {
              type: "multiselect" as const,
              options: availableTags,
              placeholder: "筛选标签"
            }
          : undefined,
        render: (_: unknown, post: Post) => (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs px-2 py-0.5 rounded-lg">
                {tag.name}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{post.tags.length - 3}
              </span>
            )}
            {post.tags.length === 0 && (
              <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
            )}
          </div>
        )
      },
      {
        key: "status",
        title: "状态",
        width: "w-24",
        className: "text-center",
        filter: enableTableFilters
          ? {
              type: "select" as const,
              options: statusOptions,
              placeholder: "筛选状态"
            }
          : undefined,
        render: (_: unknown, post: Post) => getStatusBadge(post)
      },
      {
        key: "featured",
        title: "精选",
        width: "w-20",
        className: "text-center",
        filter: enableTableFilters
          ? {
              type: "select" as const,
              options: featuredOptions,
              placeholder: "筛选精选"
            }
          : undefined,
        render: (_: unknown, post: Post) => (
          <div className="flex items-center justify-center">
            {post.featured ? (
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            ) : (
              <Star className="h-5 w-5 text-gray-300 dark:text-gray-600" />
            )}
          </div>
        )
      },
      {
        key: "views",
        title: "浏览量",
        width: "w-20",
        className: "text-center",
        render: (_: unknown, post: Post) => (
          <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400">
            <Eye className="h-4 w-4" />
            <span className="font-medium">{post.views.toLocaleString()}</span>
          </div>
        )
      },
      {
        key: "updatedAt",
        title: "更新时间",
        width: "w-24",
        className: "text-center",
        render: (_: unknown, post: Post) => (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(post.updatedAt)}
          </span>
        )
      },
      {
        key: "actions",
        title: "操作",
        width: "w-52",
        className: "text-center",
        render: (_: unknown, post: Post) => (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => router.push(`/admin/posts/${post.id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-1" />
              编辑
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <DropdownMenuLabel className="text-gray-700 dark:text-gray-300">
                  更多操作
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleTogglePublish(post)}
                  className={cn(
                    "rounded-lg",
                    post.published
                      ? "text-gray-600 dark:text-gray-400"
                      : "text-black dark:text-white font-bold"
                  )}
                >
                  {post.published ? "取消发布" : "发布"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToggleFeature(post)} className="rounded-lg">
                  <Star className="h-4 w-4 mr-2" />
                  {post.featured ? "取消精选" : "设为精选"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteId(post.id)}
                  className="rounded-lg text-red-600 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      }
    ],
    [
      enableTableFilters,
      availableCategories,
      availableTags,
      statusOptions,
      formatDate,
      getStatusBadge,
      handleTogglePublish,
      handleToggleFeature,
      router
    ]
  );

  return (
    <>
      {/* 确认删除对话框 */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            const post = posts.find((p) => p.id === deleteId);
            if (post) await handleDelete(post);
          }
        }}
        itemType="文章"
        itemName={posts.find((p) => p.id === deleteId)?.title || ""}
      />

      <ModernTable<Post>
        data={posts}
        columns={columns}
        loading={loading}
        error={error ? error.message : undefined}
        searchable={true}
        searchPlaceholder="搜索文章标题..."
        onSearch={handleSearch}
        filterable={enableTableFilters}
        onFilterChange={handleTableFilters}
        createButton={{
          label: "新建文章",
          href: "/admin/posts/new",
          icon: <Plus className="mr-2 h-4 w-4" />
        }}
        pagination={{
          page: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          totalPages: pagination.totalPages,
          onPageChange: (page: number) => setPagination((prev) => ({ ...prev, page }))
        }}
        emptyIcon={<FileText className="h-10 w-10 text-gray-400" />}
        emptyTitle="暂无文章"
        emptyDescription="开始创建您的第一篇文章吧"
        getRecordId={(post) => post.id}
        onRetry={fetchPosts}
      />
    </>
  );
}
