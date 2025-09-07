"use client";

import { Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddSpaceFormProps {
  isAddingSpace: boolean;
  spaceName: string;
  isCreating: boolean;
  validationError: string | null;
  createError: string | null;
  onStartAdd: () => void;
  onCancel: () => void;
  onCreate: () => void;
  onSpaceNameChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function AddSpaceForm({
  isAddingSpace,
  spaceName,
  isCreating,
  validationError,
  createError,
  onStartAdd,
  onCancel,
  onCreate,
  onSpaceNameChange,
  onKeyDown,
}: AddSpaceFormProps) {
  if (isAddingSpace) {
    return (
      <div className="space-y-2 border-t pt-2">
        <div className="flex gap-1">
          <Input
            placeholder="Space name"
            value={spaceName}
            onChange={(e) => onSpaceNameChange(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={isCreating}
            className="text-xs"
            data-testid="space-name-input"
            autoFocus
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={onCreate}
            disabled={isCreating || !spaceName.trim()}
            data-testid="confirm-space-button"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
            disabled={isCreating}
            data-testid="cancel-space-button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {(validationError || createError) && (
          <p
            className="text-xs text-destructive px-2"
            data-testid="space-error-message"
          >
            {validationError || createError}
          </p>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full"
      onClick={onStartAdd}
      data-testid="add-space-button"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Space
    </Button>
  );
}
