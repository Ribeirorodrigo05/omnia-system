"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserProfile() {
  return (
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
  );
}
