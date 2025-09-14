import { getCurrentUser } from "@/server/services/auth/get-current-user";
import { getUserWorkspace, getUserWorkspaces } from "@/server/services/workspace/get-user-workspace";
import { PrivateLayoutWrapper } from "@/components/private-layout-wrapper";
import { redirect } from "next/navigation";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const userId = await getCurrentUser();

  if (!userId) {
    redirect("/login");
  }

  const userWorkspace = await getUserWorkspace();
  const userWorkspaces = await getUserWorkspaces();

  return (
    <PrivateLayoutWrapper
      initialWorkspace={userWorkspace}
      initialWorkspaces={userWorkspaces}
    >
      {children}
    </PrivateLayoutWrapper>
  );
}
