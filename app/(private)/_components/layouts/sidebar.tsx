"use client";

import {
  ChevronDown,
  ChevronUp,
  Menu,
  Settings,
  LogOut,
  Layers,
  Plus,
  Check,
  X,
  MoreHorizontal,
  Edit,
  FolderPlus,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useSpaces } from "../../_hooks/use-spaces";
import { useCreateSpace } from "../../_hooks/use-create-space";
import { useRenameSpace } from "../../_hooks/use-rename-space";
import { createSpaceSchema } from "@/server/validators/space-validation";
import { CreateCategoryDialog } from "../dialogs/create-category-dialog";
import { SpaceCategories } from "../categories/space-categories";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  href?: string;
  action?: () => void;
}

interface SidebarProps {
  className?: string;
  workspaceId?: string;
}

export function Sidebar({ className, workspaceId }: SidebarProps) {
  const [isDashboardsExpanded, setIsDashboardsExpanded] = useState(true);
  const [isSpacesExpanded, setIsSpacesExpanded] = useState(true);
  const [isAddingSpace, setIsAddingSpace] = useState(false);
  const [spaceName, setSpaceName] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [renamingSpaceId, setRenamingSpaceId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [expandedSpaces, setExpandedSpaces] = useState<Set<string>>(new Set());
  const [createCategoryDialog, setCreateCategoryDialog] = useState<{
    isOpen: boolean;
    spaceId: string;
    categoryType: "FOLDER" | "LIST" | "SPRINT";
  }>({
    isOpen: false,
    spaceId: "",
    categoryType: "FOLDER",
  });

  const router = useRouter();
  const { spaces, loading, refetch } = useSpaces(workspaceId || null);
  const { createSpace, isCreating, error: createError } = useCreateSpace();
  const { renameSpace, isRenaming, error: renameError } = useRenameSpace();

  const handleCreateSpace = async () => {
    if (!workspaceId || !spaceName.trim()) return;

    setValidationError(null);

    const validation = createSpaceSchema.safeParse({
      name: spaceName,
      workspaceId,
    });

    if (!validation.success) {
      setValidationError(validation.error.errors[0].message);
      return;
    }

    const newSpace = await createSpace(validation.data);

    if (newSpace) {
      setSpaceName("");
      setIsAddingSpace(false);
      setValidationError(null);
      refetch();
    }
  };

  const handleCancelAddSpace = () => {
    setIsAddingSpace(false);
    setSpaceName("");
    setValidationError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateSpace();
    } else if (e.key === "Escape") {
      handleCancelAddSpace();
    }
  };

  const handleStartRename = (space: { id: string; name: string }) => {
    setRenamingSpaceId(space.id);
    setRenameValue(space.name);
  };

  const handleRenameSpace = async () => {
    if (!renamingSpaceId || !renameValue.trim() || !workspaceId) return;

    setValidationError(null);

    const validation = createSpaceSchema.safeParse({
      name: renameValue,
      workspaceId,
    });

    if (!validation.success) {
      setValidationError(validation.error.errors[0].message);
      return;
    }

    const updatedSpace = await renameSpace(
      renamingSpaceId,
      renameValue,
      workspaceId,
    );

    if (updatedSpace) {
      setRenamingSpaceId(null);
      setRenameValue("");
      setValidationError(null);
      refetch();
    }
  };

  const handleCancelRename = () => {
    setRenamingSpaceId(null);
    setRenameValue("");
    setValidationError(null);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRenameSpace();
    } else if (e.key === "Escape") {
      handleCancelRename();
    }
  };

  const toggleSpaceExpansion = (spaceId: string) => {
    setExpandedSpaces((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(spaceId)) {
        newSet.delete(spaceId);
      } else {
        newSet.add(spaceId);
      }
      return newSet;
    });
  };

  const handleOpenCategoryDialog = (
    spaceId: string,
    categoryType: "FOLDER" | "LIST" | "SPRINT",
  ) => {
    setCreateCategoryDialog({
      isOpen: true,
      spaceId,
      categoryType,
    });
  };

  const handleCloseCategoryDialog = () => {
    setCreateCategoryDialog((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const handleCategoryCreated = () => {
    // Forçar re-fetch das categorias será feito pelo componente SpaceCategories
  };

  const handleLogout = async () => {
    try {
      // Call logout API to clear server-side cookie
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Redirect to login page
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const menuItems: MenuItem[] = [
    //   { id: "inbox", label: "Inbox", icon: Inbox, count: 4 },
    //   { id: "drive", label: "Drive Files", icon: FolderOpen, count: 435 },
    //   { id: "boards", label: "Boards", icon: LayoutGrid, count: 5 },
    //   { id: "updates", label: "Updates", icon: Clock },
    //   { id: "analytics", label: "Analytics", icon: BarChart3, count: 2 },
    //   { id: "crm", label: "CRM Dashboard", icon: Users, count: 2 },
    //   { id: "ecommerce", label: "Ecommerce", icon: ShoppingCart },
    //   { id: "crypto", label: "Cryptocurrency", icon: Bitcoin },
    //   { id: "projects", label: "Projects", icon: Briefcase },
    //   { id: "nft", label: "NFT Marketplace", icon: Store },
    //   { id: "settings", label: "Settings", icon: Settings, count: 2 },
  ];

  return (
    <div
      className={cn(
        "flex h-screen w-64 flex-col border-r bg-background",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <h1 className="text-lg font-semibold">Dashboard</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1">
              <Menu className="h-5 w-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* User Profile Section */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
              alt="Nancy Martino"
            />
            <AvatarFallback>NM</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <div className="font-medium">Nancy Martino</div>
            <div className="text-sm text-muted-foreground">Designer</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Dashboards Section */}
          <div className="mb-4">
            <Button
              variant="ghost"
              className="w-full justify-between p-2 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:bg-accent"
              onClick={() => setIsDashboardsExpanded(!isDashboardsExpanded)}
            >
              <span>Menu options</span>
              {isDashboardsExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Menu Items */}
          {isDashboardsExpanded && (
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="group w-full justify-between p-3 text-left hover:bg-accent"
                    onClick={item.action}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.count && (
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        {item.count}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          )}

          {/* Spaces Section */}
          {workspaceId && (
            <>
              <div className="mb-4 mt-6">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-2 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:bg-accent"
                  onClick={() => setIsSpacesExpanded(!isSpacesExpanded)}
                >
                  <span>Spaces</span>
                  {isSpacesExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {isSpacesExpanded && (
                <div className="space-y-1">
                  {loading ? (
                    <div className="p-3 text-center text-sm text-muted-foreground">
                      Loading spaces...
                    </div>
                  ) : (
                    <>
                      {/* Existing Spaces */}
                      {spaces.length > 0 && (
                        <div className="space-y-1 mb-2">
                          {spaces.map((space) => (
                            <div key={space.id} className="group relative">
                              {renamingSpaceId === space.id ? (
                                // Rename Mode
                                <div className="flex gap-1 p-2">
                                  <Input
                                    value={renameValue}
                                    onChange={(e) =>
                                      setRenameValue(e.target.value)
                                    }
                                    onKeyDown={handleRenameKeyDown}
                                    disabled={isRenaming}
                                    className="text-xs"
                                    data-testid={`rename-space-input-${space.id}`}
                                    autoFocus
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleRenameSpace}
                                    disabled={isRenaming || !renameValue.trim()}
                                    data-testid={`confirm-rename-${space.id}`}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleCancelRename}
                                    disabled={isRenaming}
                                    data-testid={`cancel-rename-${space.id}`}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                // Normal Mode
                                <>
                                  <div className="flex items-center group-hover:pr-8">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 mr-1"
                                      onClick={() =>
                                        toggleSpaceExpansion(space.id)
                                      }
                                    >
                                      {expandedSpaces.has(space.id) ? (
                                        <ChevronDown className="h-3 w-3" />
                                      ) : (
                                        <ChevronUp className="h-3 w-3" />
                                      )}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="flex-1 justify-start p-3 text-left hover:bg-accent"
                                      onClick={() =>
                                        router.push(
                                          `/workspace/${workspaceId}/space/${space.id}`,
                                        )
                                      }
                                      data-testid={`space-item-${space.id}`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <Layers className="h-5 w-5 text-primary" />
                                        <span className="font-medium">
                                          {space.name}
                                        </span>
                                      </div>
                                    </Button>

                                    {/* Dot Menu */}
                                    <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            data-testid={`space-menu-${space.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent
                                          align="end"
                                          className="w-48"
                                        >
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleStartRename(space)
                                            }
                                            data-testid={`rename-space-${space.id}`}
                                          >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Renomear
                                          </DropdownMenuItem>

                                          <DropdownMenuSub>
                                            <DropdownMenuSubTrigger
                                              data-testid={`create-menu-${space.id}`}
                                            >
                                              <Plus className="mr-2 h-4 w-4" />
                                              Criar
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  handleOpenCategoryDialog(
                                                    space.id,
                                                    "FOLDER",
                                                  )
                                                }
                                                data-testid={`create-folder-${space.id}`}
                                              >
                                                <FolderPlus className="mr-2 h-4 w-4" />
                                                Pasta
                                              </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                          </DropdownMenuSub>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>

                                  {/* Categories */}
                                  {expandedSpaces.has(space.id) && (
                                    <div className="ml-8 mt-2 mb-2">
                                      <SpaceCategories spaceId={space.id} />
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* No spaces message */}
                      {spaces.length === 0 && (
                        <div className="p-3 text-center text-sm text-muted-foreground mb-2">
                          No spaces found
                        </div>
                      )}

                      {/* Add Space Form */}
                      {isAddingSpace ? (
                        <div className="space-y-2 border-t pt-2">
                          <div className="flex gap-1">
                            <Input
                              placeholder="Space name"
                              value={spaceName}
                              onChange={(e) => setSpaceName(e.target.value)}
                              onKeyDown={handleKeyDown}
                              disabled={isCreating}
                              className="text-xs"
                              data-testid="space-name-input"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCreateSpace}
                              disabled={isCreating || !spaceName.trim()}
                              data-testid="confirm-space-button"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCancelAddSpace}
                              disabled={isCreating}
                              data-testid="cancel-space-button"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {(validationError || createError) && (
                            <p
                              className="text-xs text-destructive px-2"
                              data-testid="space-error-message"
                            >
                              {validationError || createError}
                            </p>
                          )}
                        </div>
                      ) : (
                        /* Add Space Button */
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setIsAddingSpace(true)}
                          data-testid="add-space-button"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Space
                        </Button>
                      )}

                      {/* Rename Error */}
                      {renameError && (
                        <p
                          className="text-xs text-destructive px-2"
                          data-testid="rename-error-message"
                        >
                          {renameError}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Category Dialog */}
      <CreateCategoryDialog
        isOpen={createCategoryDialog.isOpen}
        onClose={handleCloseCategoryDialog}
        spaceId={createCategoryDialog.spaceId}
        categoryType={createCategoryDialog.categoryType}
        onCategoryCreated={handleCategoryCreated}
      />
    </div>
  );
}
