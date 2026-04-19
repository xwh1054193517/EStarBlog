"use client";

import { useState, useEffect } from "react";
import ModernAdminLayout from "@/components/admin/modernAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getBlogConfig,
  updateBlogConfig,
  getBasicConfig,
  updateBasicConfig
} from "@/lib/api/siteConfigApi";
import type { BlogConfig, BasicConfig } from "@/lib/api/siteConfigApi";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"blog" | "basic">("blog");
  const [saving, setSaving] = useState(false);
  const [blogConfig, setBlogConfig] = useState<BlogConfig>({
    title: "",
    subtitle: "",
    typingTexts: [],
    announcement: "",
    established: ""
  });
  const [basicConfig, setBasicConfig] = useState<BasicConfig>({
    author: "",
    authorDesc: "",
    authorAvatar: "",
    homeUrl: ""
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [blog, basic] = await Promise.all([getBlogConfig(), getBasicConfig()]);
        setBlogConfig(blog);
        setBasicConfig(basic);
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast.error("加载设置失败");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveBlog = async () => {
    setSaving(true);
    try {
      await updateBlogConfig(blogConfig);
      toast.success("博客配置已保存");
    } catch (error) {
      console.error("Failed to save blog config:", error);
      toast.error("保存博客配置失败");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBasic = async () => {
    setSaving(true);
    try {
      await updateBasicConfig(basicConfig);
      toast.success("基础配置已保存");
    } catch (error) {
      console.error("Failed to save basic config:", error);
      toast.error("保存基础配置失败");
    } finally {
      setSaving(false);
    }
  };

  const handleTypingTextsChange = (value: string) => {
    const texts = value.split("\n").filter((t) => t.trim() !== "");
    setBlogConfig((prev) => ({ ...prev, typingTexts: texts }));
  };

  if (loading) {
    return (
      <ModernAdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full" />
          <h1 className="text-xl font-semibold text-gray-900">站点设置</h1>
        </div>

        <div className="flex space-x-4 border-b border-gray-200 pb-4">
          <button
            onClick={() => setActiveTab("blog")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "blog"
                ? "bg-white text-black"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            博客配置
          </button>
          <button
            onClick={() => setActiveTab("basic")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "basic"
                ? "bg-white text-black"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            基础配置
          </button>
        </div>

        {activeTab === "blog" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    博客标题
                  </label>
                  <Input
                    value={blogConfig.title}
                    onChange={(e) => setBlogConfig((p) => ({ ...p, title: e.target.value }))}
                    placeholder="博客标题"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    副标题
                  </label>
                  <Input
                    value={blogConfig.subtitle}
                    onChange={(e) => setBlogConfig((p) => ({ ...p, subtitle: e.target.value }))}
                    placeholder="博客副标题"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    建站日期
                  </label>
                  <Input
                    type="date"
                    value={blogConfig.established}
                    onChange={(e) => setBlogConfig((p) => ({ ...p, established: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    公告内容 (HTML)
                  </label>
                  <Textarea
                    value={blogConfig.announcement}
                    onChange={(e) => setBlogConfig((p) => ({ ...p, announcement: e.target.value }))}
                    placeholder="支持 HTML 格式"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>打字动画文本</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={blogConfig.typingTexts.join("\n")}
                  onChange={(e) => handleTypingTextsChange(e.target.value)}
                  placeholder="每行一个文本"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-2">
                  每行输入一个文本，会在首页标题下方循环展示
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveBlog} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                保存博客配置
              </Button>
            </div>
          </div>
        )}

        {activeTab === "basic" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>博主信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    博主名称
                  </label>
                  <Input
                    value={basicConfig.author}
                    onChange={(e) => setBasicConfig((p) => ({ ...p, author: e.target.value }))}
                    placeholder="博主名称"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    博主简介
                  </label>
                  <Textarea
                    value={basicConfig.authorDesc}
                    onChange={(e) => setBasicConfig((p) => ({ ...p, authorDesc: e.target.value }))}
                    placeholder="博主简介"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    博主头像 URL
                  </label>
                  <Input
                    value={basicConfig.authorAvatar}
                    onChange={(e) =>
                      setBasicConfig((p) => ({ ...p, authorAvatar: e.target.value }))
                    }
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    主页 URL
                  </label>
                  <Input
                    value={basicConfig.homeUrl}
                    onChange={(e) => setBasicConfig((p) => ({ ...p, homeUrl: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveBasic} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                保存基础配置
              </Button>
            </div>
          </div>
        )}
      </div>
    </ModernAdminLayout>
  );
}
