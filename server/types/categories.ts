export type CategoryType = "LIST" | "SPRINT" | "FOLDER";

export interface CreateCategoryRequest {
  name: string;
  type: CategoryType;
  spaceId: string;
  categoryId?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  type?: CategoryType;
  categoryId?: string;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  spaceId: string;
  categoryId?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
