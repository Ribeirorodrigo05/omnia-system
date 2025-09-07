import { db } from "@/server/database";
import { auditLogs } from "@/server/database/schemas/audit-logs";

export interface AuditLogData {
  action: string;
  resourceId: string;
  userId: string;
  resourceType: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAuditEvent(data: AuditLogData) {
  try {
    await db.insert(auditLogs).values({
      action: data.action,
      resourceId: data.resourceId,
      userId: data.userId,
      resourceType: data.resourceType,
      details: data.details || {},
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      createdAt: new Date(),
    });
  } catch (error) {
    // Log do erro mas não falha a operação principal
    console.error("Failed to log audit event:", error);
  }
}
