"use client";

/**
 * 标签创建/编辑对话框组件
 *
 * 提供标签的创建和编辑功能
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTag, updateTag, Tag } from "@/lib/api/tagApi";
import { toast } from "sonner";

const tagSchema = z.object({
  name: z.string().min(1, "标签名称不能为空").max(30, "标签名称不能超过30个字符"),
  slug: z.string().min(1, "URL slug不能为空").max(30, "URL slug不能超过30个字符"),
  color: z.string().optional()
});

type TagFormData = z.infer<typeof tagSchema>;

interface TagDialogProps {
  open: boolean;
  onClose: () => void;
  tag?: {
    id: string;
    name: string;
    slug: string;
    color?: string;
  } | null;
}

export default function TagDialog({ open, onClose, tag }: TagDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!tag;
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: { name: string; slug: string; color?: string }) => createTag(data),
    onSuccess: () => {
      toast.success("标签创建成功");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      handleClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "创建标签失败");
      setIsLoading(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { name: string; slug: string; color?: string }) => updateTag(tag!.id, data),
    onSuccess: () => {
      toast.success("标签更新成功");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      handleClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "更新标签失败");
      setIsLoading(false);
    }
  });

  const form = useForm<TagFormData>({
    resolver: zodResolver(tagSchema as any),
    defaultValues: {
      name: "",
      slug: "",
      color: ""
    }
  });

  const { watch, setValue, reset } = form;
  const name = watch("name");
  const color = watch("color");

  useEffect(() => {
    if (!isEdit && name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", slug);
    }
  }, [name, isEdit, setValue]);

  useEffect(() => {
    if (open) {
      if (tag) {
        reset({
          name: tag.name,
          slug: tag.slug,
          color: tag.color || ""
        });
      } else {
        reset({
          name: "",
          slug: "",
          color: ""
        });
      }
    }
  }, [open, tag, reset]);

  const presetColors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899"
  ];

  const handleClose = () => {
    setIsLoading(false);
    onClose();
  };

  const onSubmit = async (data: TagFormData) => {
    setIsLoading(true);
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby="tag-dialog-description" className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑标签" : "新建标签"}</DialogTitle>
          <DialogDescription id="tag-dialog-description">
            {isEdit ? "修改标签信息" : "创建新标签"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标签名称</FormLabel>
                  <FormControl>
                    <Input placeholder="输入标签名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="url-slug" {...field} />
                  </FormControl>
                  <FormDescription>用于URL路径，会自动根据标签名称生成</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>颜色</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {/* {presetColors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => field.onChange(c)}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${
                            field.value === c
                              ? "border-gray-900 dark:border-white scale-110"
                              : "border-transparent hover:scale-110"
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))} */}
                      <input
                        type="color"
                        value={field.value || "#6366f1"}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-6 h-6 rounded-full cursor-pointer border-0"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isEdit ? "更新" : "创建"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
