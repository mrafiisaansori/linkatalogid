import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function createAuditLog({
  adminUserId,
  action,
  targetType,
  targetId,
  metadata
}: {
  adminUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown> | null;
}) {
  await prisma.auditLog.create({
    data: {
      adminUserId,
      action,
      targetType,
      targetId,
      metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined
    }
  });
}
