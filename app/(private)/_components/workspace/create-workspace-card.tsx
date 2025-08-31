"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreateWorkspace } from "../../_hooks/use-create-workspace";

export function CreateWorkspaceCard() {
  const { createWorkspace, isCreating, error } = useCreateWorkspace();

  const handleCreateWorkspace = () => {
    createWorkspace(); // This will navigate to creation page
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl">
              Nenhum workspace encontrado
            </CardTitle>
            <CardDescription className="mt-2">
              Você não está vinculado a nenhum workspace. Crie um novo para
              começar.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button
            onClick={handleCreateWorkspace}
            className="w-full"
            size="lg"
            disabled={isCreating}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isCreating ? "Criando..." : "Criar workspace"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
