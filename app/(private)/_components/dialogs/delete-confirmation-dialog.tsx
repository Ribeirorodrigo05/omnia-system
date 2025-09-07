"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName: string;
  isDeleting?: boolean;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isDeleting = false,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-left">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            {description}
            <br />
            <br />
            <strong className="text-foreground">{itemName}</strong>
            <br />
            <span className="text-destructive font-medium">
              Esta ação não pode ser desfeita.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            variant="destructive"
          >
            {isDeleting ? "Deletando..." : "Deletar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
