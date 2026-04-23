"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: { text: string; url: string }) => void;
  initialText?: string;
  initialUrl?: string;
}

export default function LinkDialog({
  open,
  onOpenChange,
  onConfirm,
  initialText = "",
  initialUrl = "",
}: LinkDialogProps) {
  const [text, setText] = useState(initialText);
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setText(initialText);
      setUrl(initialUrl);
      setError("");
    }
  }, [open, initialText, initialUrl]);

  const normalizeUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";

    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  };

  const handleConfirm = () => {
    const cleanUrl = normalizeUrl(url);
    if (!cleanUrl) return;

    try {
      const parsedUrl = new URL(cleanUrl);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Unsupported protocol");
      }

      const normalizedUrl = parsedUrl.toString();
      onConfirm({
        text: text.trim() || normalizedUrl,
        url: normalizedUrl,
      });
      onOpenChange(false);
    } catch {
      setError("Invalid URL");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border bg-background shadow-xl">
        <div className="border-b px-5 py-4">
          <h3 className="text-base font-semibold">插入链接</h3>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">链接文字</label>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="例如：查看详情"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">链接地址</label>
            <input
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              placeholder="https://example.com"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-5 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!url.trim()}
          >
            插入
          </Button>
        </div>
      </div>
    </div>
  );
}
