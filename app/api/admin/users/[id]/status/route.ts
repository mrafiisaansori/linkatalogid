import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createAuditLog } from "@/lib/server/audit";
import { getAdminClaimsFromRequest } from "@/lib/server/admin-auth";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const claims = await getAdminClaimsFromRequest(request);
  if (!claims) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const isActive = Boolean(body?.isActive);

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      isActive: true
    }
  });

  if (!user) {
    return NextResponse.json({ success: false, message: "User tidak ditemukan." }, { status: 404 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      isActive
    },
    select: {
      id: true,
      username: true,
      isActive: true
    }
  });

  await createAuditLog({
    adminUserId: claims.sub,
    action: isActive ? "activate_user" : "deactivate_user",
    targetType: "user",
    targetId: updated.id,
    metadata: {
      username: updated.username,
      previousStatus: user.isActive,
      nextStatus: updated.isActive
    }
  });

  return NextResponse.json({
    success: true,
    message: isActive ? "User diaktifkan." : "User dinonaktifkan.",
    data: updated
  });
}
