export default function SpacePage({
  params,
}: {
  params: { workspaceId: string; spaceId: string };
}) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Space</h1>
      <p className="text-muted-foreground">
        Workspace ID: {params.workspaceId}
      </p>
      <p className="text-muted-foreground">Space ID: {params.spaceId}</p>
      <div className="mt-6">
        <p>Conteúdo do space será implementado aqui.</p>
      </div>
    </div>
  );
}
