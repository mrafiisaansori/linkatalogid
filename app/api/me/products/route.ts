import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeProduct } from "@/lib/server/serializers";
import { getCurrentUserSession } from "@/lib/server/user-auth";

export async function POST(request: Request) {
  const session = await getCurrentUserSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Sesi belum aktif." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const title = body?.title?.toString()?.trim() ?? "";
  const price = Number(body?.price) || 0;
  const description = body?.description?.toString()?.trim() ?? "";
  const imageUrl = body?.imageUrl?.toString()?.trim() ?? "";
  const badge = body?.badge?.toString() ?? "";
  const category = body?.category?.toString()?.trim() ?? "";
  const isActive = Boolean(body?.isActive ?? true);

  if (!title || !description || !category || !imageUrl) {
    return NextResponse.json(
      { success: false, message: "Judul, deskripsi, kategori, dan gambar wajib diisi." },
      { status: 400 }
    );
  }

  const created = await prisma.product.create({
    data: {
      userId: session.user.id,
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
    data: serializeProduct(created)
  });
}
