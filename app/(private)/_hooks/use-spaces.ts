"use client";

import { useState, useEffect, useCallback } from "react";
import type { Space } from "@/server/types/workspace";

export function useSpaces(workspaceId: string | null) {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpaces = useCallback(async () => {
    if (!workspaceId) {
      setSpaces([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/spaces?workspaceId=${workspaceId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch spaces");
      }

      const data = await response.json();
      setSpaces(data.spaces);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  const refetch = useCallback(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  return { spaces, loading, error, refetch };
}
