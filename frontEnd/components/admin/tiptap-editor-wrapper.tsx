"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Code2,
  Minus,
  Undo2,
  Redo2,
  Link2,
  ImageIcon,
  Eye,
  Pencil
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LinkDialog from "./link-dialog";
// import { AICompletion } from "@/lib/editor/ai-complete-extension";
import { markdownToJSON, jsonToMarkdown } from "@/lib/editor/markdown-converter";
import { uploadFile } from "@/lib/api/uploadApi";

interface TiptapEditorWrapperProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  postId?: string;
  postSlug?: string;
  onEditorReady?: (editor: Editor) => void;
}

type EditorMode = "visual" | "preview";

interface ToolbarButtonProps {
  editor?: Editor | null;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({
  editor,
  onClick,
  isActive = false,
  disabled = false,
  title,
  children
}: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      size="sm"
      variant={isActive ? "default" : "outline"}
      onMouseDown={(e: React.MouseEvent) => {
        e.preventDefault();
        if (!disabled) onClick();
      }}
      disabled={disabled || (editor ? !editor.isEditable : false)}
      title={title}
      className="h-8 px-2"
    >
      {children}
    </Button>
  );
}

function getCurrentBlockLabel(editor: Editor | null): string {
  if (!editor) return "正文";
  if (editor.isActive("heading", { level: 1 })) return "标题 1";
  if (editor.isActive("heading", { level: 2 })) return "标题 2";
  if (editor.isActive("heading", { level: 3 })) return "标题 3";
  if (editor.isActive("blockquote")) return "引用";
  if (editor.isActive("codeBlock")) return "代码块";
  if (editor.isActive("bulletList")) return "无序列表";
  if (editor.isActive("orderedList")) return "有序列表";
  return "正文";
}

function ModeSwitcher({
  mode,
  onChange
}: {
  mode: EditorMode;
  onChange: (mode: EditorMode) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        size="sm"
        variant={mode === "visual" ? "default" : "outline"}
        onClick={() => onChange("visual")}
        className="h-8"
      >
        <Pencil className="mr-2 h-4 w-4" />
        可视化
      </Button>
      <Button
        type="button"
        size="sm"
        variant={mode === "preview" ? "default" : "outline"}
        onClick={() => onChange("preview")}
        className="h-8"
      >
        <Eye className="mr-2 h-4 w-4" />
        预览
      </Button>
    </div>
  );
}

