import { redirect } from "next/navigation";
import { SpaceCategoriesView } from "@/components/space-categories-view";
import { getCurrentUser } from "@/server/services/auth/get-current-user";
import { getSpaceCategories } from "@/server/services/category/get-space-categories";
import { getSpaceDetails } from "@/server/services/space/get-space-details";

interface SpacePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SpacePage({ params }: SpacePageProps) {
  const userId = await getCurrentUser();

  if (!userId) {
    redirect("/login");
  }

  const { id } = await params;

  // Busca detalhes do space e verifica se o usuário tem acesso
  const space = await getSpaceDetails(id);

  if (!space) {
    redirect("/dashboard");
  }

  // Busca as categories do space
  const categories = await getSpaceCategories(id);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{space.name}</h1>
          <p className="text-muted-foreground">
            Manage your lists and sprints for this space
          </p>
        </div>
      </div>

      <SpaceCategoriesView
        spaceId={id}
        spaceName={space.name}
        categories={categories}
      />
    </div>
  );
}
