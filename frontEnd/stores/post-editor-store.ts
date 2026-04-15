"use client";

import { create } from "zustand";
import type { AdminPostStatus } from "@/lib/admin-types";

export interface PostEditorFormState {
  title: string;
  summary: string;
  content: string;
  cover: string;
  categoryId: string;
  tagIds: string[];
  status: AdminPostStatus;
}

interface PostEditorState {
  form: PostEditorFormState;
  isPreviewVisible: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  setField: <K extends keyof PostEditorFormState>(field: K, value: PostEditorFormState[K]) => void;
  setPreviewVisible: (value: boolean) => void;
  setSubmitting: (value: boolean) => void;
  setErrorMessage: (value: string | null) => void;
  reset: () => void;
  replaceForm: (form: Partial<PostEditorFormState>) => void;
}

const initialForm: PostEditorFormState = {
  title: "",
  summary: "",
  content: `# 新文章\n\n在这里开始写作。\n\n## Mermaid 示例\n\n\`\`\`mermaid\ngraph TD\n  A[Start] --> B{Write}\n  B --> C[Preview]\n  C --> D[Publish]\n\`\`\`\n`,
  cover: "",
  categoryId: "",
  tagIds: [],
  status: "DRAFT"
};

export const usePostEditorStore = create<PostEditorState>((set) => ({
  form: initialForm,
  isPreviewVisible: true,
  isSubmitting: false,
  errorMessage: null,
  setField(field, value) {
    set((state) => ({
      form: {
        ...state.form,
        [field]: value
      }
    }));
  },
  setPreviewVisible(value) {
    set({ isPreviewVisible: value });
  },
  setSubmitting(value) {
    set({ isSubmitting: value });
  },
  setErrorMessage(value) {
    set({ errorMessage: value });
  },
  reset() {
    set({
      form: initialForm,
      isPreviewVisible: true,
      isSubmitting: false,
      errorMessage: null
    });
  },
  replaceForm(form) {
    set((state) => ({
      form: {
        ...state.form,
        ...form
      }
    }));
  }
}));
