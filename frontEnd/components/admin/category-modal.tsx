"use client";

/**
 * 分类创建/编辑对话框组件
 *
 * 提供分类的创建和编辑功能
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createCategory, updateCategory } from "@/lib/api/categoryApi";
import { toast } from "sonner";

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
}

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  } | null;
}

export default function CategoryDialog({ open, onClose, category }: CategoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!category;
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: { name: string; slug: string; description?: string }) =>
      createCategory(data),
    onSuccess: () => {
      toast.success("分类创建成功");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      handleClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "创建分类失败");
      setIsLoading(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { name: string; slug: string; description?: string }) =>
      updateCategory(category!.id, data),
    onSuccess: () => {
      toast.success("分类更新成功");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      handleClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "更新分类失败");
      setIsLoading(false);
    }
  });

  const form = useForm<CategoryFormData>({
    defaultValues: {
      name: "",
      slug: "",
      description: ""
    }
  });

  const { watch, setValue, reset } = form;
  const name = watch("name");

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
      if (category) {
        reset({
          name: category.name,
          slug: category.slug,
          description: category.description || ""
        });
      } else {
        reset({
          name: "",
          slug: "",
          description: ""
        });
      }
    }
  }, [open, category, reset]);

  const handleClose = () => {
    setIsLoading(false);
    onClose();
  };

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby="category-dialog-description" className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑分类" : "新建分类"}</DialogTitle>
          <DialogDescription id="category-dialog-description">
            {isEdit ? "修改分类信息" : "创建新分类"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>分类名称</FormLabel>
                  <FormControl>
                    <Input placeholder="输入分类名称" {...field} />
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
                  <FormDescription>用于URL路径，会自动根据分类名称生成</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述（可选）</FormLabel>
                  <FormControl>
                    <Textarea placeholder="输入分类描述..." rows={2} {...field} />
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
