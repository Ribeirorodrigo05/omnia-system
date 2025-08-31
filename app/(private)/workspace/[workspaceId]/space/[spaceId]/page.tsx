export default async function SpacePage({
  params,
}: {
  params: Promise<{ workspaceId: string; spaceId: string }>;
}) {
  const { workspaceId, spaceId } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Space</h1>
      <p className="text-muted-foreground">Workspace ID: {workspaceId}</p>
      <p className="text-muted-foreground">Space ID: {spaceId}</p>
      <div className="mt-6">
        <p>Conteúdo do space será implementado aqui.</p>
      </div>
    </div>
  );
}
