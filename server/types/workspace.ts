export type Workspace = {
  id: string;
  name: string;
  role: string;
};

export type UserWorkspace = {
  hasWorkspace: boolean;
  workspace: Workspace | null;
};

export type Space = {
  id: string;
  name: string;
  workspaceId: string;
  createdAt: Date;
};
