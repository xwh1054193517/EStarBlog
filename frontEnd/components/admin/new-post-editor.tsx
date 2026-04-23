"use client";
import { createPost, getAdminPostById, updatePost } from "@/lib/api/article-api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import FullscreenEditor from "./full-screen-editor";
import { type PublishData } from "./publish-dialog";
import { toast } from "sonner";
interface NewPostEditorProps {
  mode: "create" | "edit";
  postId?: string;
}

export default function NewPostEditor({ mode, postId }: NewPostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  //  文章内容
  const [content, setContent] = useState("");
  //  文章分类
  const [category, setCategory] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //  初始发布数据
  const [initialPublishData, setInitialPublishData] = useState<Partial<PublishData> | undefined>();
  //  加载文章详情
  const loadPost = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getAdminPostById(postId || "");
      console.log("res", res);
      setTitle(res.title || "");
      setContent(res.content || "");
      setSlug(res.slug || "");
      setIsLoading(false);
      setInitialPublishData({
        categoryId: res.categoryId || "",
        tagIds: res.tags?.map((tag) => tag.id) ?? [],
        coverImage: res.coverImage || "",
        excerpt: res.excerpt || "",
        published: res.published ?? true,
        featured: res.featured ?? false
      });
    } catch (error) {
      toast.error("加载文章详情失败");
      router.back();
    } finally {
      setIsLoading(false);
    }
  }, [postId, router, toast]);

  //  编辑模式下，加载文章详情
  useEffect(() => {
    if (mode === "edit" && postId) {
      loadPost();
    }
  }, [mode, postId, loadPost]);

  //  关闭编辑器
  const handleCloseEditor = () => {
    router.back();
  };

  //  保存草稿
  const handleSave = async () => {
    if (!title.trim()) {
      toast.warning("标题不能为空,请输入文章标题后再保存");
      return;
    }

    try {
      setIsLoading(true);

      // 生成slug
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      const query = {
        ...initialPublishData,
        title,
        slug,
        content,
        published: false // 保存为草稿
      };
      if (mode === "create") {
        await createPost(query);
      } else {
        await updatePost(postId || "", query);
      }

      toast.success("文章已保存为草稿");
    } catch (error) {
      toast.success("文章保存失败");
    } finally {
      setIsLoading(false);
    }
  };

  //  发布文章
  const handlePublish = async (publishData: PublishData) => {
    if (!title.trim()) {
      toast.warning("标题不能为空,请输入文章标题后再发布");
      return;
    }

    try {
      // 生成slug
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      const query = {
        title,
        content,
        ...(mode === "create" ? { slug } : {}),
        excerpt: publishData.excerpt,
        coverImage: publishData.coverImage,
        published: publishData.published,
        featured: publishData.featured,
        categoryId: publishData.categoryId,
        tagIds: publishData.tagIds
      };
      if (mode === "create") {
        await createPost(query);
      } else {
        await updatePost(postId || "", query);
      }

      // Toast 提示

      setTimeout(() => {
        if (postId) loadPost();
      }, 1500);
    } catch (error) {
      console.error("操作失败:", error);
      toast.error("操作失败，请重试");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && mode === "edit") {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="text-muted-foreground">正在加载文章...</div>
      </div>
    );
  }

  return (
    <FullscreenEditor
      title={title}
      content={content}
      onTitleChange={setTitle}
      onContentChange={setContent}
      onClose={handleCloseEditor}
      onSave={handleSave}
      onPublish={handlePublish}
      isLoading={isLoading}
      mode={mode}
      initialPublishData={initialPublishData}
      postId={postId}
      postSlug={slug}
    />
  );
}
