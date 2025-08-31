"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function useCreateWorkspace() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const createWorkspace = async (workspaceData?: {
    name: string;
    description?: string;
  }) => {
    setIsCreating(true);
    setError(null);

    try {
      // If no data provided, navigate to creation page
      if (!workspaceData) {
        router.push("/create-workspace");
        return;
      }

      // API call to create workspace
      const response = await fetch("/api/workspace/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workspaceData),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar workspace");
      }

      const data = await response.json();

      if (data.success) {
        // Redirect to the new workspace or refresh
        router.push(`/workspace/${data.workspace.id}`);
        router.refresh();
      } else {
        setError(data.error || "Erro ao criar workspace");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro interno");
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createWorkspace,
    isCreating,
    error,
  };
}
