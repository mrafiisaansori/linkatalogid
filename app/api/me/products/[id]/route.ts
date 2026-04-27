import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeProduct } from "@/lib/server/serializers";
import { getCurrentUserSession } from "@/lib/server/user-auth";

export async function PATCH(
  request: Request,
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

  const body = await request.json().catch(() => null);
  const title = body?.title?.toString()?.trim() ?? "";
  const price = Number(body?.price) || 0;
  const description = body?.description?.toString()?.trim() ?? "";
  const imageUrl = body?.imageUrl?.toString()?.trim() ?? "";
  const badge = body?.badge?.toString() ?? "";
  const category = body?.category?.toString()?.trim() ?? "";
  const isActive = Boolean(body?.isActive ?? existing.isActive);

  if (!title || !description || !category || !imageUrl) {
    return NextResponse.json(
      { success: false, message: "Judul, deskripsi, kategori, dan gambar wajib diisi." },
      { status: 400 }
    );
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      title,
      price,
      description,
      imageUrl,
      badge,
      category,
      isActive
    }
  });

  return NextResponse.json({
    success: true,
    message: "Produk berhasil disimpan.",
    data: serializeProduct(updated)
  });
}

export async function DELETE(
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
    },
    select: { id: true }
  });

  if (!existing) {
    return NextResponse.json({ success: false, message: "Produk tidak ditemukan." }, { status: 404 });
  }

  await prisma.product.delete({
    where: { id }
  });

  return NextResponse.json({
    success: true,
    message: "Produk dihapus."
  });
}
