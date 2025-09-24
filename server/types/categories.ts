export type CategoryType = "LIST" | "SPRINT" | "FOLDER";

export type CreateCategoryRequest = {
  name: string;
  type: CategoryType;
  spaceId: string;
  categoryId?: string;
};

export type UpdateCategoryRequest = {
  name?: string;
  type?: CategoryType;
  categoryId?: string;
};

export type CategoryData = {
  name: string;
  type: CategoryType;
  spaceId: string;
  ownerId: string;
  categoryId?: string;
};

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
  spaceId: string;
  categoryId: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type CreateListInput = {
  name: string;
  spaceId: string;
};

export type CreateListResult = {
  success: boolean;
  list?: {
    id: string;
    name: string;
    type: string;
  };
  error?: string;
};
