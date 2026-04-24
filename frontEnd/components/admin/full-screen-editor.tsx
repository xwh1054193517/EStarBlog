"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Send, Save, ImageIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import TiptapEditorWrapper from "./tiptap-editor-wrapper";
import PublishDialog, { type PublishData } from "./publish-dialog";
import AIAssistant from "./ai-assistant";

interface FullscreenEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onClose: () => void;
  onSave: () => void;
  onPublish: (data: PublishData) => Promise<void>;
  isLoading: boolean;
  mode: "create" | "edit";
  initialPublishData?: Partial<PublishData>;
  postId?: string;
  postSlug?: string;
}
export default function FullscreenEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  onClose,
  onSave,
  onPublish,
  isLoading,
  mode,
  initialPublishData,
  postId,
  postSlug
}: FullscreenEditorProps) {
  const [showPublicDialog, setShowPublicDialog] = useState(false);
  // 单词计数
  const [wordCount, setWordCount] = useState(0);
  // 字符计数
  const [charCount, setCharCount] = useState(0);
  // 编辑器实例引用
  const editorRef = useRef<any>(null);
  // AI 生成的数据（传递给发布对话框）
  const [aiExcerpt, setAiExcerpt] = useState<string | undefined>();
  useEffect(() => {
    // 计算单词数和字符数
    const textContent = content.replace(/[#*`_\[\]()!-]/g, "").trim();
    setWordCount(textContent.split(/\s+/).filter((word) => word.length > 0).length);
    setCharCount(content.length);
  }, [content]);

  // 监听键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            onSave();
            break;
          case "Enter":
            e.preventDefault();
            setShowPublicDialog(true);
            break;
          case "Escape":
            e.preventDefault();
            onClose();
            break;
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSave, onClose]);

  // 弹窗用的完成回调
  const handlePulish = useCallback(
    async (data: PublishData) => {
      await onPublish(data);
      setShowPublicDialog(false);
    },
    [onPublish]
  );

  return (
    <>
      <div className="fixed inset-0 z-50 bg-background">
        {/* 顶部工具栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-semibold">
                {mode === "create" ? "新建文章" : "编辑文章"}
              </h1>
              {title && (
                <Badge variant="outline" className="text-xs">
                  {title}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* 统计信息 */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{wordCount} 词</span>
              <span>{charCount} 字符</span>
            </div>
            {/* ai助手 */}
            <AIAssistant
              content={content}
              title={title}
              onTitleSelect={(newTitle) => onTitleChange(newTitle)}
              onExcerptGenerated={(excerpt) => setAiExcerpt(excerpt)}
              onContentInsert={(text) => {
                // 将内容插入到编辑器末尾
                onContentChange(content + "\n\n" + text);
              }}
              onContentReplace={(text) => {
                // 润色功能：替换整个内容
                onContentChange(text);
              }}
            />
            {/* <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              disabled={isLoading}
              className="h-8"
            >
              <Save className="h-4 w-4 mr-2" />
              保存草稿
            </Button> */}
            <Button
              size="sm"
              onClick={() => setShowPublicDialog(true)}
              disabled={isLoading || !title.trim() || !content.trim()}
              className="h-8"
            >
              <Send className="h-4 w-4 mr-2" />
              保存/发布
            </Button>
          </div>
        </div>

        {/* 标题输入区域 */}
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="请输入文章标题..."
            className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground resize-none"
            autoFocus
          />
        </div>

        {/* Novel 编辑器区域 */}
        <div className="flex-1 overflow-auto relative" style={{ height: "calc(100vh - 140px)" }}>
          <div className="h-full w-full">
            <TiptapEditorWrapper
              value={content}
              onChange={onContentChange}
              placeholder="请输入文章内容..."
              postId={postId}
              postSlug={postSlug}
              onEditorReady={(editor) => {
                editorRef.current = editor;
              }}
            ></TiptapEditorWrapper>
          </div>
        </div>
      </div>

      {/* 发布弹窗 */}
      <PublishDialog
        open={showPublicDialog}
        onClose={() => setShowPublicDialog(false)}
        onPublish={handlePulish}
        initialData={{ ...initialPublishData, excerpt: aiExcerpt || initialPublishData?.excerpt }}
        postTitle={title}
        isPublishing={isLoading}
      />
    </>
  );
}
