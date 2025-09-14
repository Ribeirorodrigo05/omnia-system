"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createWorkspace } from "@/server/services/workspace/create-workspace";
import type { UserWorkspace } from "@/server/services/workspace/get-user-workspace";

interface WorkspaceCreationModalProps {
  open: boolean;
  onWorkspaceCreated?: (workspace: UserWorkspace) => void;
}

export function WorkspaceCreationModal({
  open,
  onWorkspaceCreated
}: WorkspaceCreationModalProps) {
  const [workspaceName, setWorkspaceName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsCreating(true);

    try {
      const result = await createWorkspace({ name: workspaceName });

      if (result.success && result.workspace) {
        const newWorkspace: UserWorkspace = {
          id: result.workspace.id,
          name: result.workspace.name,
          role: "owner",
          isOwner: true,
        };

        if (onWorkspaceCreated) {
          onWorkspaceCreated(newWorkspace);
        }
      } else {
        setError(result.error || "Failed to create workspace");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} modal>
      <DialogContent
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        hideCloseButton
      >
        <DialogHeader>
          <DialogTitle>Create Your Workspace</DialogTitle>
          <DialogDescription>
            You need to create a workspace to get started. This will be your main working environment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateWorkspace} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspace-name">Workspace Name</Label>
            <Input
              id="workspace-name"
              type="text"
              placeholder="Enter workspace name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              required
              disabled={isCreating}
              minLength={1}
              maxLength={255}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isCreating || !workspaceName.trim()}
          >
            {isCreating ? "Creating..." : "Create Workspace"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}