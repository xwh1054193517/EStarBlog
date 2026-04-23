"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { getPublicCategories } from "@/lib/api/publicApi";
import { getPublicTags } from "@/lib/api/publicApi";
import { uploadFile } from "@/lib/api/uploadApi";
import type { Category } from "@/lib/api/categoryApi";
import type { Tag } from "@/lib/api/tagApi";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

export interface PublishData {
  categoryId?: string;
  tagIds?: string[];
  coverImage?: string;
  excerpt?: string;
  published?: boolean;
  featured?: boolean;
}

interface PublishDialogProps {
  open: boolean;
  onClose: () => void;
  onPublish: (data: PublishData) => Promise<void>;
  initialData?: Partial<PublishData>;
  postTitle?: string;
  isPublishing?: boolean;
}

export default function PublishDialog({
  open,
  onClose,
  onPublish,
  initialData,
  postTitle,
  isPublishing: externalIsPublishing
}: PublishDialogProps) {
  const [internalIsPublishing, setInternalIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const isPublishing = externalIsPublishing || internalIsPublishing;
  const [categoryId, setCategoryId] = useState<string>("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>("");
  const [excerpt, setExcerpt] = useState<string>("");
  const [published, setPublished] = useState<boolean>(true);
  const [featured, setFeatured] = useState<boolean>(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState("");
  const [showCoverPreview, setShowCoverPreview] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const categoryRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉框
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (tagRef.current && !tagRef.current.contains(event.target as Node)) {
        setShowTagDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 打开弹窗时加载数据并设置初始值
  useEffect(() => {
    if (open) {
      // 重置状态
      setCategoryId("");
      setTagIds([]);
      setCoverImage("");
      setExcerpt("");
      setPublished(true);
      setFeatured(false);
      setCategorySearch("");
      setTagSearch("");
      setCoverUploadError("");
      setCoverUploading(false);
      setShowCoverPreview(false);
      setPublishError(null);
      setIsLoadingData(true);

      // 加载数据
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    try {
      const [cats, tgs] = await Promise.all([getPublicCategories(), getPublicTags()]);
      setCategories(cats || []);
      setTags(tgs || []);

      // 数据加载完成后设置初始值
      loadInitialData();
    } catch (error) {
      console.error("Failed to load categories and tags:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadInitialData = () => {
    console.log(initialData);
    if (initialData) {
      if (initialData.categoryId) {
        setCategoryId(initialData.categoryId);
      }
      if (initialData.tagIds && Array.isArray(initialData.tagIds)) {
        setTagIds(initialData.tagIds);
      }
      if (initialData.coverImage) {
        setCoverImage(initialData.coverImage);
        setShowCoverPreview(true);
      }
      if (initialData.excerpt) {
        setExcerpt(initialData.excerpt);
      }
      if (initialData.published !== undefined) {
        setPublished(initialData.published);
      }
      if (initialData.featured !== undefined) {
        setFeatured(initialData.featured);
      }
    }
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredTags = tags.filter((t) => t.name.toLowerCase().includes(tagSearch.toLowerCase()));

  const toggleTag = (tagId: string) => {
    setTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handlePublish = async () => {
    setPublishError(null);
    setInternalIsPublishing(true);
    try {
      await onPublish({
        categoryId: categoryId || undefined,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        coverImage: coverImage || undefined,
        excerpt: excerpt || undefined,
        published,
        featured
      });
      toast.success(`文章已${published ? "发布" : "保存为草稿"}成功`);
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : "发布失败");
    } finally {
      setInternalIsPublishing(false);
    }
  };

  const handleCoverImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setCoverUploadError("");
      setCoverUploading(true);
      try {
        const uploaded = await uploadFile(file, "cover");
        if (!uploaded.fileUrl) {
          throw new Error("Upload response missing file URL");
        }
        setCoverImage(uploaded.fileUrl);
        setShowCoverPreview(true);
      } catch (error) {
        console.error("Cover image upload failed:", error);
        setCoverUploadError(error instanceof Error ? error.message : "Cover image upload failed");
      } finally {
        setCoverUploading(false);
      }
    };
    input.click();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {isLoadingData && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span className="text-sm text-muted-foreground">加载中...</span>
            </div>
          </div>
        )}
        <DialogHeader>
          <DialogTitle>{postTitle ? `发布: ${postTitle}` : "发布文章"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 分类选择 */}
          <div className="space-y-2" ref={categoryRef}>
            <Label>分类</Label>
            <div className="relative">
              <div
                className={`flex items-center justify-between w-full px-3 py-2 border border-input bg-background rounded-md ${isLoadingData ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-accent"}`}
                onClick={() => {
                  if (isLoadingData) return;
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowTagDropdown(false);
                }}
              >
                <span className={selectedCategory ? "" : "text-muted-foreground"}>
                  {selectedCategory?.name || "选择分类..."}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    showCategoryDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {showCategoryDropdown && !isLoadingData && (
                <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg">
                  <div className="p-2">
                    <Input
                      placeholder="搜索分类..."
                      value={categorySearch}
                      disabled={isLoadingData}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredCategories.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">未找到分类</div>
                    ) : (
                      filteredCategories.map((cat) => (
                        <div
                          key={cat.id}
                          className={`px-3 py-2 cursor-pointer hover:bg-accent ${
                            cat.id === categoryId ? "bg-accent" : ""
                          }`}
                          onClick={() => {
                            setCategoryId(cat.id);
                            setShowCategoryDropdown(false);
                            setCategorySearch("");
                          }}
                        >
                          {cat.name}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 标签选择 */}
          <div className="space-y-2" ref={tagRef}>
            <Label>标签</Label>
            <div className="relative">
              <div
                className={`min-h-[42px] w-full px-3 py-2 border border-input bg-background rounded-md ${isLoadingData ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-accent"}`}
                onClick={() => {
                  if (isLoadingData) return;
                  setShowTagDropdown(!showTagDropdown);
                  setShowCategoryDropdown(false);
                }}
              >
                {tagIds.length === 0 ? (
                  <span className="text-muted-foreground">选择标签...</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {tagIds.map((id) => {
                      const tag = tags.find((t) => t.id === id);
                      return tag ? (
                        <Badge key={id} variant="secondary" className="flex items-center gap-1">
                          {tag.name}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTag(id);
                            }}
                          />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {showTagDropdown && !isLoadingData && (
                <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg">
                  <div className="p-2">
                    <Input
                      placeholder="搜索标签..."
                      value={tagSearch}
                      disabled={isLoadingData}
                      onChange={(e) => setTagSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredTags.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">未找到标签</div>
                    ) : (
                      filteredTags.map((tag) => (
                        <div
                          key={tag.id}
                          className={`px-3 py-2 cursor-pointer hover:bg-accent flex items-center justify-between ${
                            tagIds.includes(tag.id) ? "bg-accent" : ""
                          }`}
                          onClick={() => {
                            toggleTag(tag.id);
                            // 选中后不关闭，保持多选体验
                          }}
                        >
                          <span>{tag.name}</span>
                          {tag.color && (
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: tag.color }}
                            />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {tagIds.length > 0 && (
              <p className="text-xs text-muted-foreground">
                已选择 {tagIds.length} 个标签，点击标签可取消选择
              </p>
            )}
          </div>

          {/* 封面图 */}
          <div className="space-y-2">
            <Label>封面图</Label>
            <div className="flex gap-2">
              <Input
                placeholder="输入封面图 URL..."
                value={coverImage}
                disabled={isLoadingData || coverUploading}
                onChange={(e) => {
                  setCoverUploadError("");
                  setCoverImage(e.target.value);
                  setShowCoverPreview(false);
                }}
              />
              <Button
                onClick={handleCoverImageUpload}
                variant="outline"
                disabled={isLoadingData || coverUploading}
              >
                <Upload className="w-4 h-4 mr-1" />
                {coverUploading ? "Uploading..." : "上传"}
              </Button>
            </div>
            {showCoverPreview && coverImage && (
              <div className="relative">
                <img
                  src={coverImage}
                  alt="封面预览"
                  className="w-full h-40 object-cover rounded-md"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  disabled={isLoadingData}
                  onClick={() => {
                    setCoverUploadError("");
                    setCoverImage("");
                    setShowCoverPreview(false);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            {coverUploadError && <p className="text-sm text-destructive">{coverUploadError}</p>}
          </div>

          {/* 摘要 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>摘要</Label>
              <span className="text-xs text-muted-foreground">{excerpt.length}/200</span>
            </div>
            <Textarea
              placeholder="输入文章摘要（可选）..."
              value={excerpt}
              disabled={isLoadingData}
              onChange={(e) => setExcerpt(e.target.value.slice(0, 200))}
              rows={3}
            />
          </div>

          {/* 发布选项 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5 flex-1">
                <Label>发布</Label>
                <p className="text-sm text-muted-foreground">发布后文章将在网站上可见</p>
              </div>
              <Switch checked={published} onCheckedChange={setPublished} disabled={isLoadingData} />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5 flex-1">
                <Label>设为精选</Label>
                <p className="text-sm text-muted-foreground">精选文章将显示在首页精选区域</p>
              </div>
              <Switch checked={featured} onCheckedChange={setFeatured} disabled={isLoadingData} />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {publishError && (
            <div className="text-sm text-destructive text-center sm:text-left">{publishError}</div>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={onClose} disabled={isPublishing || isLoadingData}>
              取消
            </Button>
            <Button onClick={handlePublish} disabled={isPublishing || isLoadingData}>
              {isPublishing ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {published ? "发布中..." : "保存中..."}
                </>
              ) : published ? (
                "发布"
              ) : (
                "保存为草稿"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
