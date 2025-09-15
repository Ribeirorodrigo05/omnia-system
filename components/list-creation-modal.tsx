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
import { createList } from "@/server/services/list/create-list";

interface ListCreationModalProps {
  open: boolean;
  onClose: () => void;
  spaceId: string;
  onListCreated?: (list: { id: string; name: string; type: string }) => void;
}

export function ListCreationModal({
  open,
  onClose,
  spaceId,
  onListCreated
}: ListCreationModalProps) {
  const [listName, setListName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsCreating(true);

    try {
      const result = await createList({
        name: listName,
        spaceId
      });

      if (result.success && result.list) {
        if (onListCreated) {
          onListCreated(result.list);
        }
        setListName("");
        onClose();
      } else {
        setError(result.error || "Failed to create list");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setListName("");
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
          <DialogDescription>
            Create a new list category to organize your tasks within this space.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateList} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="list-name">List Name</Label>
            <Input
              id="list-name"
              type="text"
              placeholder="Enter list name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              required
              disabled={isCreating}
              minLength={1}
              maxLength={255}
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
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !listName.trim()}
            >
              {isCreating ? "Creating..." : "Create List"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}