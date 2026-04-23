import ModernAdminLayout from "@/components/admin/modernAdminLayout";
import NewPostEditor from "@/components/admin/new-post-editor";

export default function NewPostPage() {
  return (
    <ModernAdminLayout>
      <NewPostEditor mode="create" />
    </ModernAdminLayout>
  );
}
