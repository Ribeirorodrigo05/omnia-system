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
import { addSpaceMember } from "@/server/services/space/add-space-member";

interface SpaceMemberModalProps {
  open: boolean;
  onClose: () => void;
  spaceId: string;
  spaceName: string;
  onMemberAdded?: (member: { id: string; name: string; email: string }) => void;
}

export function SpaceMemberModal({
  open,
  onClose,
  spaceId,
  spaceName,
  onMemberAdded
}: SpaceMemberModalProps) {
  const [email, setEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsAdding(true);

    try {
      const result = await addSpaceMember({
        spaceId,
        email
      });

      if (result.success && result.member) {
        setSuccess(`${result.member.name} has been added to the space!`);
        setEmail("");

        if (onMemberAdded) {
          onMemberAdded(result.member);
        }

        // Auto close after 2 seconds on success
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(result.error || "Failed to add member");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    if (!isAdding) {
      setEmail("");
      setError(null);
      setSuccess(null);
      onClose();
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Member to Space</DialogTitle>
          <DialogDescription>
            Invite a user to join "{spaceName}" by entering their email address.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddMember} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member-email">Email Address</Label>
            <Input
              id="member-email"
              type="email"
              placeholder="Enter user's email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isAdding}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              The user must already have an account in the system.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-md bg-green-50 border border-green-200">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isAdding || !email.trim() || !isValidEmail(email)}
            >
              {isAdding ? "Adding..." : "Add Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}