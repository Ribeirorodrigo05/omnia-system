import { getCurrentUser } from "@/server/services/auth/get-current-user";
import { checkUserWorkspace } from "@/server/services/workspace-service/check-user-workspace";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const userId = await getCurrentUser();

  if (!userId) {
    redirect("/login");
  }

  const { hasWorkspace, workspace } = await checkUserWorkspace(userId);

  if (hasWorkspace && workspace) {
    redirect(`/workspace/${workspace.id}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Bem-vindo!</h1>
        <p className="text-muted-foreground">
          Configure seu workspace para começar.
        </p>
      </div>
    </div>
  );
}
