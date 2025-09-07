import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSpace } from "@/server/services/space-service/create-space";

vi.mock("@/server/database", () => ({
  db: {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([
          {
            id: "space-id-123",
            name: "Test Space",
            workspaceId: "workspace-id-123",
            createdAt: new Date(),
          },
        ]),
      }),
    }),
  },
}));

describe("createSpace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create space successfully", async () => {
    const spaceData = {
      name: "Valid Space Name",
      workspaceId: "workspace-id-123",
    };
    const userId = "user-123";

    const result = await createSpace(spaceData, userId);

    expect(result.success).toBe(true);
    expect(result.space).toEqual({
      id: "space-id-123",
      name: "Test Space",
      workspaceId: "workspace-id-123",
      createdAt: expect.any(Date),
    });
  });

  it("should handle database errors", async () => {
    const { db } = await import("@/server/database");

    vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockRejectedValue(new Error("Database error")),
      }),
    } as any);

    const spaceData = {
      name: "Valid Space",
      workspaceId: "workspace-id-123",
    };
    const userId = "user-123";

    const result = await createSpace(spaceData, userId);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Erro interno do servidor");
  });
});
