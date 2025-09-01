"use client";

import { useState, useEffect, useCallback } from "react";
import type { Category, CategoryType } from "@/server/types/categories";

export function useCategories(spaceId: string) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/categories/space?spaceId=${spaceId}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar categorias");
      }

      const data = await response.json();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  }, [spaceId]);

  useEffect(() => {
    if (spaceId) {
      fetchCategories();
    }
  }, [spaceId, fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
}

export function useSubcategories(categoryId: string) {
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubcategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/categories/${categoryId}/subcategories`,
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar subcategorias");
      }

      const data = await response.json();
      setSubcategories(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (categoryId) {
      fetchSubcategories();
    }
  }, [categoryId, fetchSubcategories]);

  return {
    subcategories,
    isLoading,
    error,
    refetch: fetchSubcategories,
  };
}

export function useCreateCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = async (
    name: string,
    type: CategoryType,
    spaceId: string,
    categoryId?: string,
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          type,
          spaceId,
          categoryId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar categoria");
      }

      const category = await response.json();
      return {
        success: true,
        data: category,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCategory,
    isLoading,
    error,
  };
}

export function useRenameCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renameCategory = async (categoryId: string, newName: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao renomear categoria");
      }

      const category = await response.json();
      return {
        success: true,
        data: category,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    renameCategory,
    isLoading,
    error,
  };
}
