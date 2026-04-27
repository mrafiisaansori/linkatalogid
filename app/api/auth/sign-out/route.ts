import { NextResponse } from "next/server";
import { USER_SESSION_COOKIE, getExpiredCookieOptions } from "@/lib/auth/session";

export async function POST() {
  const response = NextResponse.json({
    success: true
  });

  response.cookies.set(USER_SESSION_COOKIE, "", getExpiredCookieOptions());
  return response;
}
