"use client";

import {
  Calendar,
  ChevronRight,
  Edit,
  Folder,
  FolderOpen,
  List,
  MoreHorizontal,
  Plus,
  Trash2,
  UserPlus,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavProjects({
  projects,
  onCreateSpace,
  onRenameSpace,
  onDeleteSpace,
  onAddMember,
  onCreateList,
  onCreateSprint,
}: {
  projects: Array<{
    id: string;
    name: string;
    url: string;
    categories?: Array<{
      id: string;
      name: string;
      type: "LIST" | "SPRINT" | "FOLDER";
      url: string;
    }>;
  }>;
  onCreateSpace?: () => void;
  onRenameSpace?: (spaceId: string, spaceName: string) => void;
  onDeleteSpace?: (spaceId: string, spaceName: string) => void;
  onAddMember?: (spaceId: string, spaceName: string) => void;
  onCreateList?: (spaceId: string) => void;
  onCreateSprint?: (spaceId: string) => void;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Spaces</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <Collapsible key={item.id} defaultOpen>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <Folder />
                    <span>{item.name}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </a>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  {/* Renomear */}
                  <DropdownMenuItem
                    onClick={() => onRenameSpace?.(item.id, item.name)}
                  >
                    <Edit className="text-muted-foreground" />
                    <span>Rename Space</span>
                  </DropdownMenuItem>

                  {/* Criar (submenu) */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Plus className="text-muted-foreground" />
                      <span>Create</span>
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => onCreateList?.(item.id)}>
                        <List className="text-muted-foreground" />
                        <span>List</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onCreateSprint?.(item.id)}
                      >
                        <Calendar className="text-muted-foreground" />
                        <span>Sprint</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  {/* Inserir membro */}
                  <DropdownMenuItem
                    onClick={() => onAddMember?.(item.id, item.name)}
                  >
                    <UserPlus className="text-muted-foreground" />
                    <span>Add Member</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Deletar */}
                  <DropdownMenuItem
                    onClick={() => onDeleteSpace?.(item.id, item.name)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="text-red-600" />
                    <span>Delete Space</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.categories?.map((category) => (
                    <SidebarMenuSubItem key={category.id}>
                      <SidebarMenuSubButton asChild>
                        <a href={category.url}>
                          {category.type === "LIST" && (
                            <List className="h-4 w-4" />
                          )}
                          {category.type === "SPRINT" && (
                            <Calendar className="h-4 w-4" />
                          )}
                          {category.type === "FOLDER" && (
                            <FolderOpen className="h-4 w-4" />
                          )}
                          <span>{category.name}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
        {onCreateSpace && (
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-sidebar-foreground/70"
              onClick={onCreateSpace}
            >
              <Plus className="text-sidebar-foreground/70" />
              <span>Create Space</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