function EditorToolbar({
  editor,
  mode,
  onModeChange,
  onInsertLink,
  onInsertImage
}: {
  editor: Editor | null;
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  onInsertLink: () => void;
  onInsertImage: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="mr-2">
            {mode === "visual" ? getCurrentBlockLabel(editor) : "预览"}
          </Badge>

          {mode === "visual" && editor && (
            <>
              <ToolbarButton
                editor={editor}
                title="标题 1"
                isActive={editor.isActive("heading", { level: 1 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              >
                <Heading1 className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                editor={editor}
                title="标题 2"
                isActive={editor.isActive("heading", { level: 2 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              >
                <Heading2 className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                editor={editor}
                title="标题 3"
                isActive={editor.isActive("heading", { level: 3 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              >
                <Heading3 className="h-4 w-4" />
              </ToolbarButton>

              <div className="mx-1 h-6 w-px bg-border" />

              <ToolbarButton
                editor={editor}
                title="加粗"
                isActive={editor.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                <Bold className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                editor={editor}
                title="斜体"
                isActive={editor.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <Italic className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                editor={editor}
                title="删除线"
                isActive={editor.isActive("strike")}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              >
                <Strikethrough className="h-4 w-4" />
              </ToolbarButton>

              <div className="mx-1 h-6 w-px bg-border" />

              <ToolbarButton
                editor={editor}
                title="引用"
                isActive={editor.isActive("blockquote")}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
              >
                <Quote className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                editor={editor}
                title="无序列表"
                isActive={editor.isActive("bulletList")}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                <List className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                editor={editor}
                title="有序列表"
                isActive={editor.isActive("orderedList")}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              >
                <ListOrdered className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                editor={editor}
                title="代码块"
                isActive={editor.isActive("codeBlock")}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              >
                <Code2 className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                editor={editor}
                title="分割线"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              >
                <Minus className="h-4 w-4" />
              </ToolbarButton>

              <div className="mx-1 h-6 w-px bg-border" />

              <ToolbarButton editor={editor} title="插入链接" onClick={onInsertLink}>
                <Link2 className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton editor={editor} title="插入图片" onClick={onInsertImage}>
                <ImageIcon className="h-4 w-4" />
              </ToolbarButton>

              <div className="mx-1 h-6 w-px bg-border" />

              <ToolbarButton
                editor={editor}
                title="撤销"
                disabled={!editor.can().chain().focus().undo().run()}
                onClick={() => editor.chain().focus().undo().run()}
              >
                <Undo2 className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarButton
                editor={editor}
                title="重做"
                disabled={!editor.can().chain().focus().redo().run()}
                onClick={() => editor.chain().focus().redo().run()}
              >
                <Redo2 className="h-4 w-4" />
              </ToolbarButton>
            </>
          )}
        </div>

        <ModeSwitcher mode={mode} onChange={onModeChange} />
      </div>
    </div>
  );
}

export default function TiptapEditorWrapper({
  value,
  onChange,
  placeholder = "开始写作吧...",
  postId,
  postSlug,
  onEditorReady
}: TiptapEditorWrapperProps) {
  const isUpdatingRef = useRef(false);

  const [mode, setMode] = useState<EditorMode>("visual");
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkInitialText, setLinkInitialText] = useState("");
  const [linkInitialUrl, setLinkInitialUrl] = useState("");

  const createEmptyDoc = (): JSONContent => ({
    type: "doc",
    content: [{ type: "paragraph" }]
  });

  const safeMarkdownToJSON = (markdown: string): JSONContent => {
    if (!markdown.trim()) return createEmptyDoc();

    try {
      return markdownToJSON(markdown);
    } catch (error) {
      console.error("Markdown 转 JSON 失败:", error);
      return createEmptyDoc();
    }
  };

  const initialContent = useMemo<JSONContent>(() => {
    return safeMarkdownToJSON(value);
  }, []);

  const handleImageUpload = async (file: File): Promise<string> => {
    const uploaded = await uploadFile(file, "content");
    if (!uploaded.fileUrl) {
      throw new Error("图片上传失败");
    }
    return uploaded.fileUrl;
  };

  const editor = useEditor({
    immediatelyRender: false,
    content: initialContent,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: "rounded-xl max-w-full mx-auto h-auto my-4"
        }
      }),
      Placeholder.configure({
        placeholder
      })
      //   AICompletion.configure({
      //     debounceMs: 500,
      //     minChars: 3,
      //     apiEndpoint: "/api/ai/write/complete",
      //   }),
    ],
    editorProps: {
      attributes: {
        class: [
          "tiptap-editor-content",
          "prose dark:prose-invert max-w-none",
          "min-h-[600px] px-6 py-6",
          "focus:outline-none"
        ].join(" ")
      },

      handleDrop(view, event, _slice, moved) {
        if (
          moved ||
          !event.dataTransfer ||
          !event.dataTransfer.files ||
          !event.dataTransfer.files.length
        ) {
          return false;
        }

        console.log(view);
        const file = event.dataTransfer.files[0];
        if (!file.type.startsWith("image/")) return false;

        event.preventDefault();

        handleImageUpload(file)
          .then((url) => {
            const coordinates = view.posAtCoords({
              left: event.clientX,
              top: event.clientY
            });
            if (!coordinates) return;

            const imageNode = view.state.schema.nodes.image.create({ src: url });
            view.dispatch(view.state.tr.insert(coordinates.pos, imageNode));
          })
          .catch((error) => {
            console.error("图片拖拽上传失败:", error);
          });

        return true;
      },

      handlePaste(view, event) {
        const files = event.clipboardData?.files;
        if (!files || !files.length) return false;

        const file = files[0];
        if (!file.type.startsWith("image/")) return false;

        event.preventDefault();

        handleImageUpload(file)
          .then((url) => {
            const imageNode = view.state.schema.nodes.image.create({ src: url });
            view.dispatch(view.state.tr.replaceSelectionWith(imageNode));
          })
          .catch((error) => {
            console.error("图片粘贴上传失败:", error);
          });

        return true;
      }
    },
    onCreate({ editor }: { editor: Editor }) {
      onEditorReady?.(editor);
    },
    onUpdate({ editor }: { editor: Editor }) {
      if (isUpdatingRef.current) return;

      try {
        const markdown = jsonToMarkdown(editor.getJSON());
        onChange(markdown);
      } catch (error) {
        console.error("JSON 转 Markdown 失败:", error);
      }
    }
  });

  useEffect(() => {
    if (!editor || isUpdatingRef.current) return;

    let currentMarkdown = "";
    try {
      currentMarkdown = jsonToMarkdown(editor.getJSON()).trim();
    } catch (error) {
      console.error("读取编辑器内容失败:", error);
      return;
    }

    const nextMarkdown = value.trim();
    if (currentMarkdown === nextMarkdown) return;

    isUpdatingRef.current = true;

    try {
      editor.commands.setContent(safeMarkdownToJSON(value));
    } catch (error) {
      console.error("外部内容同步到编辑器失败:", error);
    } finally {
      isUpdatingRef.current = false;
    }
  }, [editor, value]);

  const handleOpenLinkDialog = () => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    const selectedText = from !== to ? editor.state.doc.textBetween(from, to, " ") : "";

    setLinkInitialText(selectedText || "");
    setLinkInitialUrl("");
    setShowLinkDialog(true);
  };

  const handleConfirmInsertLink = ({ text, url }: { text: string; url: string }) => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;

    if (hasSelection) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    } else {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text,
          marks: [{ type: "link", attrs: { href: url } }]
        })
        .run();
    }
  };

  const handleInsertImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const url = await handleImageUpload(file);

        if (!editor) return;

        editor.chain().focus().setImage({ src: url, alt: "" }).createParagraphNear().run();
      } catch (error) {
        console.error(error);
        window.alert("图片上传失败");
      }
    };

    input.click();
  };

  if (!editor) {
    return (
      <div className="h-full w-full overflow-hidden rounded-xl border bg-background">
        <div className="border-b px-4 py-3">
          <div className="h-8 w-full" />
        </div>
        <div className="px-6 py-6" />
      </div>
    );
  }

  const previewMarkdown = value;

  return (
    <>
      <div className="h-full w-full overflow-hidden rounded-xl border bg-background">
        <EditorToolbar
          editor={editor}
          mode={mode}
          onModeChange={setMode}
          onInsertLink={handleOpenLinkDialog}
          onInsertImage={handleInsertImage}
        />

        <div className="border-b px-4 py-2 text-sm text-muted-foreground">
          当前模式：
          {mode === "visual" ? `可视化 / ${getCurrentBlockLabel(editor)}` : "预览"}
        </div>

        <div className="overflow-auto" style={{ height: "calc(100% - 89px)" }}>
          {mode === "visual" && <EditorContent editor={editor} />}

          {mode === "preview" && (
            <div className="px-6 py-6">
              <div className="tiptap-editor-content prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{previewMarkdown}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        <style jsx global>{`
          .tiptap-editor-content {
            line-height: 1.8;
            font-size: 16px;
            word-break: break-word;
          }

          .tiptap-editor-content:focus {
            outline: none;
          }

          .tiptap-editor-content h1 {
            font-size: 2rem;
            font-weight: 800;
            line-height: 1.2;
            margin-top: 1.75rem;
            margin-bottom: 0.875rem;
            letter-spacing: -0.02em;
          }

          .tiptap-editor-content h2 {
            font-size: 1.5rem;
            font-weight: 750;
            line-height: 1.3;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            letter-spacing: -0.015em;
          }

          .tiptap-editor-content h3 {
            font-size: 1.25rem;
            font-weight: 700;
            line-height: 1.4;
            margin-top: 1.25rem;
            margin-bottom: 0.625rem;
          }

          .tiptap-editor-content p {
            margin: 0.8rem 0;
          }

          .tiptap-editor-content blockquote {
            border-left: 4px solid hsl(var(--border));
            padding-left: 1rem;
            margin: 1rem 0;
            color: hsl(var(--muted-foreground));
          }

          .tiptap-editor-content ul,
          .tiptap-editor-content ol {
            padding-left: 1.5rem;
            margin: 0.8rem 0;
          }

          .tiptap-editor-content li {
            margin: 0.25rem 0;
          }

          .tiptap-editor-content pre {
            background: hsl(var(--muted));
            color: inherit;
            border-radius: 0.75rem;
            padding: 1rem;
            margin: 1rem 0;
            overflow-x: auto;
          }

          .tiptap-editor-content code {
            background: hsl(var(--muted));
            border-radius: 0.375rem;
            padding: 0.15rem 0.35rem;
            font-size: 0.875em;
          }

          .tiptap-editor-content pre code {
            background: transparent;
            padding: 0;
            border-radius: 0;
          }

          .tiptap-editor-content hr {
            border: none;
            border-top: 1px solid hsl(var(--border));
            margin: 1.5rem 0;
          }

          .tiptap-editor-content img {
            display: block;
            max-width: min(100%, 720px);
            height: auto;
            margin: 1rem auto;
            border-radius: 0.75rem;
          }

          .tiptap-editor-content a {
            color: hsl(var(--primary));
            text-decoration: underline;
            text-underline-offset: 2px;
          }

          .tiptap-editor-content .is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: hsl(var(--muted-foreground));
            pointer-events: none;
            height: 0;
          }
        `}</style>
      </div>

      <LinkDialog
        open={showLinkDialog}
        onOpenChange={setShowLinkDialog}
        onConfirm={handleConfirmInsertLink}
        initialText={linkInitialText}
        initialUrl={linkInitialUrl}
      />
    </>
  );
}
