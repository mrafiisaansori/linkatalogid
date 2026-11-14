// Kecilkan foto di browser sebelum upload: maks 1200px, WebP. Foto HP 2-5 MB jadi ~100-300 KB.
export async function compressImage(file: File, maxSide = 1200, quality = 0.8): Promise<Blob> {
  if (file.type === "image/gif") return file; // ponytail: GIF dibiarkan supaya animasi tidak hilang

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const toBlob = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  let blob = await toBlob("image/webp");
  // Safari tidak bisa encode WebP (diam-diam jadi PNG): pakai JPEG.
  if (!blob || blob.type !== "image/webp") blob = await toBlob("image/jpeg");
  return blob && blob.size < file.size ? blob : file;
}
