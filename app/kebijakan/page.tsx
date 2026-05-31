import type { Metadata } from "next";
import { LegalPageShell, LegalSection } from "@/components/legal-page-shell";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan Privasi Linkatalog menjelaskan data yang dikumpulkan, cara penggunaannya, dan hak kamu sebagai pengguna katalog online.",
  alternates: { canonical: "/kebijakan" },
  openGraph: {
    type: "article",
    url: "/kebijakan",
    title: "Kebijakan Privasi | Linkatalog",
    description:
      "Pelajari bagaimana Linkatalog mengumpulkan, menggunakan, dan melindungi data pengguna katalog online."
  }
};

export default function KebijakanPage() {
  return (
    <LegalPageShell
      eyebrow="Kebijakan Privasi"
      title="Kebijakan Privasi"
      description="Kebijakan ini menjelaskan data apa yang kami kumpulkan, bagaimana kami menggunakannya, dan bagaimana kami menjaga keamanan informasi kamu saat menggunakan Linkatalog."
      updatedAt="30 Mei 2026"
    >
      <LegalSection title="Pendahuluan">
        <p>
          {SITE_NAME} adalah layanan untuk membuat katalog produk online yang dapat dibagikan lewat satu link.
          Kebijakan ini berlaku saat kamu membuat katalog, mengelola produk, maupun saat pelanggan membuka halaman
          katalog publik kamu.
        </p>
        <p>
          Dengan menggunakan layanan kami, kamu menyetujui praktik yang dijelaskan dalam kebijakan ini. Jika kamu tidak
          setuju, sebaiknya hentikan penggunaan layanan.
        </p>
      </LegalSection>

      <LegalSection title="Data yang kami kumpulkan">
        <p>
          Kami mengumpulkan data yang kamu berikan secara langsung saat membuat akun dan katalog, seperti nama toko,
          nama pengguna, alamat email, nomor WhatsApp, deskripsi toko, serta informasi produk berupa foto, harga,
          kategori, dan deskripsi.
        </p>
        <p>
          Kami juga dapat mengumpulkan data teknis terbatas yang dibutuhkan agar layanan berjalan, misalnya preferensi
          tema tampilan yang kamu simpan di perangkat.
        </p>
      </LegalSection>

      <LegalSection title="Cara kami menggunakan data">
        <p>
          Data digunakan untuk menyediakan dan menampilkan katalog kamu, memproses pesanan yang diteruskan ke WhatsApp,
          serta meningkatkan kualitas dan keamanan layanan.
        </p>
        <p>
          Nomor WhatsApp yang kamu daftarkan digunakan untuk menerima pesanan dari pelanggan melalui fitur checkout.
          Pesanan dikirim sebagai pesan WhatsApp ke nomor tersebut.
        </p>
      </LegalSection>

      <LegalSection title="Pembagian data">
        <p>
          Kami tidak menjual data pribadi kamu. Informasi pada katalog publik (seperti nama toko dan produk) memang
          ditampilkan secara terbuka karena tujuannya untuk dibagikan ke pelanggan.
        </p>
        <p>
          Kami hanya membagikan data kepada pihak ketiga sejauh diperlukan untuk menjalankan layanan atau jika diwajibkan
          oleh hukum yang berlaku.
        </p>
      </LegalSection>

      <LegalSection title="Keamanan dan penyimpanan">
        <p>
          Kami menerapkan langkah-langkah yang wajar untuk menjaga keamanan data. Namun, tidak ada metode penyimpanan
          atau transmisi data yang sepenuhnya aman, sehingga kami tidak dapat menjamin keamanan secara mutlak.
        </p>
      </LegalSection>

      <LegalSection title="Hak kamu">
        <p>
          Kamu dapat mengubah atau menghapus informasi toko dan produk kapan saja melalui dasbor. Jika kamu ingin
          menghapus akun atau memiliki pertanyaan terkait data, silakan hubungi kami melalui halaman bantuan.
        </p>
      </LegalSection>

      <LegalSection title="Perubahan kebijakan">
        <p>
          Kebijakan ini dapat diperbarui sewaktu-waktu. Perubahan penting akan kami tampilkan pada halaman ini beserta
          tanggal pembaruannya.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
