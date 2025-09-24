"use client";

import {
  MoreHorizontal,
  Plus,
  List,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryDotMenuProps {
  categoryId: string;
  categoryName: string;
  categoryType: "LIST" | "SPRINT" | "FOLDER";
  onRenameCategory?: (categoryId: string, categoryName: string) => void;
  onDeleteCategory?: (categoryId: string, categoryName: string) => void;
  onCreateSubcategory?: (
    parentCategoryId: string,
    type: "LIST" | "SPRINT",
  ) => void;
}

export function CategoryDotMenu({
  categoryId,
  categoryName,
  categoryType,
  onRenameCategory,
  onDeleteCategory,
  onCreateSubcategory,
}: CategoryDotMenuProps) {
  const handleCreateSubcategory = (type: "LIST" | "SPRINT") => {
    if (onCreateSubcategory) {
      onCreateSubcategory(categoryId, type);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={(e) => e.preventDefault()}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open category menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* Criar subcategoria - apenas para LIST e FOLDER */}
        {(categoryType === "LIST" || categoryType === "FOLDER") && (
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Plus className="mr-2 h-4 w-4" />
                Criar
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => handleCreateSubcategory("LIST")}
                >
                  <List className="mr-2 h-4 w-4" />
                  Sub-List
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleCreateSubcategory("SPRINT")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Sprint
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Renomear */}
        <DropdownMenuItem
          onClick={() => onRenameCategory?.(categoryId, categoryName)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Renomear
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Deletar */}
        <DropdownMenuItem
          onClick={() => onDeleteCategory?.(categoryId, categoryName)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4 text-red-600" />
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
