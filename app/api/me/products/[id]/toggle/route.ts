import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeProduct } from "@/lib/server/serializers";
import { getCurrentUserSession } from "@/lib/server/user-auth";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentUserSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Sesi belum aktif." }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await prisma.product.findFirst({
    where: {
      id,
      userId: session.user.id
    }
  });

  if (!existing) {
    return NextResponse.json({ success: false, message: "Produk tidak ditemukan." }, { status: 404 });
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      isActive: !existing.isActive
    }
  });

  return NextResponse.json({
    success: true,
    message: "Status produk diperbarui.",
    data: serializeProduct(updated)
  });
}
