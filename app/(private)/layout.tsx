import { Sidebar } from "./_components/layouts/sidebar";
import { CreateWorkspaceCard } from "./_components/workspace/create-workspace-card";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const hasWorkspace = await checkUserWorkspace();
  const hasWorkspace = false; // Temporary - replace with actual check

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
        <Sidebar />
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
