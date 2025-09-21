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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSprint } from "@/server/services/sprint/create-sprint";

interface SprintCreationModalProps {
  open: boolean;
  onClose: () => void;
  spaceId: string;
  onSprintCreated?: (sprint: {
    id: string;
    name: string;
    type: string;
    metadata?: {
      startDate: Date;
      endDate: Date;
      duration: string;
      status: string;
    };
  }) => void;
}

export function SprintCreationModal({
  open,
  onClose,
  spaceId,
  onSprintCreated,
}: SprintCreationModalProps) {
  const [sprintName, setSprintName] = useState("");
  const [duration, setDuration] = useState<"weekly" | "biweekly">("weekly");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calcula as datas para preview
  const getPreviewDates = () => {
    const now = new Date();
    const nextMonday = getNextMonday(now);
    const endDate = getEndSunday(nextMonday, duration);
    return { start: nextMonday, end: endDate };
  };

  const handleCreateSprint = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsCreating(true);

    try {
      const result = await createSprint({
        name: sprintName,
        spaceId,
        duration,
      });

      if (result.success && result.sprint) {
        if (onSprintCreated) {
          onSprintCreated(result.sprint);
        }
        setSprintName("");
        setDuration("weekly");
        onClose();
      } else {
        setError(result.error || "Failed to create sprint");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setSprintName("");
      setDuration("weekly");
      setError(null);
      onClose();
    }
  };

  const previewDates = getPreviewDates();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Sprint</DialogTitle>
          <DialogDescription>
            Create a new sprint that automatically starts on Monday and ends on
            Sunday.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateSprint} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sprint-name">Sprint Name</Label>
            <Input
              id="sprint-name"
              type="text"
              placeholder="Enter sprint name"
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
              required
              disabled={isCreating}
              minLength={1}
              maxLength={255}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sprint-duration">Duration</Label>
            <Select
              value={duration}
              onValueChange={(value: "weekly" | "biweekly") =>
                setDuration(value)
              }
              disabled={isCreating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly (7 days)</SelectItem>
                <SelectItem value="biweekly">Biweekly (14 days)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border p-3 bg-muted/50">
            <div className="text-sm font-medium mb-2">
              Sprint Timeline Preview:
            </div>
            <div className="text-sm text-muted-foreground">
              <div>
                Start:{" "}
                {previewDates.start.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div>
                End:{" "}
                {previewDates.end.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="mt-1 text-xs">
                Duration: {duration === "weekly" ? "7" : "14"} days
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !sprintName.trim()}>
              {isCreating ? "Creating..." : "Create Sprint"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Funções auxiliares (mesmas do service)
function getNextMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + daysUntilMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getEndSunday(startDate: Date, duration: "weekly" | "biweekly"): Date {
  const endDate = new Date(startDate);
  const daysToAdd = duration === "weekly" ? 6 : 13;
  endDate.setDate(endDate.getDate() + daysToAdd);
  endDate.setHours(23, 59, 59, 999);
  return endDate;
}
