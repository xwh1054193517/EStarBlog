"use client";
import { cn } from "@/lib/utils";
import { type ComponentProps, type ReactNode, useState } from "react";
type ActionVariant = "default" | "danger" | "warning" | "success";
import Link from "next/link";
import { Search, Plus, MoreHorizontal, RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  TableFilter,
  type TableFilterOption,
  type TableFilterType,
  type TableFilterValue
} from "@/components/ui/table-filter";
import { Card, CardContent } from "@/components/ui/card";
import { AdminLoading } from "@/components/ui/loading";
import { DeleteConfirmDialog } from "@/components/ui/confirm-dialog";
type TableFilters = Record<string, TableFilterValue>;
// 列筛选器
interface ColumnFilter {
  type: TableFilterType;
  options?: TableFilterOption[];
  placeholder?: string;
}
// 列
interface TableColumn<T> {
  key: string;
  title: string;
  width?: string;
  className?: string;
  // 渲染函数
  render?: (value: unknown, record: T) => ReactNode;
  filter?: ColumnFilter;
}

// 操作列
interface TableAction<T> {
  key: string;
  label: string | ((value: T) => string);
  icon?: ReactNode;
  onClick: (value: T) => void;
  className?: string;
  variant?: ActionVariant | ((value: T) => ActionVariant);
}
// 表格属性
interface TableProps<T> {
  // 数据
  data: T[];
  columns: TableColumn<T>[];

  // 状态
  loading?: boolean;
  error?: string | null;

  // 搜索
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;

  // 筛选
  filterable?: boolean;
  onFilterChange?: (filters: TableFilters) => void;

  // 选择
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;

  // 操作
  actions?: TableAction<T>[];

  // 新建按钮
  createButton?: {
    label: string;
    href?: ComponentProps<typeof Link>["href"];
    onClick?: () => void;
    icon?: ReactNode;
  };

  // 批量操作
  batchActions?: Array<{
    label: string;
    onClick: (selectedIds: string[]) => void;
    variant?: "default" | "danger";
    icon?: ReactNode;
    disabled?: boolean;
  }>;

  // 强制刷新
  onForceRefresh?: () => void;

  // 分页
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };

  // 样式
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;

  // 获取记录ID的函数
  getRecordId: (record: T) => string;

  // 重试函数
  onRetry?: () => void;
}

