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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateWorkspace } from "../../_hooks/use-create-workspace";
import { useState } from "react";
import { createWorkspaceSchema } from "@/server/validators/workspace-validation";

export function CreateWorkspaceCard() {
  const { createWorkspace, isCreating, error } = useCreateWorkspace();
  const [workspaceName, setWorkspaceName] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const validation = createWorkspaceSchema.safeParse({ name: workspaceName });

    if (!validation.success) {
      setValidationError(validation.error.errors[0].message);
      return;
    }

    await createWorkspace(validation.data);
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

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Nome do workspace</Label>
              <Input
                id="workspace-name"
                type="text"
                placeholder="Digite o nome do workspace"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                disabled={isCreating}
                data-testid="workspace-name-input"
              />
            </div>

            {(validationError || error) && (
              <p
                className="text-destructive text-sm"
                data-testid="error-message"
              >
                {validationError || error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isCreating || !workspaceName.trim()}
              data-testid="create-workspace-button"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isCreating ? "Criando..." : "Criar workspace"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
