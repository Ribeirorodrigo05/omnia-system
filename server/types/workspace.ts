export interface Workspace {
  id: string;
  name: string;
  role: string;
}

export interface UserWorkspace {
  hasWorkspace: boolean;
  workspace: Workspace | null;
}

export interface Space {
  id: string;
  name: string;
  workspaceId: string;
  createdAt: Date;
}
