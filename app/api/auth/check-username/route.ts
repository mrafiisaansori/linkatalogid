import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isReservedPublicUsername, normalizePublicUsername } from "@/lib/utils";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const input = url.searchParams.get("username") ?? "";
  const normalized = normalizePublicUsername(input);

  if (!normalized) {
    return NextResponse.json({
      available: false,
      normalized: "",
      message: "Link anda wajib diisi."
    });
  }

  if (isReservedPublicUsername(normalized)) {
    return NextResponse.json({
      available: false,
      normalized,
      message: "Link ini tidak tersedia. Coba pakai nama lain."
    });
  }

  const existing = await prisma.user.findUnique({
    where: { username: normalized },
    select: { id: true }
  });

  return NextResponse.json({
    available: !existing,
    normalized,
    message: existing ? "Link ini sudah dipakai akun lain." : `Siap dipakai: linkatalog.id/${normalized}`
  });
}
