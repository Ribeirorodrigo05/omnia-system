import { Sidebar } from "./_components/layouts/sidebar";
import { CreateWorkspaceCard } from "./_components/workspace/create-workspace-card";
import { getCurrentUser } from "@/server/services/auth/get-current-user";
import { checkUserWorkspace } from "@/server/services/workspace-service/check-user-workspace";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const userId = await getCurrentUser();

  if (!userId) {
    return null; // Will be handled by middleware
  }

  const { hasWorkspace, workspace } = await checkUserWorkspace(userId);

  if (!hasWorkspace) {
    return (
      <div className="flex min-h-screen">
        <aside className="flex-shrink-0">
          <Sidebar />
        </aside>
        <main className="flex-1">
          <CreateWorkspaceCard />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex-shrink-0">
        <Sidebar workspaceId={workspace?.id} />
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
