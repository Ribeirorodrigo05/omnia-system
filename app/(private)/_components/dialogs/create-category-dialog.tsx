"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCategory } from "../../_hooks/use-categories";
import type { CategoryType } from "@/server/types/categories";

interface CreateCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  spaceId: string;
  categoryType: CategoryType;
  categoryId?: string;
  onCategoryCreated: () => void;
}

export function CreateCategoryDialog({
  isOpen,
  onClose,
  spaceId,
  categoryType,
  categoryId,
  onCategoryCreated,
}: CreateCategoryDialogProps) {
  const [categoryName, setCategoryName] = useState("");
  const { createCategory, isLoading, error } = useCreateCategory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) return;

    const result = await createCategory(
      categoryName.trim(),
      categoryType,
      spaceId,
      categoryId,
    );

    if (result.success) {
      setCategoryName("");
      onCategoryCreated();
      onClose();
    }
  };

  const handleClose = () => {
    setCategoryName("");
    onClose();
  };

  const getDialogTitle = () => {
    switch (categoryType) {
      case "FOLDER":
        return "Criar Pasta";
      case "LIST":
        return "Criar Lista";
      case "SPRINT":
        return "Criar Sprint";
      default:
        return "Criar Categoria";
    }
  };

  const getPlaceholder = () => {
    switch (categoryType) {
      case "FOLDER":
        return "Nome da pasta";
      case "LIST":
        return "Nome da lista";
      case "SPRINT":
        return "Nome do sprint";
      default:
        return "Nome da categoria";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            Digite o nome para a nova {categoryType.toLowerCase()}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder={getPlaceholder()}
                className="col-span-3"
                maxLength={50}
                data-testid="category-name-input"
              />
            </div>
            {error && (
              <div className="text-sm text-red-500 col-span-4 text-center">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !categoryName.trim()}
              data-testid="create-category-button"
            >
              {isLoading ? "Criando..." : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
