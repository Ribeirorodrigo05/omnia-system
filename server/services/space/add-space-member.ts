"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/server/database";
import { spaces, spaceMembers, users } from "@/server/database/schemas";
import { getCurrentUser } from "@/server/services/auth/get-current-user";

export type AddSpaceMemberInput = {
  spaceId: string;
  email: string;
};

export type AddSpaceMemberResult = {
  success: boolean;
  member?: {
    id: string;
    name: string;
    email: string;
  };
  error?: string;
};

export async function addSpaceMember(
  input: AddSpaceMemberInput,
): Promise<AddSpaceMemberResult> {
  try {
    const userId = await getCurrentUser();

    if (!userId) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const { spaceId, email } = input;

    if (!email || !email.trim()) {
      return {
        success: false,
        error: "Email is required",
      };
    }

    // Verifica se o usuário atual tem permissão para adicionar membros
    const currentUserMember = await db
      .select({
        role: spaceMembers.role,
        spaceOwnerId: spaces.ownerId,
      })
      .from(spaceMembers)
      .innerJoin(spaces, eq(spaceMembers.spaceId, spaces.id))
      .where(
        and(
          eq(spaceMembers.spaceId, spaceId),
          eq(spaceMembers.userId, userId)
        )
      )
      .limit(1);

    if (currentUserMember.length === 0) {
      return {
        success: false,
        error: "Space not found or access denied",
      };
    }

    const currentMember = currentUserMember[0];
    const isOwner = currentMember.spaceOwnerId === userId || currentMember.role === "owner";

    if (!isOwner) {
      return {
        success: false,
        error: "Only space owners can add members",
      };
    }

    // Busca o usuário pelo email
    const targetUser = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.email, email.trim().toLowerCase()))
      .limit(1);

    if (targetUser.length === 0) {
      return {
        success: false,
        error: "User not found with this email",
      };
    }

    const user = targetUser[0];

    // Verifica se o usuário já é membro do space
    const existingMember = await db
      .select()
      .from(spaceMembers)
      .where(
        and(
          eq(spaceMembers.spaceId, spaceId),
          eq(spaceMembers.userId, user.id)
        )
      )
      .limit(1);

    if (existingMember.length > 0) {
      return {
        success: false,
        error: "User is already a member of this space",
      };
    }

    // Adiciona o usuário como membro do space
    await db.insert(spaceMembers).values({
      spaceId: spaceId,
      userId: user.id,
      role: "member",
    });

    return {
      success: true,
      member: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Error adding space member:", error);
    return {
      success: false,
      error: "Failed to add member to space",
    };
  }
}