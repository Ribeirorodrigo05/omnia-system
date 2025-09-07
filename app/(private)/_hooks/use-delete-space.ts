"use client";

import { useState } from "react";

export function useDeleteSpace() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSpace = async (spaceId: string, workspaceId: string) => {
    if (!spaceId || !workspaceId) return false;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/spaces/${spaceId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workspaceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete space");
      }

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteSpace, isDeleting, error };
}
