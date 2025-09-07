"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpandableSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function ExpandableSection({
  title,
  isExpanded,
  onToggle,
  children,
}: ExpandableSectionProps) {
  return (
    <>
      <div className="mb-4">
        <Button
          variant="ghost"
          className="w-full justify-between p-2 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:bg-accent"
          onClick={onToggle}
        >
          <span>{title}</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded && children}
    </>
  );
}
