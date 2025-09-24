"use client";

import { useCallback, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ListCreationModal } from "@/components/list-creation-modal";
import { SpaceCreationModal } from "@/components/space-creation-modal";
import { SpaceMemberModal } from "@/components/space-member-modal";
import { SpaceRenameModal } from "@/components/space-rename-modal";
import { SprintCreationModal } from "@/components/sprint-creation-modal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { WorkspaceCreationModal } from "@/components/workspace-creation-modal";
import { deleteSpace } from "@/server/services/space/delete-space";
import {
  getWorkspaceSpaces,
  type WorkspaceSpace,
} from "@/server/services/space/get-workspace-spaces";
import type { UserWorkspace } from "@/server/services/workspace/get-user-workspace";

interface PrivateLayoutWrapperProps {
  children: React.ReactNode;
  initialWorkspace: UserWorkspace | null;
  initialWorkspaces: UserWorkspace[];
  initialSpaces: WorkspaceSpace[];
}

export function PrivateLayoutWrapper({
  children,
  initialWorkspace,
  initialWorkspaces,
  initialSpaces,
}: PrivateLayoutWrapperProps) {
  const [currentWorkspace, setCurrentWorkspace] = useState(initialWorkspace);
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [spaces, setSpaces] = useState(initialSpaces);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(
    !initialWorkspace,
  );
  const [showSpaceModal, setShowSpaceModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleWorkspaceCreated = useCallback((newWorkspace: UserWorkspace) => {
    setCurrentWorkspace(newWorkspace);
    setWorkspaces((prev) => [...prev, newWorkspace]);
    setShowWorkspaceModal(false);
  }, []);

  const handleCreateSpace = useCallback(() => {
    if (currentWorkspace) {
      setShowSpaceModal(true);
    }
  }, [currentWorkspace]);

  const handleSpaceCreated = useCallback((newSpace: WorkspaceSpace) => {
    setSpaces((prev) => [...prev, newSpace]);
    setShowSpaceModal(false);
  }, []);

  const handleRenameSpace = useCallback(
    (spaceId: string, spaceName: string) => {
      setSelectedSpace({ id: spaceId, name: spaceName });
      setShowRenameModal(true);
    },
    [],
  );

  const handleSpaceRenamed = useCallback(
    (updatedSpace: { id: string; name: string }) => {
      setSpaces((prev) =>
        prev.map((space) =>
          space.id === updatedSpace.id
            ? { ...space, name: updatedSpace.name }
            : space,
        ),
      );
      setShowRenameModal(false);
      setSelectedSpace(null);
    },
    [],
  );

  const handleDeleteSpace = useCallback(
    async (spaceId: string, spaceName: string) => {
      if (
        confirm(
          `Are you sure you want to delete "${spaceName}"? This action cannot be undone.`,
        )
      ) {
        const result = await deleteSpace({ spaceId });
        if (result.success) {
          setSpaces((prev) => prev.filter((space) => space.id !== spaceId));
        } else {
          alert(result.error || "Failed to delete space");
        }
      }
    },
    [],
  );

  const handleAddMember = useCallback((spaceId: string, spaceName: string) => {
    setSelectedSpace({ id: spaceId, name: spaceName });
    setShowMemberModal(true);
  }, []);

  const handleMemberAdded = useCallback(() => {
    setShowMemberModal(false);
    setSelectedSpace(null);
  }, []);

  const handleCreateList = useCallback((spaceId: string) => {
    setSelectedSpace({ id: spaceId, name: "" });
    setShowListModal(true);
  }, []);

  const handleListCreated = useCallback(async () => {
    setShowListModal(false);
    setSelectedSpace(null);

    // Refresh spaces to include the new category
    if (currentWorkspace) {
      const updatedSpaces = await getWorkspaceSpaces(currentWorkspace.id);
      setSpaces(updatedSpaces);
    }
  }, [currentWorkspace]);

  const handleCreateSprint = useCallback((spaceId: string) => {
    setSelectedSpace({ id: spaceId, name: "" });
    setShowSprintModal(true);
  }, []);

  const handleSprintCreated = useCallback(async () => {
    setShowSprintModal(false);
    setSelectedSpace(null);

    // Refresh spaces to include the new category
    if (currentWorkspace) {
      const updatedSpaces = await getWorkspaceSpaces(currentWorkspace.id);
      setSpaces(updatedSpaces);
    }
  }, [currentWorkspace]);

  const handleRenameCategory = useCallback(
    (categoryId: string, categoryName: string) => {
      console.log("Renaming category:", categoryId, categoryName);
    },
    [],
  );

  const handleDeleteCategory = useCallback(
    (categoryId: string, categoryName: string) => {
      console.log("Deleting category:", categoryId, categoryName);
    },
    [],
  );

  const handleCreateSubcategory = useCallback(
    (parentCategoryId: string, type: "LIST" | "SPRINT") => {
      console.log("Creating subcategory:", parentCategoryId, type);
    },
    [],
  );

  return (
    <>
      <WorkspaceCreationModal
        open={showWorkspaceModal}
        onWorkspaceCreated={handleWorkspaceCreated}
      />

      {currentWorkspace && (
        <>
          <SpaceCreationModal
            open={showSpaceModal}
            onClose={() => setShowSpaceModal(false)}
            workspaceId={currentWorkspace.id}
            onSpaceCreated={handleSpaceCreated}
          />

          {selectedSpace && (
            <>
              <SpaceRenameModal
                open={showRenameModal}
                onClose={() => setShowRenameModal(false)}
                space={selectedSpace}
                onSpaceRenamed={handleSpaceRenamed}
              />

              <SpaceMemberModal
                open={showMemberModal}
                onClose={() => setShowMemberModal(false)}
                spaceId={selectedSpace.id}
                spaceName={selectedSpace.name}
                onMemberAdded={handleMemberAdded}
              />

              <ListCreationModal
                open={showListModal}
                onClose={() => setShowListModal(false)}
                spaceId={selectedSpace.id}
                onListCreated={handleListCreated}
              />

              <SprintCreationModal
                open={showSprintModal}
                onClose={() => setShowSprintModal(false)}
                spaceId={selectedSpace.id}
                onSprintCreated={handleSprintCreated}
              />
            </>
          )}
        </>
      )}

      <div className="flex min-h-screen">
        <SidebarProvider>
          <AppSidebar
            workspace={currentWorkspace}
            workspaces={workspaces}
            spaces={spaces}
            onCreateSpace={handleCreateSpace}
            onRenameSpace={handleRenameSpace}
            onDeleteSpace={handleDeleteSpace}
            onAddMember={handleAddMember}
            onCreateList={handleCreateList}
            onCreateSprint={handleCreateSprint}
            onRenameCategory={handleRenameCategory}
            onDeleteCategory={handleDeleteCategory}
            onCreateSubcategory={handleCreateSubcategory}
          />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/dashboard">
                        Dashboard
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Workspace</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <main className="flex-1 p-4">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  );
}
