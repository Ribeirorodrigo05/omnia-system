"use client";

import { useState } from "react";
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
import { createSpace } from "@/server/services/space/create-space";
import type { WorkspaceSpace } from "@/server/services/space/get-workspace-spaces";

interface SpaceCreationModalProps {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  onSpaceCreated?: (space: WorkspaceSpace) => void;
}

export function SpaceCreationModal({
  open,
  onClose,
  workspaceId,
  onSpaceCreated,
}: SpaceCreationModalProps) {
  const [spaceName, setSpaceName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsCreating(true);

    try {
      const result = await createSpace({
        name: spaceName,
        workspaceId,
      });

      if (result.success && result.space) {
        const newSpace: WorkspaceSpace = {
          id: result.space.id,
          name: result.space.name,
          url: `/spaces/${result.space.id}`,
          role: "owner",
          isOwner: true,
        };

        if (onSpaceCreated) {
          onSpaceCreated(newSpace);
        }

        setSpaceName("");
        onClose();
      } else {
        setError(result.error || "Failed to create space");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setSpaceName("");
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Space</DialogTitle>
          <DialogDescription>
            Create a new space within your workspace. Spaces help organize your
            work and collaborate with team members.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateSpace} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="space-name">Space Name</Label>
            <Input
              id="space-name"
              type="text"
              placeholder="Enter space name"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              required
              disabled={isCreating}
              minLength={1}
              maxLength={255}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !spaceName.trim()}>
              {isCreating ? "Creating..." : "Create Space"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
