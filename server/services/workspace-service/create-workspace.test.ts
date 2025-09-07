import { beforeEach, describe, expect, it, vi } from "vitest";
import { createWorkspace } from "@/server/services/workspace-service/create-workspace";

vi.mock("@/server/database", () => ({
  db: {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([
          {
            id: "workspace-id-123",
            name: "Test Workspace",
          },
        ]),
      }),
    }),
  },
}));

describe("createWorkspace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create workspace successfully", async () => {
    const workspaceData = { name: "Valid Workspace Name" };
    const userId = "user-123";

    const result = await createWorkspace(workspaceData, userId);

    expect(result.success).toBe(true);
    expect(result.workspace).toEqual({
      id: "workspace-id-123",
      name: "Test Workspace",
    });
  });

  it("should handle database errors", async () => {
    const { db } = await import("@/server/database");

    vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockRejectedValue(new Error("Database error")),
      }),
    } as any);

    const workspaceData = { name: "Valid Workspace" };
    const userId = "user-123";

    const result = await createWorkspace(workspaceData, userId);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Erro interno do servidor");
  });

  it("should handle unique constraint errors", async () => {
    const { db } = await import("@/server/database");

    vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi
          .fn()
          .mockRejectedValue(new Error("unique constraint violated")),
      }),
    } as any);

    const workspaceData = { name: "Existing Workspace" };
    const userId = "user-123";

    const result = await createWorkspace(workspaceData, userId);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Já existe um workspace com este nome");
  });
});