export function ModernTable<T = unknown>({
  data,
  columns,
  loading = false,
  error = null,
  searchable = true,
  searchPlaceholder = "搜索...",
  onSearch,
  filterable = false,
  onFilterChange,
  selectable = true,
  selectedIds = [],
  onSelectionChange,
  actions = [],
  createButton,
  batchActions = [],
  pagination,
  emptyIcon,
  emptyTitle = "暂无数据",
  emptyDescription = "不存在相关数据",
  getRecordId,
  onRetry
}: TableProps<T>) {
  // 搜索查询
  const [searchQuery, setSearchQuery] = useState("");
  // 删除记录
  const [deleteRecord, setDeleteRecord] = useState<T | null>(null);
  // 删除操作
  const [deleteAction, setDeleteAction] = useState<TableAction<T> | null>(null);

  // 筛选
  const [filters, setFilters] = useState<TableFilters>({});
  // 筛选弹窗
  const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>({});

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const submitSearch = () => {
    onSearch?.(searchQuery);
  };

  const handleFilterChange = (columnKey: string, value: TableFilterValue) => {
    const newFilters = { ...filters, [columnKey]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilter = (columnKey: string) => {
    const newFilters = { ...filters };
    delete newFilters[columnKey];
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const openPopover = (columnKey: string) => {
    setOpenPopovers((prev) => ({ ...prev, [columnKey]: true }));
  };

  const closePopover = (columnKey: string) => {
    setOpenPopovers((prev) => ({ ...prev, [columnKey]: false }));
  };

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    const newSelection = checked === true ? data.map(getRecordId) : [];
    onSelectionChange?.(newSelection);
  };

  const handleSelectRecord = (recordId: string, checked: boolean | "indeterminate") => {
    const newSelection =
      checked === true
        ? Array.from(new Set([...selectedIds, recordId]))
        : selectedIds.filter((id) => id !== recordId);
    onSelectionChange?.(newSelection);
  };

  // 解析操作列的变体
  const resolveActionVariant = (action: TableAction<T>, record: T): ActionVariant => {
    if (typeof action.variant === "function") {
      return action.variant(record);
    }
    return action.variant ?? "default";
  };

  const handleAction = (action: TableAction<T>, record: T) => {
    if (resolveActionVariant(action, record) === "danger") {
      setDeleteRecord(record);
      setDeleteAction(action);
    } else {
      setDeleteAction(null);
      action.onClick(record);
    }
  };
  const confirmDelete = () => {
    if (deleteRecord && deleteAction) {
      deleteAction.onClick(deleteRecord);
      setDeleteRecord(null);
      setDeleteAction(null);
    }
  };

  // 加载状态（仅表格区域）
  const showTableLoading = loading && data.length === 0;
  // 错误状态
  const showTableError = error && data.length === 0;

  return (
    <div className="space-y-6">
      {/* 搜索和操作栏 - 始终显示，不受 loading 影响 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {searchable && (
          <div className="relative flex-1 max-w-md flex items-center gap-2">
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitSearch();
                }
              }}
              className="pl-9 pr-9 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-gray-300 dark:focus:border-gray-600 focus:bg-white dark:focus:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors rounded-xl"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={submitSearch}
              className="absolute right-1 shrink-0  px-4  h-7 w-10 p-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto sm:flex-nowrap justify-end sm:justify-normal">
          {/* 批量操作区域 */}
          {selectable && batchActions.length > 0 && selectedIds.length > 0 && (
            <div
              className={cn(
                "transition-all duration-200 ease-in-out flex items-center gap-2",
                selectedIds.length > 0
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-4 pointer-events-none"
              )}
            >
              <div className="flex items-center space-x-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-gray-100 dark:bg-gray-800 rounded-xl min-w-0">
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                  已选择 {selectedIds.length}
                </span>
                {batchActions.map((batchAction, index) => {
                  const isDisabled = selectedIds.length === 0 || batchAction.disabled;
                  return (
                    <Button
                      key={index}
                      variant={batchAction.variant === "danger" ? "destructive" : "default"}
                      size="sm"
                      onClick={() => batchAction.onClick(selectedIds)}
                      disabled={isDisabled}
                      className={cn(
                        "rounded-lg transition-all duration-200 text-white h-7 text-xs sm:h-8 sm:text-sm",
                        batchAction.variant === "danger" &&
                          "bg-red-500 hover:bg-red-600 text-white",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {batchAction.icon}
                      <span className="ml-1">{batchAction.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 新建按钮 */}
          {createButton &&
            (createButton.href ? (
              <Link href={createButton.href} className="shrink-0">
                <Button className=" bg-black dark:bg-white text-white dark:text-black hover:opacity-90 rounded-xl shadow-md border-0">
                  {createButton.icon || <Plus className="ml-2 mr-2 h-4 w-4" />}
                  {createButton.label}
                </Button>
              </Link>
            ) : (
              <Button
                onClick={createButton.onClick}
                className=" py-2.5 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 rounded-xl shadow-md border-0 shrink-0"
              >
                {createButton.icon || <Plus className="ml-2 mr-2 h-4 w-4" />}
                {createButton.label}
              </Button>
            ))}
        </div>
      </div>

      {/* 表格内容区域 */}
      <div className="space-y-4">
        {/* 加载状态 */}
        {showTableLoading && (
          <Card>
            <CardContent className="py-20">
              <AdminLoading text="正在加载数据..." />
            </CardContent>
          </Card>
        )}

        {/* 错误状态 */}
        {showTableError && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-950 rounded-2xl mb-4">
                <RefreshCw className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                加载失败
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              {onRetry && (
                <Button onClick={onRetry} variant="outline" className="shadow-sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  重试
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* 空状态 */}
        {!showTableLoading &&
          !showTableError &&
          data.length === 0 &&
          !filterable &&
          Object.keys(filters).length === 0 && (
            <Card>
              <CardContent className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-6">
                  {emptyIcon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {emptyTitle}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery ? "未找到匹配的结果" : emptyDescription}
                </p>
              </CardContent>
            </Card>
          )}

        {/* 表格 */}
        {!showTableLoading &&
          !showTableError &&
          (data.length > 0 || filterable || Object.keys(filters).length > 0) && (
            <div className="modern-table__viewport overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <div className="modern-table__grid min-w-[700px]">
                {/* 表头 */}
                <div className="modern-table__header-wrap space-y-2 mb-2">
                  <div className="modern-table__header flex items-center space-x-4 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectable && (
                      <div className="modern-table__header-selection w-8">
                        <Checkbox
                          checked={selectedIds.length === data.length && data.length > 0}
                          onCheckedChange={handleSelectAll}
                          className="rounded-md"
                        />
                      </div>
                    )}
                    {columns.map((column) => (
                      <div
                        key={column.key}
                        className={cn(
                          "modern-table__header-cell",
                          column.width || "flex-1",
                          column.className,
                          "flex min-w-0 items-center space-x-2"
                        )}
                      >
                        <span>{column.title}</span>
                        {filterable && column.filter && (
                          <TableFilter
                            columnKey={column.key}
                            columnTitle={column.title}
                            filterType={column.filter.type}
                            options={column.filter.options}
                            placeholder={column.filter.placeholder}
                            currentValue={filters[column.key]}
                            onFilterChange={handleFilterChange}
                            onApply={closePopover}
                            onReset={clearFilter}
                            onOpen={openPopover}
                            onClose={closePopover}
                            isOpen={openPopovers[column.key] || false}
                          />
                        )}
                      </div>
                    ))}
                    {actions.length > 0 && <div className="w-12 text-center">操作</div>}
                  </div>
                </div>

                {/* 数据行 */}
                {data.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <div className="text-gray-500 dark:text-gray-400">
                        <Filter className="h-8 w-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                        <p className="text-sm">没有找到匹配筛选条件的数据</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          请尝试调整筛选条件
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {data.map((record) => {
                      const recordId = getRecordId(record);
                      return (
                        <Card key={recordId} className="modern-table__row hover:shadow-md">
                          <CardContent className="modern-table__row-content p-4">
                            <div className="modern-table__row-inner flex items-start gap-3 md:items-center md:space-x-4">
                              {selectable && (
                                <div className="modern-table__selection">
                                  <Checkbox
                                    checked={selectedIds.includes(recordId)}
                                    onCheckedChange={(checked) => {
                                      handleSelectRecord(recordId, checked);
                                    }}
                                    className="rounded-md"
                                  />
                                </div>
                              )}

                              {columns.map((column) => (
                                <div
                                  key={column.key}
                                  className={cn(
                                    "modern-table__cell",
                                    column.key === "actions" && "modern-table__cell--actions",
                                    column.width || "flex-1",
                                    "min-w-0",
                                    column.className
                                  )}
                                  data-column-key={column.key}
                                >
                                  <div className="modern-table__cell-label md:hidden">
                                    {column.title}
                                  </div>
                                  <div className="modern-table__cell-content">
                                    {column.render
                                      ? column.render(
                                          (record as Record<string, unknown>)[column.key],
                                          record
                                        )
                                      : (() => {
                                          const cellValue = (record as Record<string, unknown>)[
                                            column.key
                                          ];
                                          return cellValue == null ? "" : String(cellValue);
                                        })()}
                                  </div>
                                </div>
                              ))}

                              {actions.length > 0 && (
                                <div className="w-12 shrink-0">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                    >
                                      <DropdownMenuLabel className="text-gray-700 dark:text-gray-300">
                                        操作
                                      </DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      {actions.map((action) => {
                                        const actionVariant = resolveActionVariant(action, record);
                                        return (
                                          <DropdownMenuItem
                                            key={action.key}
                                            onClick={() => handleAction(action, record)}
                                            className={cn(
                                              "rounded-lg",
                                              actionVariant === "danger" &&
                                                "text-red-600 dark:text-red-400",
                                              actionVariant === "warning" &&
                                                "text-orange-600 dark:text-orange-400",
                                              actionVariant === "success" &&
                                                "text-green-600 dark:text-green-400",
                                              action.className
                                            )}
                                          >
                                            {action.icon && (
                                              <span className="mr-2">{action.icon}</span>
                                            )}
                                            {typeof action.label === "function"
                                              ? action.label(record)
                                              : action.label}
                                          </DropdownMenuItem>
                                        );
                                      })}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
      </div>

      {/* 分页 */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            共 {pagination.total} 条，第 {pagination.page} / {pagination.totalPages} 页
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1 || loading}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="rounded-lg"
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages || loading}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className="rounded-lg"
            >
              下一页
            </Button>
          </div>
        </div>
      )}

      {/* 删除确认对话框 */}
      <DeleteConfirmDialog
        open={!!deleteRecord}
        onClose={() => {
          setDeleteRecord(null);
          setDeleteAction(null);
        }}
        onConfirm={confirmDelete}
        itemName="记录"
        itemType="数据"
      />
    </div>
  );
}
