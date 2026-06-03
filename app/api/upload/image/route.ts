import { NextRequest, NextResponse } from "next/server";

const FALLBACK_BACKEND_URL = "https://linkatalog.raftechsolution.web.id";
const FALLBACK_AUTH_USER   = "admin";
const FALLBACK_AUTH_PASS   = "Indones!4";

function backendUrl(): string {
  return (process.env.BACKEND_URL || FALLBACK_BACKEND_URL).replace(/\/+$/, "");
}

function basicAuthHeader(): string {
  const user = process.env.BACKEND_AUTH_USER || FALLBACK_AUTH_USER;
  const pass = process.env.BACKEND_AUTH_PASS || FALLBACK_AUTH_PASS;
  return `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
}

// Tipe gambar yang diizinkan untuk upload produk.
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE      = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const log = (...args: unknown[]) => console.log("[upload/image]", ...args);
  const err = (...args: unknown[]) => console.error("[upload/image]", ...args);

  try {
    // ── Step 1: Baca file dari browser ──────────────────────────────────────
    log("Step 1: membaca formData dari browser...");
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof Blob)) {
      err("file tidak ditemukan di formData. Keys:", [...formData.keys()]);
      return NextResponse.json({ success: false, message: "File tidak ditemukan dalam request." }, { status: 400 });
    }

    const fileName = ("name" in file && typeof file.name === "string") ? file.name : "upload.jpg";
    const fileType = file.type || "image/jpeg";
    const fileSize = file.size;

    log(`File diterima: ${fileName}, type: ${fileType}, size: ${fileSize} bytes`);

    if (!ALLOWED_TYPES.includes(fileType)) {
      err("Tipe tidak didukung:", fileType);
      return NextResponse.json({ success: false, message: `Tipe file tidak didukung: ${fileType}` }, { status: 400 });
    }
    if (fileSize > MAX_SIZE) {
      return NextResponse.json({ success: false, message: "Ukuran file maksimal 5 MB." }, { status: 400 });
    }

    // ── Step 2: Encode ke base64 ────────────────────────────────────────────
    log("Step 2: konversi ke base64...");
    const arrayBuffer = await file.arrayBuffer();
    const base64      = Buffer.from(arrayBuffer).toString("base64");
    log(`Base64 length: ${base64.length} chars (file ${fileSize} bytes)`);

    if (base64.length === 0) {
      err("Base64 kosong setelah encode — arrayBuffer mungkin kosong:", arrayBuffer.byteLength);
      return NextResponse.json({ success: false, message: "File kosong, tidak ada data yang bisa diupload." }, { status: 400 });
    }

    // ── Step 3: Kirim ke PHP backend (dengan retry untuk error transient) ────
    const target = `${backendUrl()}/upload/image`;
    const payload = JSON.stringify({ imageBase64: base64, mimeType: fileType, originalName: fileName });

    // "Route not found" yang muncul kadang-kadang biasanya berasal dari error
    // transient backend (cold start, redirect yang men-drop body POST, atau
    // deploy yang sedang berjalan). Kita coba ulang beberapa kali sebelum
    // menyerah, dengan jeda singkat.
    const MAX_ATTEMPTS = 3;
    let phpResponse: Response | null = null;
    let rawText = "";
    let lastError: unknown = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      log(`Step 3: kirim ke PHP ${target} (percobaan ${attempt}/${MAX_ATTEMPTS}), payload size: ${base64.length} chars...`);
      try {
        phpResponse = await fetch(target, {
          method: "POST",
          headers: {
            Authorization:  basicAuthHeader(),
            "Content-Type": "application/json",
            Accept:         "application/json",
          },
          body: payload,
          redirect: "follow",
          cache: "no-store",
        });
      } catch (fetchError) {
        lastError = fetchError;
        err(`Percobaan ${attempt} gagal connect:`, fetchError instanceof Error ? fetchError.message : fetchError);
        if (attempt < MAX_ATTEMPTS) {
          await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
          continue;
        }
        return NextResponse.json(
          { success: false, message: "Tidak bisa connect ke server upload. Coba lagi sebentar." },
          { status: 502 }
        );
      }

      rawText = await phpResponse.text();
      log(`Step 4: PHP HTTP ${phpResponse.status} (percobaan ${attempt}), response (150 chars): ${rawText.slice(0, 150)}`);

      // Retry hanya untuk indikasi error transient: 404/route-not-found atau 5xx.
      const looksTransient =
        phpResponse.status === 404 ||
        phpResponse.status >= 500 ||
        /route not found/i.test(rawText);

      if (looksTransient && attempt < MAX_ATTEMPTS) {
        err(`Respons transient (HTTP ${phpResponse.status}), mencoba ulang...`);
        await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
        continue;
      }

      break;
    }

    if (!phpResponse) {
      err("Tidak ada respons dari PHP:", lastError);
      return NextResponse.json(
        { success: false, message: "Server upload tidak merespons. Coba lagi sebentar." },
        { status: 502 }
      );
    }

    // Pesan lebih jelas kalau yang muncul memang "route not found" sampai akhir.
    if (phpResponse.status === 404 || /route not found/i.test(rawText)) {
      err("Route upload tidak ditemukan di backend:", rawText.slice(0, 200));
      return NextResponse.json(
        { success: false, message: "Endpoint upload sedang bermasalah. Coba lagi beberapa saat lagi." },
        { status: 502 }
      );
    }

    let data: { success?: boolean; message?: string; url?: string } = {};
    try {
      data = JSON.parse(rawText);
    } catch {
      err("PHP response bukan JSON:", rawText.slice(0, 500));
      return NextResponse.json(
        { success: false, message: "PHP error: " + rawText.slice(0, 300) },
        { status: 500 }
      );
    }

    if (!phpResponse.ok || !data.success) {
      err("PHP menolak upload:", data);
      return NextResponse.json(
        { success: false, message: data.message ?? `Upload gagal (HTTP ${phpResponse.status})` },
        { status: phpResponse.status || 400 }
      );
    }

    log("Upload berhasil! URL:", data.url);
    return NextResponse.json({ success: true, url: data.url });

  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    err("Exception:", msg);
    return NextResponse.json({ success: false, message: "Upload exception: " + msg }, { status: 500 });
  }
}
