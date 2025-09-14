"use client";

import { useState, useCallback } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { WorkspaceCreationModal } from "@/components/workspace-creation-modal";
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
import type { UserWorkspace } from "@/server/services/workspace/get-user-workspace";

interface PrivateLayoutWrapperProps {
  children: React.ReactNode;
  initialWorkspace: UserWorkspace | null;
  initialWorkspaces: UserWorkspace[];
}

export function PrivateLayoutWrapper({
  children,
  initialWorkspace,
  initialWorkspaces,
}: PrivateLayoutWrapperProps) {
  const [currentWorkspace, setCurrentWorkspace] = useState(initialWorkspace);
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [showModal, setShowModal] = useState(!initialWorkspace);

  const handleWorkspaceCreated = useCallback((newWorkspace: UserWorkspace) => {
    setCurrentWorkspace(newWorkspace);
    setWorkspaces((prev) => [...prev, newWorkspace]);
    setShowModal(false);
  }, []);

  return (
    <>
      <WorkspaceCreationModal
        open={showModal}
        onWorkspaceCreated={handleWorkspaceCreated}
      />
      <div className="flex min-h-screen">
        <SidebarProvider>
          <AppSidebar workspace={currentWorkspace} workspaces={workspaces} />
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