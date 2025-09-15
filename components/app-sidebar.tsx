"use client";

import { GalleryVerticalEnd, Settings2, SquareTerminal } from "lucide-react";
import type * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { UserWorkspace } from "@/server/services/workspace/get-user-workspace";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  workspace?: UserWorkspace | null;
  workspaces?: UserWorkspace[];
  spaces?: Array<{
    id: string;
    name: string;
    url: string;
  }>;
  onCreateSpace?: () => void;
}

export function AppSidebar({
  workspace = null,
  workspaces = [],
  spaces = [],
  onCreateSpace,
  ...props
}: AppSidebarProps) {
  const teams = workspace
    ? [
        {
          name: workspace.name,
          logo: GalleryVerticalEnd,
          plan: workspace.isOwner ? "Owner" : workspace.role,
        },
      ]
    : [];

  const allTeams = workspaces.map((w) => ({
    name: w.name,
    logo: GalleryVerticalEnd,
    plan: w.isOwner ? "Owner" : w.role,
  }));

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={allTeams.length > 0 ? allTeams : teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={spaces} onCreateSpace={onCreateSpace} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
