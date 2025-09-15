import { redirect } from "next/navigation";
import { PrivateLayoutWrapper } from "@/components/private-layout-wrapper";
import { getCurrentUser } from "@/server/services/auth/get-current-user";
import { getWorkspaceSpaces } from "@/server/services/space/get-workspace-spaces";
import {
  getUserWorkspace,
  getUserWorkspaces,
} from "@/server/services/workspace/get-user-workspace";

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

  // Busca spaces apenas se houver workspace
  const workspaceSpaces = userWorkspace
    ? await getWorkspaceSpaces(userWorkspace.id)
    : [];

  return (
    <PrivateLayoutWrapper
      initialWorkspace={userWorkspace}
      initialWorkspaces={userWorkspaces}
      initialSpaces={workspaceSpaces}
    >
      {children}
    </PrivateLayoutWrapper>
  );
}
