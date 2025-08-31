"use client";

import { useState } from "react";
import type { CreateSpaceSchema } from "@/server/validators/space-validation";

export function useCreateSpace() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSpace = async (spaceData: CreateSpaceSchema) => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/spaces/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(spaceData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao criar space");
        return null;
      }

      if (data.success) {
        return data.space;
      } else {
        setError(data.error || "Erro ao criar space");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro interno");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const clearError = () => setError(null);

  return {
    createSpace,
    isCreating,
    error,
    clearError,
  };
}
