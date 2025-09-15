"use client";

import { useCallback, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SpaceCreationModal } from "@/components/space-creation-modal";
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
import type { WorkspaceSpace } from "@/server/services/space/get-workspace-spaces";
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

  return (
    <>
      <WorkspaceCreationModal
        open={showWorkspaceModal}
        onWorkspaceCreated={handleWorkspaceCreated}
      />
      {currentWorkspace && (
        <SpaceCreationModal
          open={showSpaceModal}
          onClose={() => setShowSpaceModal(false)}
          workspaceId={currentWorkspace.id}
          onSpaceCreated={handleSpaceCreated}
        />
      )}
      <div className="flex min-h-screen">
        <SidebarProvider>
          <AppSidebar
            workspace={currentWorkspace}
            workspaces={workspaces}
            spaces={spaces}
            onCreateSpace={handleCreateSpace}
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
                      <BreadcrumbLink href="#">
                        Building Your Application
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
              </div>
              <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
            </div>
          </SidebarInset>
        </SidebarProvider>
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
