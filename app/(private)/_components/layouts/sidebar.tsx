"use client";

import {
  BarChart3,
  Bitcoin,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Clock,
  FolderOpen,
  Inbox,
  LayoutGrid,
  Menu,
  Settings,
  ShoppingCart,
  Store,
  Users,
  LogOut,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
}

export function Sidebar({ className }: SidebarProps) {
  const [isDashboardsExpanded, setIsDashboardsExpanded] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const router = useRouter();

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
        </div>
      </div>
    </div>
  );
}
