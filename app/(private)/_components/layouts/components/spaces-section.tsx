"use client";

import { useState } from "react";
import { AddSpaceForm } from "./add-space-form";
import { SpaceItem } from "./space-item";
import { useSpaces } from "../../../_hooks/use-spaces";
import { useCreateSpace } from "../../../_hooks/use-create-space";
import { useRenameSpace } from "../../../_hooks/use-rename-space";
import { createSpaceSchema } from "@/server/validators/space-validation";
import type { Space } from "../types";

interface SpacesSectionProps {
  workspaceId: string;
  onOpenCategoryDialog: (
    spaceId: string,
    categoryType: "FOLDER" | "LIST" | "SPRINT",
  ) => void;
}

export function SpacesSection({
  workspaceId,
  onOpenCategoryDialog,
}: SpacesSectionProps) {
  const [isAddingSpace, setIsAddingSpace] = useState(false);
  const [spaceName, setSpaceName] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [renamingSpaceId, setRenamingSpaceId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [expandedSpaces, setExpandedSpaces] = useState<Set<string>>(new Set());

  const { spaces, loading, refetch } = useSpaces(workspaceId);
  const { createSpace, isCreating, error: createError } = useCreateSpace();
  const { renameSpace, isRenaming, error: renameError } = useRenameSpace();

  const handleCreateSpace = async () => {
    if (!workspaceId || !spaceName.trim()) return;

    setValidationError(null);

    const validation = createSpaceSchema.safeParse({
      name: spaceName,
      workspaceId,
    });

    if (!validation.success) {
      setValidationError(validation.error.errors[0].message);
      return;
    }

    const newSpace = await createSpace(validation.data);

    if (newSpace) {
      setSpaceName("");
      setIsAddingSpace(false);
      setValidationError(null);
      refetch();
    }
  };

  const handleCancelAddSpace = () => {
    setIsAddingSpace(false);
    setSpaceName("");
    setValidationError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateSpace();
    } else if (e.key === "Escape") {
      handleCancelAddSpace();
    }
  };

  const handleStartRename = (space: Space) => {
    setRenamingSpaceId(space.id);
    setRenameValue(space.name);
  };

  const handleRenameSpace = async () => {
    if (!renamingSpaceId || !renameValue.trim()) return;

    setValidationError(null);

    const validation = createSpaceSchema.safeParse({
      name: renameValue,
      workspaceId,
    });

    if (!validation.success) {
      setValidationError(validation.error.errors[0].message);
      return;
    }

    const updatedSpace = await renameSpace(
      renamingSpaceId,
      renameValue,
      workspaceId,
    );

    if (updatedSpace) {
      setRenamingSpaceId(null);
      setRenameValue("");
      setValidationError(null);
      refetch();
    }
  };

  const handleCancelRename = () => {
    setRenamingSpaceId(null);
    setRenameValue("");
    setValidationError(null);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRenameSpace();
    } else if (e.key === "Escape") {
      handleCancelRename();
    }
  };

  const toggleSpaceExpansion = (spaceId: string) => {
    setExpandedSpaces((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(spaceId)) {
        newSet.delete(spaceId);
      } else {
        newSet.add(spaceId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="p-3 text-center text-sm text-muted-foreground">
        Loading spaces...
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {spaces.length > 0 && (
        <div className="space-y-1 mb-2">
          {spaces.map((space) => (
            <div key={space.id} className="group relative">
              <SpaceItem
                space={space}
                workspaceId={workspaceId}
                isExpanded={expandedSpaces.has(space.id)}
                isRenaming={renamingSpaceId === space.id}
                renameValue={renameValue}
                isRenamingLoading={isRenaming}
                onToggleExpansion={toggleSpaceExpansion}
                onStartRename={handleStartRename}
                onRename={handleRenameSpace}
                onCancelRename={handleCancelRename}
                onRenameValueChange={setRenameValue}
                onRenameKeyDown={handleRenameKeyDown}
                onOpenCategoryDialog={onOpenCategoryDialog}
              />
            </div>
          ))}
        </div>
      )}

      {spaces.length === 0 && (
        <div className="p-3 text-center text-sm text-muted-foreground mb-2">
          No spaces found
        </div>
      )}

      <AddSpaceForm
        isAddingSpace={isAddingSpace}
        spaceName={spaceName}
        isCreating={isCreating}
        validationError={validationError}
        createError={createError}
        onStartAdd={() => setIsAddingSpace(true)}
        onCancel={handleCancelAddSpace}
        onCreate={handleCreateSpace}
        onSpaceNameChange={setSpaceName}
        onKeyDown={handleKeyDown}
      />

      {renameError && (
        <p
          className="text-xs text-destructive px-2"
          data-testid="rename-error-message"
        >
          {renameError}
        </p>
      )}
    </div>
  );
}
