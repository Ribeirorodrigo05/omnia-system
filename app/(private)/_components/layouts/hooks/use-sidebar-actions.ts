import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CreateCategoryDialogState, MenuItem } from "../types";

export function useSidebarActions() {
  const [isDashboardsExpanded, setIsDashboardsExpanded] = useState(true);
  const [isSpacesExpanded, setIsSpacesExpanded] = useState(true);
  const [createCategoryDialog, setCreateCategoryDialog] =
    useState<CreateCategoryDialogState>({
      isOpen: false,
      spaceId: "",
      categoryType: "FOLDER",
    });

  const router = useRouter();

  const handleOpenCategoryDialog = (
    spaceId: string,
    categoryType: "FOLDER" | "LIST" | "SPRINT",
  ) => {
    setCreateCategoryDialog({
      isOpen: true,
      spaceId,
      categoryType,
    });
  };

  const handleCloseCategoryDialog = () => {
    setCreateCategoryDialog((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const handleCategoryCreated = () => {
    // Categories will be refetched by SpaceCategories component
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const menuItems: MenuItem[] = [];

  return {
    isDashboardsExpanded,
    isSpacesExpanded,
    createCategoryDialog,
    menuItems,
    setIsDashboardsExpanded,
    setIsSpacesExpanded,
    handleOpenCategoryDialog,
    handleCloseCategoryDialog,
    handleCategoryCreated,
    handleLogout,
  };
}
