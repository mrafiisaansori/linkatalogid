import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { USER_SESSION_COOKIE, createSessionToken, getUserSessionCookieOptions } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { buildSellerSessionPayload } from "@/lib/server/seller-data";
import { isReservedPublicUsername, normalizePublicUsername } from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = body?.name?.toString() ?? "";
  const username = body?.username?.toString() ?? "";
  const email = body?.email?.toString() ?? "";
  const password = body?.password?.toString() ?? "";
  const normalizedUsername = normalizePublicUsername(username);
  const normalizedEmail = email.trim().toLowerCase();

  if (!name.trim() || !normalizedUsername || !normalizedEmail || !password.trim()) {
    return NextResponse.json(
      { success: false, message: "Nama, link anda, email, dan password wajib diisi." },
      { status: 400 }
    );
  }

  if (password.trim().length < 8) {
    return NextResponse.json(
      { success: false, message: "Password minimal 8 karakter." },
      { status: 400 }
    );
  }

  if (isReservedPublicUsername(normalizedUsername)) {
    return NextResponse.json(
      { success: false, message: "Link ini tidak tersedia. Coba pakai nama lain." },
      { status: 409 }
    );
  }

  const [existingUser, existingAccount] = await Promise.all([
    prisma.user.findUnique({ where: { username: normalizedUsername }, select: { id: true } }),
    prisma.userAccount.findUnique({ where: { email: normalizedEmail }, select: { id: true } })
  ]);

  if (existingUser) {
    return NextResponse.json(
      { success: false, message: "Link ini sudah dipakai akun lain." },
      { status: 409 }
    );
  }

  if (existingAccount) {
    return NextResponse.json(
      { success: false, message: "Email ini sudah dipakai." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const createdUser = await prisma.user.create({
    data: {
      name: name.trim(),
      username: normalizedUsername,
      bio: "Tambahkan bio singkat supaya calon pembeli langsung paham apa yang kamu jual.",
      whatsapp: "",
      profileImage: "",
      location: "",
      themePreference: "light",
      themeAccent: "emerald",
      account: {
        create: {
          email: normalizedEmail,
          passwordHash
        }
      }
    }
  });

  const token = await createSessionToken({
    sub: createdUser.id,
    scope: "user",
    username: createdUser.username,
    expiresIn: "30d"
  });

  const payload = await buildSellerSessionPayload(createdUser.id);
  const response = NextResponse.json({
    success: true,
    message: "Akun berhasil dibuat.",
    data: payload
  });

  response.cookies.set(USER_SESSION_COOKIE, token, getUserSessionCookieOptions());
  return response;
}
