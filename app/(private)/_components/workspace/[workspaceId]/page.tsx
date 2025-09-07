export default function WorkspacePage({
  params,
}: {
  params: { workspaceId: string };
}) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Workspace Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Bem-vindo ao seu workspace! Use o menu lateral para navegar pelos
        spaces.
      </p>

      <div className="grid gap-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Workspace ID</h2>
          <p className="text-sm text-muted-foreground font-mono">
            {params.workspaceId}
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Próximos passos</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Navegue pelos spaces disponíveis no menu lateral</li>
            <li>• Crie novos spaces conforme necessário</li>
            <li>• Convide outros membros para colaborar</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
