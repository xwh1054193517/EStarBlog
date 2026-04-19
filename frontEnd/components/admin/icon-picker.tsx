"use client";

import { useState, useRef, useEffect } from "react";

const ICONS = [
  "github-fill",
  "github-line",
  "twitter-x-fill",
  "twitter-x-line",
  "instagram-fill",
  "instagram-line",
  "youtube-fill",
  "youtube-line",
  "bilibili-fill",
  "bilibili-line",
  "mail-fill",
  "mail-line",
  "send-plane-fill",
  "send-plane-line",
  "link",
  "external-link-line",
  "rss-fill",
  "rss-line",
  "global-fill",
  "global-line",
  "code-fill",
  "code-line",
  "command-fill",
  "command-line",
  "star-fill",
  "star-line",
  "heart-fill",
  "heart-line",
  "user-fill",
  "user-line",
  "settings-fill",
  "settings-line",
  "home-fill",
  "home-line",
  "folder-fill",
  "folder-line",
  "file-fill",
  "file-line",
  "book-fill",
  "book-line",
  "image-fill",
  "image-line",
  "camera-fill",
  "camera-line",
  "video-fill",
  "video-line",
  "music-fill",
  "music-line",
  "phone-fill",
  "phone-line",
  "smartphone-fill",
  "smartphone-line",
  "computer-fill",
  "computer-line",
  "cloud-fill",
  "cloud-line",
  "database-fill",
  "database-line",
  "lock-fill",
  "lock-line",
  "key-fill",
  "key-line",
  "shield-fill",
  "shield-line",
  "eye-fill",
  "eye-line",
  "bell-fill",
  "bell-line",
  "message-fill",
  "message-line",
  "chat-fill",
  "chat-line",
  "calendar-fill",
  "calendar-line",
  "clock-fill",
  "clock-line",
  "map-pin-fill",
  "map-pin-line",
  "navigation-fill",
  "navigation-line",
  "compass-fill",
  "compass-line",
  "globe-fill",
  "globe-line",
  "share-fill",
  "share-line",
  "fire-fill",
  "fire-line",
  "check-fill",
  "check-line",
  "close-fill",
  "close-line",
  "add-fill",
  "add-line",
  "delete-fill",
  "delete-line",
  "edit-fill",
  "edit-line",
  "refresh-fill",
  "refresh-line",
  "download-fill",
  "download-line",
  "upload-fill",
  "upload-line",
  "copy-fill",
  "copy-line",
  "emoji-fill",
  "emoji-line"
];

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-10 h-10 border rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <i className={`ri-${value || "question-line"} text-lg`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 right-0 w-64 bg-white dark:bg-gray-800 border rounded-xl shadow-lg p-2 max-h-72 overflow-y-auto">
          <div className="grid grid-cols-6 gap-1">
            {ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => {
                  onChange(icon);
                  setOpen(false);
                }}
                className={`w-9 h-9 rounded flex items-center justify-center transition-colors ${
                  value === icon
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                title={icon}
              >
                <i className={`ri-${icon} text-sm`} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
