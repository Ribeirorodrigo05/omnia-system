import type React from "react";
import type { Space as ServerSpace } from "@/server/types/workspace";

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  href?: string;
  action?: () => void;
}

export interface SidebarProps {
  className?: string;
  workspaceId?: string;
}

export interface CreateCategoryDialogState {
  isOpen: boolean;
  spaceId: string;
  categoryType: "FOLDER" | "LIST" | "SPRINT";
}

export type Space = Pick<ServerSpace, "id" | "name">;
