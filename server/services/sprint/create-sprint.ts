"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/server/database";
import { categories, spaceMembers } from "@/server/database/schemas";
import { getCurrentUser } from "@/server/services/auth/get-current-user";

export type CreateSprintInput = {
  name: string;
  spaceId: string;
  duration: "weekly" | "biweekly";
  startDate?: Date;
};

export type CreateSprintResult = {
  success: boolean;
  sprint?: {
    id: string;
    name: string;
    type: string;
    metadata?: {
      startDate: Date;
      endDate: Date;
      duration: string;
      status: string;
    };
  };
  error?: string;
};

// Função para calcular próxima segunda-feira
function getNextMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day; // Se domingo, 1 dia; senão 8 - dia atual
  d.setDate(d.getDate() + daysUntilMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Função para calcular domingo final
function getEndSunday(startDate: Date, duration: "weekly" | "biweekly"): Date {
  const endDate = new Date(startDate);
  const daysToAdd = duration === "weekly" ? 6 : 13; // 7 dias (seg-dom) ou 14 dias
  endDate.setDate(endDate.getDate() + daysToAdd);
  endDate.setHours(23, 59, 59, 999);
  return endDate;
}

export async function createSprint(
  input: CreateSprintInput,
): Promise<CreateSprintResult> {
  try {
    const userId = await getCurrentUser();

    if (!userId) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const { name, spaceId, duration, startDate } = input;

    if (!name || name.trim().length === 0) {
      return {
        success: false,
        error: "Sprint name is required",
      };
    }

    if (!spaceId) {
      return {
        success: false,
        error: "Space ID is required",
      };
    }

    // Verifica se o usuário é membro do space
    const spaceMember = await db
      .select()
      .from(spaceMembers)
      .where(
        and(
          eq(spaceMembers.spaceId, spaceId),
          eq(spaceMembers.userId, userId)
        )
      )
      .limit(1);

    if (spaceMember.length === 0) {
      return {
        success: false,
        error: "You don't have permission to create sprints in this space",
      };
    }

    // Calcula datas automaticamente
    const calculatedStartDate = startDate
      ? getNextMonday(startDate)
      : getNextMonday(new Date());

    const calculatedEndDate = getEndSunday(calculatedStartDate, duration);

    // Verifica se já existe um sprint com o mesmo nome no space
    const existingSprint = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.name, name.trim()),
          eq(categories.spaceId, spaceId),
          eq(categories.type, "SPRINT")
        )
      )
      .limit(1);

    if (existingSprint.length > 0) {
      return {
        success: false,
        error: "A sprint with this name already exists in this space",
      };
    }

    // Cria a nova categoria do tipo SPRINT
    const [newSprint] = await db
      .insert(categories)
      .values({
        name: name.trim(),
        type: "SPRINT",
        spaceId: spaceId,
        ownerId: userId,
      })
      .returning({
        id: categories.id,
        name: categories.name,
        type: categories.type,
      });

    return {
      success: true,
      sprint: {
        ...newSprint,
        metadata: {
          startDate: calculatedStartDate,
          endDate: calculatedEndDate,
          duration: duration,
          status: "planned",
        },
      },
    };
  } catch (error) {
    console.error("Error creating sprint:", error);
    return {
      success: false,
      error: "Failed to create sprint",
    };
  }
}