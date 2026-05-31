import type { Metadata } from "next";
import { LegalPageShell, LegalSection } from "@/components/legal-page-shell";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Syarat Layanan",
  description:
    "Syarat Layanan Linkatalog mengatur hak dan kewajiban pengguna dalam membuat katalog online dan menerima pesanan via WhatsApp.",
  alternates: { canonical: "/syarat-layanan" },
  openGraph: {
    type: "article",
    url: "/syarat-layanan",
    title: "Syarat Layanan | Linkatalog",
    description: "Ketentuan penggunaan layanan Linkatalog untuk membuat katalog online dan checkout via WhatsApp."
  }
};

export default function SyaratLayananPage() {
  return (
    <LegalPageShell
      eyebrow="Syarat Layanan"
      title="Syarat Layanan"
      description="Dengan menggunakan Linkatalog, kamu menyetujui ketentuan berikut. Mohon dibaca agar kamu memahami hak dan tanggung jawab saat memakai layanan."
      updatedAt="30 Mei 2026"
    >
      <LegalSection title="Penerimaan ketentuan">
        <p>
          Dengan membuat akun atau menggunakan {SITE_NAME}, kamu dianggap telah membaca, memahami, dan menyetujui
          seluruh ketentuan dalam halaman ini. Jika kamu tidak setuju, mohon untuk tidak menggunakan layanan.
        </p>
      </LegalSection>

      <LegalSection title="Penggunaan layanan">
        <p>
          {SITE_NAME} menyediakan alat untuk membuat katalog produk online yang dapat dibagikan lewat satu link.
          Pesanan dari pelanggan diteruskan ke nomor WhatsApp yang kamu daftarkan.
        </p>
        <p>
          Kamu bertanggung jawab atas keakuratan informasi toko dan produk yang kamu tampilkan, termasuk harga,
          deskripsi, dan ketersediaan barang.
        </p>
      </LegalSection>

      <LegalSection title="Tanggung jawab pengguna">
        <p>
          Kamu setuju untuk tidak menggunakan layanan untuk menjual barang atau jasa yang melanggar hukum, menampilkan
          konten yang menyesatkan, atau melanggar hak pihak lain.
        </p>
        <p>
          Kamu bertanggung jawab menjaga kerahasiaan akun kamu serta seluruh aktivitas yang terjadi di dalamnya.
        </p>
      </LegalSection>

      <LegalSection title="Transaksi dengan pelanggan">
        <p>
          Linkatalog berperan sebagai media katalog dan penyalur pesanan ke WhatsApp. Proses negosiasi, pembayaran,
          pengiriman, dan penyelesaian transaksi terjadi langsung antara kamu dan pelanggan.
        </p>
        <p>
          Kami tidak menjadi pihak dalam transaksi tersebut dan tidak bertanggung jawab atas kesepakatan yang dibuat di
          luar layanan.
        </p>
      </LegalSection>

      <LegalSection title="Ketersediaan layanan">
        <p>
          Kami berupaya menjaga layanan tetap tersedia, namun dapat melakukan pemeliharaan, pembaruan, atau perubahan
          fitur sewaktu-waktu. Layanan disediakan apa adanya tanpa jaminan bebas gangguan.
        </p>
      </LegalSection>

      <LegalSection title="Batasan tanggung jawab">
        <p>
          Sejauh diizinkan oleh hukum, {SITE_NAME} tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari
          penggunaan atau ketidakmampuan menggunakan layanan.
        </p>
      </LegalSection>

      <LegalSection title="Perubahan ketentuan">
        <p>
          Kami dapat memperbarui Syarat Layanan ini dari waktu ke waktu. Versi terbaru akan selalu tersedia di halaman
          ini beserta tanggal pembaruannya.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
