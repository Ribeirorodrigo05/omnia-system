"use client";

import { cn } from "@/lib/utils";
import { CreateCategoryDialog } from "../dialogs/create-category-dialog";
import {
  ExpandableSection,
  MenuItems,
  SidebarHeader,
  SpacesSection,
  UserProfile,
} from "./components";
import { useSidebarActions } from "./hooks";
import type { SidebarProps } from "./types";

export function Sidebar({ className, workspaceId }: SidebarProps) {
  const {
    isDashboardsExpanded,
    isSpacesExpanded,
    createCategoryDialog,
    menuItems,
    setIsDashboardsExpanded,
    setIsSpacesExpanded,
    handleOpenCategoryDialog,
    handleCloseCategoryDialog,
    handleCategoryCreated,
    handleLogout,
  } = useSidebarActions();

  return (
    <div
      className={cn(
        "flex h-screen w-64 flex-col border-r bg-background",
        className,
      )}
    >
      <SidebarHeader onLogout={handleLogout} />

      <UserProfile />

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <ExpandableSection
            title="Menu options"
            isExpanded={isDashboardsExpanded}
            onToggle={() => setIsDashboardsExpanded(!isDashboardsExpanded)}
          >
            <MenuItems items={menuItems} />
          </ExpandableSection>

          {workspaceId && (
            <div className="mt-6">
              <ExpandableSection
                title="Spaces"
                isExpanded={isSpacesExpanded}
                onToggle={() => setIsSpacesExpanded(!isSpacesExpanded)}
              >
                <SpacesSection
                  workspaceId={workspaceId}
                  onOpenCategoryDialog={handleOpenCategoryDialog}
                />
              </ExpandableSection>
            </div>
          )}
        </div>
      </div>

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
