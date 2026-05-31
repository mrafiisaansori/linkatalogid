import type { Metadata } from "next";
import { LegalPageShell, LegalSection } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Bantuan Katalog Online",
  description:
    "Pusat bantuan Linkatalog: cara membuat katalog online, menambah produk, membagikan link, dan menerima pesanan via WhatsApp.",
  alternates: { canonical: "/bantuan" },
  openGraph: {
    type: "article",
    url: "/bantuan",
    title: "Bantuan Katalog Online | Linkatalog",
    description: "Panduan dan pertanyaan umum seputar membuat katalog online dan checkout via WhatsApp di Linkatalog."
  }
};

const helpFaq = [
  {
    question: "Bagaimana cara mulai membuat katalog?",
    answer:
      "Daftar akun, lengkapi profil toko seperti nama, bio, dan nomor WhatsApp, lalu tambahkan produk pertama kamu. Setelah itu link katalog kamu siap dibagikan."
  },
  {
    question: "Bagaimana cara menambahkan produk?",
    answer:
      "Buka dasbor, pilih tambah produk, lalu isi foto, judul, harga, kategori, dan deskripsi. Kamu juga bisa menambahkan badge seperti Promo atau Best Seller."
  },
  {
    question: "Bagaimana pelanggan memesan produk?",
    answer:
      "Pelanggan membuka link katalog, memilih produk, menambahkannya ke keranjang, lalu menekan checkout. Pesanan otomatis terkirim sebagai pesan WhatsApp ke nomor kamu."
  },
  {
    question: "Apakah saya bisa mengubah nomor WhatsApp?",
    answer:
      "Bisa. Nomor WhatsApp dapat diperbarui kapan saja melalui pengaturan profil toko di dasbor. Pesanan berikutnya akan dikirim ke nomor yang baru."
  },
  {
    question: "Bagaimana cara membagikan katalog saya?",
    answer:
      "Salin link katalog kamu dan bagikan ke bio Instagram, bio TikTok, status WhatsApp, atau langsung ke chat pelanggan."
  }
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: helpFaq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer }
  }))
};

export default function BantuanPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <LegalPageShell
        eyebrow="Bantuan"
        title="Bantuan Katalog Online"
        description="Panduan singkat dan pertanyaan umum untuk membantu kamu membuat katalog, menambah produk, dan menerima pesanan via WhatsApp."
      >
        <LegalSection title="Langkah cepat memulai">
          <p>
            Mulai dengan membuat akun, melengkapi profil toko, lalu menambahkan produk. Setelah produk siap, bagikan satu
            link katalog kamu ke pelanggan dan terima pesanan langsung melalui WhatsApp.
          </p>
          <p>
            Kamu bisa mengubah produk, harga, atau profil toko kapan saja melalui dasbor tanpa perlu keahlian teknis.
          </p>
        </LegalSection>

        {helpFaq.map((item) => (
          <LegalSection key={item.question} title={item.question}>
            <p>{item.answer}</p>
          </LegalSection>
        ))}

        <LegalSection title="Masih butuh bantuan?">
          <p>
            Jika pertanyaan kamu belum terjawab, hubungi kami melalui kanal media sosial resmi Linkatalog di Instagram
            dan TikTok. Kami akan membantu sebisa mungkin.
          </p>
        </LegalSection>
      </LegalPageShell>
    </>
  );
}
