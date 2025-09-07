"use client";

import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Layers,
  MoreHorizontal,
  Edit,
  Plus,
  FolderPlus,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SpaceCategories } from "../../categories/space-categories";
import type { Space } from "../types";

interface SpaceItemProps {
  space: Space;
  workspaceId: string;
  isExpanded: boolean;
  isRenaming: boolean;
  renameValue: string;
  isRenamingLoading: boolean;
  onToggleExpansion: (spaceId: string) => void;
  onStartRename: (space: Space) => void;
  onRename: () => void;
  onCancelRename: () => void;
  onRenameValueChange: (value: string) => void;
  onRenameKeyDown: (e: React.KeyboardEvent) => void;
  onOpenCategoryDialog: (
    spaceId: string,
    categoryType: "FOLDER" | "LIST" | "SPRINT",
  ) => void;
}

export function SpaceItem({
  space,
  workspaceId,
  isExpanded,
  isRenaming,
  renameValue,
  isRenamingLoading,
  onToggleExpansion,
  onStartRename,
  onRename,
  onCancelRename,
  onRenameValueChange,
  onRenameKeyDown,
  onOpenCategoryDialog,
}: SpaceItemProps) {
  const router = useRouter();

  if (isRenaming) {
    return (
      <div className="flex gap-1 p-2">
        <Input
          value={renameValue}
          onChange={(e) => onRenameValueChange(e.target.value)}
          onKeyDown={onRenameKeyDown}
          disabled={isRenamingLoading}
          className="text-xs"
          data-testid={`rename-space-input-${space.id}`}
          autoFocus
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={onRename}
          disabled={isRenamingLoading || !renameValue.trim()}
          data-testid={`confirm-rename-${space.id}`}
        >
          <Check className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onCancelRename}
          disabled={isRenamingLoading}
          data-testid={`cancel-rename-${space.id}`}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center group-hover:pr-8">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 mr-1"
          onClick={() => onToggleExpansion(space.id)}
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronUp className="h-3 w-3" />
          )}
        </Button>
        <Button
          variant="ghost"
          className="flex-1 justify-start p-3 text-left hover:bg-accent"
          onClick={() =>
            router.push(`/workspace/${workspaceId}/space/${space.id}`)
          }
          data-testid={`space-item-${space.id}`}
        >
          <div className="flex items-center gap-3">
            <Layers className="h-5 w-5 text-primary" />
            <span className="font-medium">{space.name}</span>
          </div>
        </Button>

        <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                data-testid={`space-menu-${space.id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => onStartRename(space)}
                data-testid={`rename-space-${space.id}`}
              >
                <Edit className="mr-2 h-4 w-4" />
                Renomear
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger data-testid={`create-menu-${space.id}`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => onOpenCategoryDialog(space.id, "FOLDER")}
                    data-testid={`create-folder-${space.id}`}
                  >
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Pasta
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isExpanded && (
        <div className=" mt-2 mb-2">
          <SpaceCategories spaceId={space.id} />
        </div>
      )}
    </>
  );
}
