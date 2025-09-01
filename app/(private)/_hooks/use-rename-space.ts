"use client";

import { useState } from "react";

export function useRenameSpace() {
  const [isRenaming, setIsRenaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renameSpace = async (
    spaceId: string,
    newName: string,
    workspaceId: string,
  ) => {
    setIsRenaming(true);
    setError(null);

    try {
      const response = await fetch(`/api/spaces/${spaceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          workspaceId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao renomear space");
        return null;
      }

      if (data.success) {
        return data.space;
      } else {
        setError(data.error || "Erro ao renomear space");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro interno");
      return null;
    } finally {
      setIsRenaming(false);
    }
  };

  const clearError = () => setError(null);

  return {
    renameSpace,
    isRenaming,
    error,
    clearError,
  };
}
