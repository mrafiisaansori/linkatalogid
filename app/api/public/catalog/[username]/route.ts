import { NextResponse } from "next/server";
import { getPublicCatalogPayload } from "@/lib/server/seller-data";
import { normalizePublicUsername } from "@/lib/utils";

export async function GET(
  _request: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;
  const payload = await getPublicCatalogPayload(normalizePublicUsername(username));

  if (!payload) {
    return NextResponse.json({ message: "Halaman tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json(payload);
}
