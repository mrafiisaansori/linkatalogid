import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { USER_SESSION_COOKIE, createSessionToken, getUserSessionCookieOptions } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { buildSellerSessionPayload } from "@/lib/server/seller-data";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = body?.email?.toString()?.trim().toLowerCase() ?? "";
  const password = body?.password?.toString() ?? "";

  if (!email || !password.trim()) {
    return NextResponse.json(
      { success: false, message: "Email dan password wajib diisi." },
      { status: 400 }
    );
  }

  const account = await prisma.userAccount.findUnique({
    where: { email },
    include: {
      user: true
    }
  });

  if (!account || !account.user.isActive) {
    return NextResponse.json(
      { success: false, message: "Email atau password belum cocok." },
      { status: 401 }
    );
  }

  const passwordMatches = await bcrypt.compare(password, account.passwordHash);
  if (!passwordMatches) {
    return NextResponse.json(
      { success: false, message: "Email atau password belum cocok." },
      { status: 401 }
    );
  }

  const token = await createSessionToken({
    sub: account.user.id,
    scope: "user",
    username: account.user.username,
    expiresIn: "30d"
  });

  const payload = await buildSellerSessionPayload(account.user.id);
  const response = NextResponse.json({
    success: true,
    message: "Berhasil masuk.",
    data: payload
  });

  response.cookies.set(USER_SESSION_COOKIE, token, getUserSessionCookieOptions());
  return response;
}
