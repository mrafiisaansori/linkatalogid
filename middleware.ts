import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth/session";

export async function middleware(request: Request) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/be-admin")) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith("linkatalog_admin_session="))
    ?.split("=")
    .slice(1)
    .join("=");

  const validSession = token ? await verifySessionToken(token, "admin") : null;

  if (url.pathname === "/be-admin") {
    if (validSession) {
      return NextResponse.redirect(new URL("/be-admin/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (!validSession) {
    return NextResponse.redirect(new URL("/be-admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/be-admin/:path*"]
};
