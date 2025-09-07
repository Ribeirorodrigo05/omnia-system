"use client";

import { useState } from "react";

export function useDeleteCategory() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCategory = async (categoryId: string, spaceId: string) => {
    if (!categoryId || !spaceId) return false;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spaceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete category");
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

  return { deleteCategory, isDeleting, error };
}
