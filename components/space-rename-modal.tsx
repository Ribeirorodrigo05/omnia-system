"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSpace } from "@/server/services/space/update-space";

interface SpaceRenameModalProps {
  open: boolean;
  onClose: () => void;
  space: {
    id: string;
    name: string;
  };
  onSpaceRenamed?: (space: { id: string; name: string }) => void;
}

export function SpaceRenameModal({
  open,
  onClose,
  space,
  onSpaceRenamed
}: SpaceRenameModalProps) {
  const [spaceName, setSpaceName] = useState(space.name);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Atualiza o nome quando o space muda
  useEffect(() => {
    setSpaceName(space.name);
    setError(null);
  }, [space.name]);

  const handleRenameSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsUpdating(true);

    try {
      const result = await updateSpace({
        spaceId: space.id,
        name: spaceName
      });

      if (result.success && result.space) {
        if (onSpaceRenamed) {
          onSpaceRenamed(result.space);
        }
        onClose();
      } else {
        setError(result.error || "Failed to rename space");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    if (!isUpdating) {
      setSpaceName(space.name); // Reset to original name
      setError(null);
      onClose();
    }
  };

  const hasChanges = spaceName.trim() !== space.name;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Space</DialogTitle>
          <DialogDescription>
            Change the name of this space. This will update the space name for all members.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleRenameSpace} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="space-name">Space Name</Label>
            <Input
              id="space-name"
              type="text"
              placeholder="Enter new space name"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              required
              disabled={isUpdating}
              minLength={1}
              maxLength={255}
              autoFocus
              autoSelect
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating || !spaceName.trim() || !hasChanges}
            >
              {isUpdating ? "Renaming..." : "Rename Space"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}