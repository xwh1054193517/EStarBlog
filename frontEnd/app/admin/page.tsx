import { Suspense } from "react";
import { SimpleLoading } from "@/components/ui/loading";
import ModernAdminLayout from "@/components/admin/modernAdminLayout";
import AdminDashBoard from "@/components/admin/adminDashBoard";
export default function AdminPage() {
  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-6 bg-black dark:bg-white rounded-full"></div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">管理概览</h1>
        </div>

        {/* 统计卡片 */}
        <Suspense fallback={<SimpleLoading />}>
          <AdminDashBoard />
        </Suspense>
      </div>
    </ModernAdminLayout>
  );
}
