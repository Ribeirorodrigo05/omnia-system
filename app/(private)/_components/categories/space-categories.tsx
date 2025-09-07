"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Folder,
  List,
  Zap,
  Edit2,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  Trash2,
} from "lucide-react";
import {
  useCategories,
  useSubcategories,
  useRenameCategory,
  useDeleteCategory,
} from "../../_hooks/use-categories";
import { CreateCategoryDialog } from "../dialogs/create-category-dialog";
import type { Category, CategoryType } from "@/server/types/categories";

interface CategoryItemProps {
  category: Category;
  onCategoryUpdated: () => void;
  level?: number;
}

function CategoryItem({
  category,
  onCategoryUpdated,
  level = 0,
}: CategoryItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(category.name);
  const [isExpanded, setIsExpanded] = useState(false);
  const { renameCategory, isLoading: isRenamingLoading } = useRenameCategory();
  const { deleteCategory, isLoading: isDeletingLoading } = useDeleteCategory();
  const { subcategories, refetch: refetchSubcategories } = useSubcategories(
    category.id,
  );

  const handleRename = async () => {
    if (newName.trim() === category.name || !newName.trim()) {
      setIsRenaming(false);
      setNewName(category.name);
      return;
    }

    const result = await renameCategory(category.id, newName.trim());
    if (result.success) {
      setIsRenaming(false);
      onCategoryUpdated();
    } else {
      setNewName(category.name);
    }
  };

  const handleDelete = async () => {
    const result = await deleteCategory(category.id, category.spaceId);
    if (result.success) {
      onCategoryUpdated();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRename();
    } else if (e.key === "Escape") {
      setIsRenaming(false);
      setNewName(category.name);
    }
  };

  const getCategoryIcon = () => {
    switch (category.type) {
      case "FOLDER":
        return <Folder className="h-4 w-4" />;
      case "LIST":
        return <List className="h-4 w-4" />;
      case "SPRINT":
        return <Zap className="h-4 w-4" />;
      default:
        return <Folder className="h-4 w-4" />;
    }
  };

  if (isRenaming) {
    return (
      <div className="flex items-center gap-2 px-2 py-1">
        {getCategoryIcon()}
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleRename}
          className="h-6 text-sm"
          maxLength={50}
          autoFocus
          data-testid="category-rename-input"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRename}
          disabled={isRenamingLoading}
          className="h-6 w-6 p-0"
        >
          <Check className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setIsRenaming(false);
            setNewName(category.name);
          }}
          className="h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div
        className="group flex items-center gap-2 px-2 py-1 hover:bg-accent rounded-md"
        style={{ paddingLeft: `${8 + level * 4}px` }}
      >
        {subcategories.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-4 w-4 p-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}
        {getCategoryIcon()}
        <span className="flex-1 text-sm">{category.name}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setIsRenaming(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Renomear
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDeletingLoading}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeletingLoading ? "Deletando..." : "Deletar"}
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Criar</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <CreateCategoryMenuItem
                  spaceId={category.spaceId}
                  categoryId={category.id}
                  type="LIST"
                  icon={<List className="h-4 w-4 mr-2" />}
                  label="Lista"
                  onCategoryCreated={() => {
                    onCategoryUpdated();
                    refetchSubcategories();
                  }}
                />
                <CreateCategoryMenuItem
                  spaceId={category.spaceId}
                  categoryId={category.id}
                  type="SPRINT"
                  icon={<Zap className="h-4 w-4 mr-2" />}
                  label="Sprint"
                  onCategoryCreated={() => {
                    onCategoryUpdated();
                    refetchSubcategories();
                  }}
                />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isExpanded && subcategories.length > 0 && (
        <div className="space-y-1">
          {subcategories.map((subcategory) => (
            <CategoryItem
              key={subcategory.id}
              category={subcategory}
              onCategoryUpdated={() => {
                onCategoryUpdated();
                refetchSubcategories();
              }}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </>
  );
}

interface CreateCategoryMenuItemProps {
  spaceId: string;
  categoryId?: string;
  type: CategoryType;
  icon: React.ReactNode;
  label: string;
  onCategoryCreated: () => void;
}

function CreateCategoryMenuItem({
  spaceId,
  categoryId,
  type,
  icon,
  label,
  onCategoryCreated,
}: CreateCategoryMenuItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  return (
    <>
      <DropdownMenuItem onSelect={handleClick}>
        {icon}
        {label}
      </DropdownMenuItem>
      <CreateCategoryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        spaceId={spaceId}
        categoryType={type}
        categoryId={categoryId}
        onCategoryCreated={() => {
          onCategoryCreated();
          setIsDialogOpen(false);
        }}
      />
    </>
  );
}

interface SpaceCategoriesProps {
  spaceId: string;
}

export function SpaceCategories({ spaceId }: SpaceCategoriesProps) {
  const { categories, isLoading, error, refetch } = useCategories(spaceId);

  if (isLoading) {
    return (
      <div className="px-2 py-1 text-sm text-muted-foreground">
        Carregando...
      </div>
    );
  }

  if (error) {
    return <div className="px-2 py-1 text-sm text-red-500">Erro: {error}</div>;
  }

  if (categories.length === 0) {
    return (
      <div className="px-2 py-1 text-sm text-muted-foreground">
        Nenhuma categoria
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          onCategoryUpdated={refetch}
        />
      ))}
    </div>
  );
}
