"use client";

import { Calendar, FolderOpen, List, Plus } from "lucide-react";
import { useState } from "react";
import { ListCreationModal } from "@/components/list-creation-modal";
import { SprintCreationModal } from "@/components/sprint-creation-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SpaceCategory } from "@/server/services/category/get-space-categories";

interface SpaceCategoriesViewProps {
  spaceId: string;
  spaceName: string;
  categories: SpaceCategory[];
}

export function SpaceCategoriesView({
  spaceId,
  spaceName,
  categories: initialCategories,
}: SpaceCategoriesViewProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [showListModal, setShowListModal] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);

  const handleCategoryCreated = (newCategory: SpaceCategory) => {
    setCategories((prev) => [...prev, newCategory]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "LIST":
        return <List className="h-5 w-5" />;
      case "SPRINT":
        return <Calendar className="h-5 w-5" />;
      case "FOLDER":
        return <FolderOpen className="h-5 w-5" />;
      default:
        return <List className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "LIST":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "SPRINT":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "FOLDER":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const lists = categories.filter((cat) => cat.type === "LIST");
  const sprints = categories.filter((cat) => cat.type === "SPRINT");
  const folders = categories.filter((cat) => cat.type === "FOLDER");

  return (
    <>
      <div className="grid gap-6">
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button onClick={() => setShowListModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create List
          </Button>
          <Button onClick={() => setShowSprintModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Sprint
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Lists Section */}
          {lists.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5 text-blue-600" />
                  Lists ({lists.length})
                </CardTitle>
                <CardDescription>Organize your tasks in lists</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {lists.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => (window.location.href = category.url)}
                  >
                    <div className="flex items-center gap-3">
                      {getIcon(category.type)}
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Badge className={getTypeColor(category.type)}>
                      {category.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Sprints Section */}
          {sprints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Sprints ({sprints.length})
                </CardTitle>
                <CardDescription>Time-boxed development cycles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {sprints.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => (window.location.href = category.url)}
                  >
                    <div className="flex items-center gap-3">
                      {getIcon(category.type)}
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Badge className={getTypeColor(category.type)}>
                      {category.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Folders Section */}
          {folders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-yellow-600" />
                  Folders ({folders.length})
                </CardTitle>
                <CardDescription>
                  Organize categories in folders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {folders.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => (window.location.href = category.url)}
                  >
                    <div className="flex items-center gap-3">
                      {getIcon(category.type)}
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Badge className={getTypeColor(category.type)}>
                      {category.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto max-w-sm">
                <div className="mb-4">
                  <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No categories yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Get started by creating your first list or sprint for this
                  space.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => setShowListModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create List
                  </Button>
                  <Button onClick={() => setShowSprintModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Sprint
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      <ListCreationModal
        open={showListModal}
        onClose={() => setShowListModal(false)}
        spaceId={spaceId}
        onListCreated={(list) => {
          handleCategoryCreated({
            id: list.id,
            name: list.name,
            type: "LIST",
            url: `/spaces/${spaceId}/categories/${list.id}`,
            spaceId,
          });
          setShowListModal(false);
        }}
      />

      <SprintCreationModal
        open={showSprintModal}
        onClose={() => setShowSprintModal(false)}
        spaceId={spaceId}
        onSprintCreated={(sprint) => {
          handleCategoryCreated({
            id: sprint.id,
            name: sprint.name,
            type: "SPRINT",
            url: `/spaces/${spaceId}/categories/${sprint.id}`,
            spaceId,
          });
          setShowSprintModal(false);
        }}
      />
    </>
  );
}
