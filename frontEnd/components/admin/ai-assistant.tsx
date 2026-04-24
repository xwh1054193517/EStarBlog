"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Wand2, FileText, Tag, ListTree, Pencil, Folder } from "lucide-react";
import { toast } from "sonner";
import { AI_GENERATION_TYPES, type AIGenerationType } from "@/lib/constant";

interface AiAssistantProps {
  title: string;
  content: string;
  onTitleSelect: (title: string) => void;
  onExcerptGenerated: (excerp: string) => void;
  onContentInsert: (content: string) => void;
  onContentReplace: (context: string) => void;
}
interface GenerationResult {
  type: AIGenerationType;
  results: string | string[];
}
export default function AiAssistant({
  title,
  content,
  onTitleSelect,
  onExcerptGenerated,
  onContentInsert,
  onContentReplace
}: AiAssistantProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<AIGenerationType | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);

  const [showPolishDialog, setShowPolishDialog] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);

  const generateContent = async (type: AIGenerationType) => {
    // 润色功能使用单独的弹窗
    if (type === AI_GENERATION_TYPES.POLISH) {
      if (!content.trim()) {
        toast.warning("请先输入文章内容");
        return;
      }
      setShowPolishDialog(true);
      return;
    }

    setIsLoading(true);
    setLoadingType(type);

    try {
      const response = await fetch("/api/ai/write/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          content: "技术博客文章",
          options: {
            count: type === AI_GENERATION_TYPES.TITLE ? 3 : undefined
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "生成失败");
      }

      const data = await response.json();
    } catch (error) {
      console.error("AI 生成错误:", error);
      toast.error("AI 生成失败，请重试");
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };
  function handlePolish(): void {
    throw new Error("Function not implemented.");
  }

  const getTypeLabel = (type: AIGenerationType) => {
    const labels: Record<AIGenerationType, string> = {
      [AI_GENERATION_TYPES.TITLE]: "生成的标题",
      [AI_GENERATION_TYPES.EXCERPT]: "生成的摘要",
      [AI_GENERATION_TYPES.POLISH]: "润色后的内容"
    };
    return labels[type];
  };
  const handleResultSelect = (result?: string) => {
    if (!generationResult) return;

    switch (generationResult.type) {
      case AI_GENERATION_TYPES.TITLE:
        if (result) {
          onTitleSelect?.(result);
          toast.success("已应用标题");
        }
        break;
      case AI_GENERATION_TYPES.EXCERPT:
        if (typeof generationResult.results === "string") {
          onExcerptGenerated?.(generationResult.results);
          toast.success("已生成摘要");
        }
      case AI_GENERATION_TYPES.POLISH:
        if (typeof generationResult.results === "string") {
          // 润色功能使用 onContentReplace 替换整个内容
          onContentReplace?.(generationResult.results);
          toast.success("已应用润色内容");
        }
        break;
    }

    setShowResultDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-2" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            AI 助手
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>内容生成</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => generateContent(AI_GENERATION_TYPES.TITLE)}
            disabled={isLoading}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            生成标题
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => generateContent(AI_GENERATION_TYPES.EXCERPT)}
            disabled={isLoading}
          >
            <FileText className="h-4 w-4 mr-2" />
            {loadingType === AI_GENERATION_TYPES.EXCERPT ? "生成中..." : "生成摘要"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>写作辅助</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => generateContent(AI_GENERATION_TYPES.POLISH)}
            disabled={isLoading}
          >
            <Pencil className="h-4 w-4 mr-2" />
            全文润色
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 全文润色弹窗 */}
      <Dialog open={showPolishDialog} onOpenChange={setShowPolishDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-gray-900 dark:text-gray-100" />
              全文润色
            </DialogTitle>
            <DialogDescription>润色全文 ({content.length} 字)</DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="润色要求（可选）：如使用更正式的语气..."
              rows={2}
              className="resize-none text-sm"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowPolishDialog(false);
                setCustomPrompt("");
              }}
              disabled={isPolishing}
            >
              取消
            </Button>
            <Button size="sm" onClick={handlePolish} disabled={isPolishing}>
              {isPolishing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  润色中
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  润色
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 结果对话框 */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gray-900 dark:text-gray-100" />
              {generationResult && getTypeLabel(generationResult.type)}
            </DialogTitle>
            <DialogDescription>
              {generationResult?.type === AI_GENERATION_TYPES.POLISH
                ? "查看润色后的内容，确认后将替换原文"
                : "点击选择要使用的内容"}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {generationResult && (
              <>
                {/* 标题选择 */}
                {generationResult.type === AI_GENERATION_TYPES.TITLE &&
                  Array.isArray(generationResult.results) && (
                    <div className="space-y-3">
                      {(generationResult.results as string[]).map((result, index) => (
                        <button
                          key={index}
                          onClick={() => handleResultSelect(result)}
                          className="w-full p-4 text-left border rounded-lg hover:bg-accent hover:border-primary transition-colors"
                        >
                          <span className="text-sm text-muted-foreground mr-2">{index + 1}.</span>
                          {result}
                        </button>
                      ))}
                    </div>
                  )}

                {/* 单个结果（摘要、大纲、润色） */}
                {(generationResult.type === AI_GENERATION_TYPES.EXCERPT ||
                  generationResult.type === AI_GENERATION_TYPES.POLISH) &&
                  typeof generationResult.results === "string" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg whitespace-pre-wrap text-sm leading-relaxed max-h-[400px] overflow-y-auto">
                        {generationResult.results}
                      </div>
                      <Button className="w-full" onClick={() => handleResultSelect()}>
                        {generationResult.type === AI_GENERATION_TYPES.EXCERPT
                          ? "使用此摘要"
                          : generationResult.type === AI_GENERATION_TYPES.POLISH
                            ? "应用润色内容（替换原文）"
                            : "插入到编辑器"}
                      </Button>
                    </div>
                  )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
