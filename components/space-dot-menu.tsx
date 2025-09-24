"use client";

import { useState } from "react";
import { MoreHorizontal, Plus, List, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { ListCreationModal } from "@/components/list-creation-modal";

interface SpaceDotMenuProps {
  spaceId: string;
  onListCreated?: (list: { id: string; name: string; type: string }) => void;
}

export function SpaceDotMenu({ spaceId, onListCreated }: SpaceDotMenuProps) {
  const [showListModal, setShowListModal] = useState(false);

  const handleListCreated = (list: { id: string; name: string; type: string }) => {
    if (onListCreated) {
      onListCreated(list);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open space menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Plus className="mr-2 h-4 w-4" />
              Criar
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setShowListModal(true)}>
                <List className="mr-2 h-4 w-4" />
                List
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Calendar className="mr-2 h-4 w-4" />
                Sprint
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            Renomear
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ListCreationModal
        open={showListModal}
        onClose={() => setShowListModal(false)}
        spaceId={spaceId}
        onListCreated={handleListCreated}
      />
    </>
  );
}