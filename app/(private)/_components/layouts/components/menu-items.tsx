"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MenuItem } from "../types";

interface MenuItemsProps {
  items: MenuItem[];
}

export function MenuItems({ items }: MenuItemsProps) {
  return (
    <div className="space-y-1">
      {items.map((item) => {
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
  );
}
