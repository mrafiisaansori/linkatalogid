import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeUser } from "@/lib/server/serializers";
import { getCurrentUserSession } from "@/lib/server/user-auth";
import {
  isReservedPublicUsername,
  normalizePublicUsername,
  sanitizeWhatsappNumber
} from "@/lib/utils";

const allowedAccents = new Set(["emerald", "sky", "coral", "amber"]);

export async function PATCH(request: Request) {
  const session = await getCurrentUserSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Sesi belum aktif." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const nextName = body?.name?.toString()?.trim();
  const nextBio = body?.bio?.toString() ?? undefined;
  const nextProfileImage = body?.profileImage?.toString() ?? undefined;
  const nextLocation = body?.location?.toString() ?? undefined;
  const nextWhatsapp =
    typeof body?.whatsapp === "string" ? sanitizeWhatsappNumber(body.whatsapp) : undefined;
  const nextThemePreference =
    body?.themePreference === "dark" || body?.themePreference === "light"
      ? body.themePreference
      : undefined;
  const nextThemeAccent =
    typeof body?.themeAccent === "string" && allowedAccents.has(body.themeAccent)
      ? body.themeAccent
      : undefined;

  let normalizedUsername: string | undefined;
  if (typeof body?.username === "string") {
    normalizedUsername = normalizePublicUsername(body.username);
    if (!normalizedUsername) {
      return NextResponse.json(
        { success: false, message: "Link anda wajib diisi." },
        { status: 400 }
      );
    }

    if (isReservedPublicUsername(normalizedUsername)) {
      return NextResponse.json(
        { success: false, message: "Link ini tidak tersedia. Coba pakai nama lain." },
        { status: 409 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { username: normalizedUsername },
      select: { id: true }
    });

    if (existing && existing.id !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Link ini sudah dipakai akun lain." },
        { status: 409 }
      );
    }
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(nextName ? { name: nextName } : {}),
      ...(typeof normalizedUsername === "string" ? { username: normalizedUsername } : {}),
      ...(typeof nextBio === "string" ? { bio: nextBio } : {}),
      ...(typeof nextProfileImage === "string" ? { profileImage: nextProfileImage } : {}),
      ...(typeof nextLocation === "string" ? { location: nextLocation } : {}),
      ...(typeof nextWhatsapp === "string" ? { whatsapp: nextWhatsapp } : {}),
      ...(nextThemePreference ? { themePreference: nextThemePreference } : {}),
      ...(nextThemeAccent ? { themeAccent: nextThemeAccent } : {})
    },
    include: {
      account: {
        select: {
          email: true
        }
      }
    }
  });

  return NextResponse.json({
    success: true,
    message: "Profil berhasil diperbarui.",
    data: serializeUser(updated)
  });
}
