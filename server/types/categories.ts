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

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
  spaceId: string;
  categoryId?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};
