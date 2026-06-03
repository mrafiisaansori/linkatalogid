import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ success: false, message: "File tidak ditemukan dalam request." }, { status: 400 });
    }

    const fileName = "name" in file && typeof file.name === "string" ? file.name : "upload.jpg";
    const fileType = file.type || "image/jpeg";
    const fileSize = file.size;

    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json({ success: false, message: `Tipe file tidak didukung: ${fileType}` }, { status: 400 });
    }

    if (fileSize > MAX_SIZE) {
      return NextResponse.json({ success: false, message: "Ukuran file maksimal 5 MB." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    if (arrayBuffer.byteLength === 0) {
      return NextResponse.json({ success: false, message: "File kosong, tidak ada data yang bisa diupload." }, { status: 400 });
    }

    const result = await backendFetch<{ success?: boolean; message?: string; url?: string }>("/upload/image", {
      method: "POST",
      body: {
        imageBase64: Buffer.from(arrayBuffer).toString("base64"),
        mimeType: fileType,
        originalName: fileName
      }
    });

    if (!result.ok || !result.data?.success || !result.data.url) {
      return NextResponse.json(
        { success: false, message: result.data?.message ?? "Upload gambar belum bisa diproses." },
        { status: result.status || 502 }
      );
    }

    return NextResponse.json({ success: true, url: result.data.url });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Upload gambar gagal. Coba lagi sebentar.",
        detail: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
