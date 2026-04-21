interface NewPostEditorProps {
  mode: "create" | "edit";
  postId?: string;
}

export default function NewPostEditor({ mode, postId }: NewPostEditorProps) {
  return (
    <div className="new-post-editor">
      <h2>{mode === "create" ? "新建文章" : "编辑文章"}</h2>
    </div>
  );
}
