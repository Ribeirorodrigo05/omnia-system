import { beforeEach, describe, expect, it, vi } from "vitest";
import { renameSpace } from "@/server/services/space-service/rename-space";

vi.mock("@/server/database", () => ({
  db: {
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([
            {
              id: "space-id-123",
              name: "Renamed Space",
              workspaceId: "workspace-id-123",
              createdAt: new Date(),
            },
          ]),
        }),
      }),
    }),
  },
}));

describe("renameSpace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should rename space successfully", async () => {
    const spaceId = "space-id-123";
    const newName = "Renamed Space";
    const userId = "user-123";

    const result = await renameSpace(spaceId, newName, userId);

    expect(result.success).toBe(true);
    expect(result.space).toEqual({
      id: "space-id-123",
      name: "Renamed Space",
      workspaceId: "workspace-id-123",
      createdAt: expect.any(Date),
    });
  });

  it("should handle not found space", async () => {
    const { db } = await import("@/server/database");

    vi.mocked(db.update).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      }),
    } as any);

    const result = await renameSpace("non-existent-id", "New Name", "user-123");

    expect(result.success).toBe(false);
    expect(result.error).toBe(
      "Space não encontrado ou você não tem permissão para renomeá-lo",
    );
  });

  it("should handle database errors", async () => {
    const { db } = await import("@/server/database");

    vi.mocked(db.update).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockRejectedValue(new Error("Database error")),
        }),
      }),
    } as any);

    const result = await renameSpace("space-id-123", "New Name", "user-123");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Erro interno do servidor");
  });
});
