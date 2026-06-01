/**
 * Data layer blog - saat ini memakai data STATIS di file ini.
 *
 * Kontrak fungsi (getAllPosts / getPostBySlug / getRelatedPosts) sengaja dibuat
 * async agar nanti mudah diganti ke backend (REST/DB) tanpa mengubah komponen
 * halaman. Cukup ganti isi fungsi di bawah dengan pemanggilan fetch/Prisma,
 * pertahankan bentuk tipe `BlogPost`, dan halaman tetap bekerja.
 *
 * Contoh migrasi backend nanti:
 *   export async function getAllPosts() {
 *     const res = await fetch(`${API_URL}/blog`, { next: { revalidate: 300 } });
 *     return (await res.json()) as BlogPost[];
 *   }
 */

export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "callout"; title?: string; text: string }
  | { type: "quote"; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  /** Judul khusus untuk tag <title> / SEO bila berbeda dari title tampilan. */
  seoTitle?: string;
  description: string;
  keywords: string[];
  category: string;
  author: string;
  /** ISO date string, mis. "2026-05-20". */
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  coverImage: string;
  coverAlt: string;
  excerpt: string;
  content: BlogBlock[];
  faq?: { question: string; answer: string }[];
}

const POSTS: BlogPost[] = [
  {
    slug: "cara-bikin-katalog-online-gratis",
    title: "Cara Bikin Katalog Online Gratis untuk Jualan (Panduan 2026)",
    seoTitle: "Cara Bikin Katalog Online Gratis untuk Jualan (Panduan 2026)",
    description:
      "Panduan lengkap cara bikin katalog online gratis dalam hitungan menit, lengkap dengan tombol order WhatsApp. Cocok untuk UMKM, reseller, dan pemula.",
    keywords: [
      "cara bikin katalog online gratis",
      "link katalog gratis",
      "katalog online gratis",
      "bikin katalog produk online",
      "katalog jualan online"
    ],
    category: "Panduan",
    author: "Tim Linkatalog",
    publishedAt: "2026-05-12",
    updatedAt: "2026-05-30",
    readingMinutes: 6,
    coverImage: "/blog/cara-bikin-katalog-online-gratis-photo.png",
    coverAlt: "Pemilik UMKM menata katalog produk online gratis dari ponsel dan laptop",
    excerpt:
      "Tidak perlu website mahal atau keahlian coding. Begini cara bikin katalog online gratis yang rapi dan langsung terima order via WhatsApp.",
    content: [
      {
        type: "paragraph",
        text: "Punya produk untuk dijual tetapi bingung menampilkannya secara rapi? Mengirim foto produk satu per satu ke setiap calon pembeli jelas melelahkan dan terlihat kurang profesional. Solusinya adalah katalog online: satu halaman berisi semua produkmu yang bisa dibagikan lewat satu link. Kabar baiknya, kamu bisa membuatnya gratis tanpa perlu website mahal atau keahlian teknis."
      },
      { type: "heading", level: 2, text: "Apa itu katalog online dan kenapa penting" },
      {
        type: "paragraph",
        text: "Katalog online adalah etalase digital berisi daftar produk lengkap dengan foto, harga, dan deskripsi yang bisa diakses siapa saja lewat tautan. Berbeda dengan mengirim gambar di chat, katalog membuat calon pembeli melihat seluruh produkmu dalam satu tampilan rapi, kapan saja, tanpa kamu harus membalas satu per satu."
      },
      {
        type: "paragraph",
        text: "Bagi UMKM dan reseller, katalog online menaikkan kepercayaan pembeli. Tampilan yang rapi memberi kesan toko yang serius dan terkelola, sehingga calon pembeli lebih nyaman melakukan order."
      },
      { type: "heading", level: 2, text: "Pilihan cara bikin katalog online" },
      { type: "heading", level: 3, text: "1. Lewat WhatsApp Business" },
      {
        type: "paragraph",
        text: "WhatsApp Business punya fitur katalog bawaan. Cocok untuk awal, namun terbatas: tidak ada halaman publik yang bisa dibagikan sebagai satu link bersih, tampilannya seragam, dan tidak ada keranjang belanja untuk merangkum beberapa produk sekaligus."
      },
      { type: "heading", level: 3, text: "2. Lewat platform link katalog seperti Linkatalog" },
      {
        type: "paragraph",
        text: "Platform link katalog memberi kamu satu halaman publik dengan alamat sendiri (misalnya linkatalog.id/namatoko), tampilan mobile-friendly, keranjang belanja, dan tombol checkout yang langsung mengarah ke WhatsApp. Semuanya gratis dan bisa diatur tanpa coding."
      },
      { type: "heading", level: 2, text: "Langkah bikin katalog online gratis di Linkatalog" },
      {
        type: "list",
        ordered: true,
        items: [
          "Daftar akun gratis, lalu lengkapi profil toko: nama toko, bio singkat, dan nomor WhatsApp aktif.",
          "Tambahkan produk satu per satu - unggah foto yang jelas, isi judul, harga, kategori, dan deskripsi singkat yang menjawab pertanyaan pembeli.",
          "Atur tampilan: gunakan badge seperti Promo atau Best Seller untuk menyorot produk unggulan.",
          "Salin link katalogmu, lalu bagikan ke bio Instagram, bio TikTok, status WhatsApp, dan chat pelanggan."
        ]
      },
      {
        type: "callout",
        title: "Tips foto produk",
        text: "Gunakan latar polos dan pencahayaan terang. Foto konsisten (rasio sama) membuat katalog terlihat jauh lebih profesional dan menaikkan kepercayaan pembeli."
      },
      { type: "heading", level: 2, text: "Tips agar katalog cepat menghasilkan order" },
      {
        type: "list",
        items: [
          "Tulis deskripsi yang menjawab keberatan umum: ukuran, bahan, estimasi pengiriman, dan cara pemesanan.",
          "Pasang harga dengan jelas - pembeli cenderung skip produk tanpa harga.",
          "Letakkan link katalog di semua bio media sosialmu agar mudah ditemukan.",
          "Perbarui stok dan status produk secara berkala supaya pembeli tidak kecewa."
        ]
      },
      {
        type: "paragraph",
        text: "Setelah katalog siap, fokusmu tinggal mempromosikannya. Satu link yang sama bisa kamu pakai di mana pun, dan setiap order masuk rapi sebagai pesan WhatsApp yang sudah berisi detail produk."
      }
    ],
    faq: [
      {
        question: "Apakah benar-benar gratis?",
        answer:
          "Ya. Di Linkatalog kamu bisa membuat katalog, menambah produk, dan memakai tombol checkout WhatsApp tanpa biaya."
      },
      {
        question: "Apakah perlu kemampuan coding?",
        answer:
          "Tidak. Semua diatur lewat dasbor sederhana: cukup unggah foto, isi detail produk, lalu bagikan linknya."
      },
      {
        question: "Berapa lama membuat katalog online?",
        answer:
          "Rata-rata di bawah 5 menit untuk menyiapkan profil dan produk pertama, lalu link langsung siap dibagikan."
      }
    ]
  },
  {
    slug: "katalog-online-checkout-whatsapp",
    title: "Katalog Online dengan Checkout via WhatsApp: Terima Order Tanpa Ribet",
    description:
      "Cara membuat katalog online yang langsung checkout via WhatsApp. Pembeli cukup klik satu tombol, chat otomatis terisi detail produk yang dipesan.",
    keywords: [
      "katalog online checkout whatsapp",
      "checkout via whatsapp",
      "katalog whatsapp",
      "terima order whatsapp otomatis",
      "tombol order whatsapp"
    ],
    category: "Fitur",
    author: "Tim Linkatalog",
    publishedAt: "2026-05-16",
    readingMinutes: 5,
    coverImage: "/blog/katalog-online-checkout-whatsapp-photo.png",
    coverAlt: "Penjual online menerima pesanan WhatsApp dari katalog produk di meja packing",
    excerpt:
      "Pembeli klik satu tombol, chat WhatsApp langsung terisi detail produk. Begini cara kerja katalog dengan checkout WhatsApp yang bikin order lebih cepat.",
    content: [
      {
        type: "paragraph",
        text: "Di Indonesia, WhatsApp adalah tempat transaksi terjadi. Maka katalog online yang ideal bukan sekadar memajang produk, tetapi juga mengarahkan pembeli untuk order langsung lewat WhatsApp dengan detail yang sudah lengkap. Inilah yang disebut checkout via WhatsApp."
      },
      { type: "heading", level: 2, text: "Kenapa checkout via WhatsApp cocok untuk UMKM" },
      {
        type: "paragraph",
        text: "Pembeli sudah terbiasa dan nyaman berkomunikasi lewat WhatsApp. Tidak ada aplikasi baru yang perlu diunduh, tidak ada proses pendaftaran yang menyulitkan. Penjual pun bisa langsung berkomunikasi, menawarkan variasi, dan menutup penjualan secara personal."
      },
      { type: "heading", level: 2, text: "Beda katalog WhatsApp Business vs link katalog + tombol WA" },
      {
        type: "paragraph",
        text: "Katalog bawaan WhatsApp Business berguna, namun tidak punya halaman publik yang rapi untuk dibagikan, dan tidak mendukung keranjang untuk beberapa produk sekaligus. Link katalog seperti Linkatalog memberi halaman profesional, keranjang belanja, lalu meneruskan pesanan ke WhatsApp dengan rincian otomatis."
      },
      { type: "heading", level: 2, text: "Cara kerja tombol order WhatsApp otomatis" },
      {
        type: "list",
        ordered: true,
        items: [
          "Pembeli membuka link katalogmu dan memilih produk yang diinginkan.",
          "Produk masuk ke keranjang; pembeli bisa menambah beberapa item sekaligus.",
          "Saat menekan checkout, aplikasi membuka WhatsApp ke nomormu dengan pesan yang sudah berisi nama produk, jumlah, dan total.",
          "Kamu tinggal mengonfirmasi ongkir dan metode pembayaran - order selesai tanpa tanya-jawab berulang."
        ]
      },
      {
        type: "callout",
        title: "Format pesan yang menaikkan closing",
        text: "Pesan otomatis yang rapi (berisi daftar produk dan total) membuat pembeli merasa prosesnya jelas dan terpercaya, sehingga lebih sedikit yang batal di tengah jalan."
      },
      { type: "heading", level: 2, text: "Kesalahan umum saat jualan via WhatsApp" },
      {
        type: "list",
        items: [
          "Mengandalkan balasan manual untuk semua pertanyaan dasar - buat deskripsi produk yang lengkap agar pembeli tidak perlu bertanya hal sepele.",
          "Tidak mencantumkan harga, sehingga pembeli ragu dan tidak jadi chat.",
          "Nomor WhatsApp tidak aktif atau salah - pastikan selalu nomor yang benar di profil katalog."
        ]
      },
      {
        type: "paragraph",
        text: "Dengan katalog yang langsung terhubung ke WhatsApp, kamu memangkas jarak antara 'tertarik' dan 'order'. Semakin sedikit hambatan, semakin tinggi peluang penjualan."
      }
    ],
    faq: [
      {
        question: "Apakah pembeli perlu aplikasi khusus untuk checkout?",
        answer:
          "Tidak. Pembeli cukup punya WhatsApp. Saat checkout, chat ke nomormu terbuka otomatis dengan detail pesanan."
      },
      {
        question: "Bisakah pembeli memesan beberapa produk sekaligus?",
        answer:
          "Bisa. Produk dimasukkan ke keranjang, lalu seluruhnya dirangkum dalam satu pesan WhatsApp saat checkout."
      }
    ]
  },
  {
    slug: "link-bio-katalog-untuk-reseller",
    title: "Link Bio Katalog untuk Reseller: Satu Link Semua Produk + Order WA",
    description:
      "Optimalkan link bio Instagram dan TikTok jadi katalog jualan untuk reseller. Satu link berisi semua produk, order langsung ke WhatsApp.",
    keywords: [
      "link bio katalog",
      "link bio jualan reseller",
      "link katalog instagram",
      "link bio tiktok jualan",
      "katalog reseller whatsapp"
    ],
    category: "Tips Reseller",
    author: "Tim Linkatalog",
    publishedAt: "2026-05-20",
    readingMinutes: 5,
    coverImage: "/blog/link-bio-katalog-untuk-reseller-photo.png",
    coverAlt: "Reseller mengecek link bio katalog dari ponsel di ruang kerja kecil",
    excerpt:
      "Bio Instagram hanya muat satu link. Manfaatkan jadi katalog berisi semua produkmu, lengkap dengan tombol order WhatsApp.",
    content: [
      {
        type: "paragraph",
        text: "Sebagai reseller, kamu mungkin menjual puluhan produk dari berbagai supplier. Masalahnya, bio Instagram hanya memuat satu link, dan TikTok pun terbatas. Mengganti-ganti link tiap promosi jelas tidak praktis. Solusinya: satu link katalog yang memuat semua produkmu."
      },
      { type: "heading", level: 2, text: "Masalah klasik reseller: bio cuma muat satu link" },
      {
        type: "paragraph",
        text: "Tanpa katalog, kamu terpaksa menaruh nomor WhatsApp di bio dan membalas pertanyaan 'ini berapa?' berkali-kali. Calon pembeli yang tidak sabar akan kabur. Katalog mengubah satu link bio menjadi etalase lengkap yang bekerja 24 jam."
      },
      { type: "heading", level: 2, text: "Solusi: satu link berisi semua produk" },
      {
        type: "paragraph",
        text: "Dengan link katalog, calon pembeli mengeklik satu tautan di bio, melihat seluruh produkmu beserta harga dan foto, lalu memesan lewat tombol WhatsApp. Kamu cukup membagikan satu link yang sama di semua platform."
      },
      { type: "heading", level: 2, text: "Cara pasang link katalog di bio" },
      { type: "heading", level: 3, text: "Instagram" },
      {
        type: "list",
        ordered: true,
        items: [
          "Buka profil, ketuk Edit profil, lalu tempel link katalogmu di kolom Situs Web.",
          "Tambahkan ajakan singkat di bio, misalnya 'Katalog & order di link bawah'.",
          "Sebut 'cek link di bio' di setiap caption dan Story produk."
        ]
      },
      { type: "heading", level: 3, text: "TikTok" },
      {
        type: "list",
        ordered: true,
        items: [
          "Setelah memenuhi syarat menambahkan link, buka Edit profil dan masukkan link katalog di bagian situs web.",
          "Arahkan penonton ke bio di akhir setiap video.",
          "Pin video terbaikmu yang menampilkan produk unggulan."
        ]
      },
      {
        type: "callout",
        title: "Bikin link bio auto-closing",
        text: "Sorot 2-3 produk best seller di bagian atas katalog. Pembeli yang datang dari video sering langsung tertarik pada produk yang sedang viral."
      },
      { type: "heading", level: 2, text: "Tips memaksimalkan link bio" },
      {
        type: "list",
        items: [
          "Gunakan nama link katalog yang mudah diingat dan sesuai brand kamu.",
          "Susun kategori agar pembeli cepat menemukan jenis produk yang dicari.",
          "Selalu perbarui produk yang sedang ready stock agar tidak ada order untuk barang kosong."
        ]
      }
    ],
    faq: [
      {
        question: "Apakah satu link katalog bisa dipakai di Instagram dan TikTok sekaligus?",
        answer: "Bisa. Gunakan link yang sama di semua bio media sosial agar konsisten dan mudah dikelola."
      }
    ]
  },
  {
    slug: "jualan-online-tanpa-website",
    title: "Cara Jualan Online Tanpa Website (Modal HP & 1 Link Katalog)",
    description:
      "Mau jualan online tapi belum punya website? Pakai satu link katalog gratis dengan tampilan profesional dan order via WhatsApp, tanpa coding.",
    keywords: [
      "cara jualan online tanpa website",
      "jualan online tanpa website",
      "jualan online modal hp",
      "alternatif website jualan",
      "link katalog jualan"
    ],
    category: "Strategi",
    author: "Tim Linkatalog",
    publishedAt: "2026-05-24",
    readingMinutes: 6,
    coverImage: "/blog/jualan-online-tanpa-website-photo.png",
    coverAlt: "Pemilik usaha rumahan mengelola jualan online dari ponsel tanpa website",
    excerpt:
      "Belum punya website? Tidak masalah. Kamu tetap bisa tampil profesional dan menerima order rapi hanya dengan satu link katalog.",
    content: [
      {
        type: "paragraph",
        text: "Banyak penjual menunda mulai berjualan online karena merasa harus punya website dulu. Padahal membuat dan merawat website butuh biaya, waktu, serta keahlian teknis. Kabar baiknya, kamu bisa mulai jualan online secara profesional tanpa website sama sekali."
      },
      { type: "heading", level: 2, text: "Apakah harus punya website untuk jualan online?" },
      {
        type: "paragraph",
        text: "Tidak. Website memang berguna untuk skala besar, tetapi untuk memulai, yang kamu butuhkan hanyalah tempat memajang produk secara rapi dan cara menerima order. Keduanya bisa dipenuhi oleh satu link katalog."
      },
      { type: "heading", level: 2, text: "Alternatif website: link katalog" },
      {
        type: "paragraph",
        text: "Link katalog memberi kamu halaman publik dengan alamat sendiri, tampilan mobile-friendly, dan tombol checkout WhatsApp - semua tanpa coding dan tanpa biaya server. Bagi pembeli, pengalamannya terasa seperti mengunjungi toko online sungguhan."
      },
      { type: "heading", level: 2, text: "Langkah mulai jualan tanpa website hari ini" },
      {
        type: "list",
        ordered: true,
        items: [
          "Buat akun katalog gratis dan tentukan nama link tokomu.",
          "Unggah produk dengan foto, harga, dan deskripsi.",
          "Bagikan link katalog ke semua media sosial dan grup WhatsApp.",
          "Terima order yang masuk rapi via WhatsApp dan layani pembeli secara personal."
        ]
      },
      { type: "heading", level: 2, text: "Marketplace vs media sosial vs link katalog" },
      {
        type: "paragraph",
        text: "Marketplace ramai tetapi penuh kompetitor dan potongan biaya. Media sosial bagus untuk menjangkau orang, tetapi sulit menampilkan katalog secara terstruktur. Link katalog menggabungkan kelebihan keduanya: tampilan toko yang rapi, dipromosikan lewat media sosial, dan transaksi personal lewat WhatsApp."
      },
      {
        type: "callout",
        title: "Mulai kecil, lalu berkembang",
        text: "Kamu bisa memulai dengan link katalog hari ini, lalu mempertimbangkan website sendiri ketika skala bisnismu sudah besar dan butuh fitur khusus."
      },
      { type: "heading", level: 2, text: "Kapan sebaiknya upgrade ke website" },
      {
        type: "paragraph",
        text: "Pertimbangkan website ketika kamu butuh sistem pembayaran otomatis, integrasi logistik kompleks, atau branding yang sangat khusus. Sebelum itu, link katalog sudah lebih dari cukup untuk membangun penjualan yang stabil."
      }
    ],
    faq: [
      {
        question: "Apakah link katalog cukup profesional dibanding website?",
        answer:
          "Untuk sebagian besar UMKM dan reseller, ya. Tampilan rapi dan link beralamat sendiri sudah memberi kesan profesional di mata pembeli."
      }
    ]
  },
  {
    slug: "contoh-katalog-produk-online-menarik",
    title: "7 Contoh Katalog Produk Online yang Menarik & Bikin Pembeli Percaya",
    description:
      "Kumpulan contoh katalog produk online yang menarik beserta elemen yang membuat pembeli percaya dan mau order. Plus tips meniru desainnya.",
    keywords: [
      "contoh katalog produk online",
      "contoh katalog online menarik",
      "desain katalog produk",
      "katalog produk yang menarik",
      "template katalog online"
    ],
    category: "Inspirasi",
    author: "Tim Linkatalog",
    publishedAt: "2026-05-28",
    readingMinutes: 5,
    coverImage: "/blog/contoh-katalog-produk-online-menarik-photo.png",
    coverAlt: "Tablet menampilkan katalog produk online rapi di samping produk yang ditata menarik",
    excerpt:
      "Katalog yang menarik bukan soal ramai, tapi soal kepercayaan. Lihat elemen dan contoh katalog per jenis usaha yang bikin pembeli yakin order.",
    content: [
      {
        type: "paragraph",
        text: "Katalog produk yang menarik tidak harus penuh hiasan. Justru katalog terbaik terasa bersih, mudah dibaca, dan membuat pembeli langsung percaya. Berikut elemen yang membuat katalog 'menjual', beserta contoh penerapannya untuk berbagai jenis usaha."
      },
      { type: "heading", level: 2, text: "Ciri katalog produk yang menarik dan dipercaya" },
      {
        type: "list",
        items: [
          "Foto produk konsisten: rasio sama, latar bersih, pencahayaan terang.",
          "Harga tercantum jelas pada setiap produk.",
          "Deskripsi singkat yang menjawab pertanyaan utama pembeli.",
          "Kategori yang rapi sehingga produk mudah ditemukan.",
          "Tombol order yang jelas dan mudah ditemukan."
        ]
      },
      { type: "heading", level: 2, text: "7 contoh katalog per jenis usaha" },
      { type: "heading", level: 3, text: "1. Fashion & pakaian" },
      {
        type: "paragraph",
        text: "Tampilkan foto produk dikenakan model atau di-flatlay rapi, sertakan ukuran dan bahan. Gunakan badge 'Best Seller' untuk item favorit."
      },
      { type: "heading", level: 3, text: "2. Makanan & minuman (F&B)" },
      {
        type: "paragraph",
        text: "Foto makanan yang menggugah selera adalah kunci. Kelompokkan menu per kategori (makanan utama, minuman, paket hemat) dan cantumkan ketersediaan."
      },
      { type: "heading", level: 3, text: "3. Jasa" },
      {
        type: "paragraph",
        text: "Tampilkan paket layanan beserta cakupan dan harga mulai. Sertakan contoh hasil atau portofolio agar pembeli yakin."
      },
      { type: "heading", level: 3, text: "4. Kecantikan & skincare" },
      {
        type: "paragraph",
        text: "Cantumkan manfaat utama dan cara pakai singkat. Foto kemasan yang bersih membangun kesan produk berkualitas."
      },
      { type: "heading", level: 3, text: "5. Produk digital" },
      {
        type: "paragraph",
        text: "Jelaskan isi dan format file dengan gamblang. Gunakan mockup agar produk yang tidak berwujud fisik tetap terlihat menarik."
      },
      { type: "heading", level: 3, text: "6. Reseller & dropship" },
      {
        type: "paragraph",
        text: "Susun produk dari berbagai supplier dalam kategori yang seragam supaya katalog tetap rapi meski sumbernya beragam."
      },
      { type: "heading", level: 3, text: "7. Kerajinan & produk custom" },
      {
        type: "paragraph",
        text: "Tunjukkan variasi dan opsi kustomisasi. Sertakan estimasi waktu pengerjaan agar ekspektasi pembeli jelas."
      },
      {
        type: "callout",
        title: "Elemen wajib",
        text: "Foto, deskripsi, harga, dan tombol order yang jelas. Empat hal ini adalah fondasi katalog yang menjual - selebihnya adalah penyempurnaan."
      },
      {
        type: "paragraph",
        text: "Kabar baiknya, semua contoh di atas bisa kamu buat sendiri secara gratis. Cukup susun produk dengan rapi, tambahkan foto yang konsisten, dan bagikan satu link katalogmu."
      }
    ],
    faq: [
      {
        question: "Apa elemen paling penting dari katalog yang menarik?",
        answer:
          "Foto yang konsisten dan harga yang jelas. Keduanya paling cepat membangun kepercayaan dan mendorong pembeli untuk order."
      }
    ]
  },
  {
    slug: "link-katalog-gratis",
    title: "Link Katalog Gratis: Solusi Jualan Online untuk UMKM Tanpa Website",
    seoTitle: "Link Katalog Gratis: Solusi Jualan Online untuk UMKM Tanpa Website",
    description:
      "Cari link katalog gratis untuk jualan? Pelajari manfaat, cara kerja, dan langkah memakai satu link katalog agar produkmu mudah dibuka dari Instagram, TikTok, dan WhatsApp.",
    keywords: [
      "link katalog gratis",
      "link katalog gratis untuk jualan",
      "link katalog gratis umkm",
      "katalog online gratis",
      "link katalog whatsapp"
    ],
    category: "Panduan",
    author: "Tim Linkatalog",
    publishedAt: "2026-06-01",
    updatedAt: "2026-06-01",
    readingMinutes: 6,
    coverImage: "/blog/link-katalog-gratis-photo.png",
    coverAlt: "Pemilik UMKM membagikan link katalog gratis dari ponsel di meja kerja kecil",
    excerpt:
      "Satu link katalog gratis bisa menggantikan kebiasaan kirim foto satu-satu di chat. Cocok untuk UMKM yang ingin jualan rapi tanpa website.",
    content: [
      {
        type: "paragraph",
        text: "Link katalog gratis adalah satu tautan yang menampilkan seluruh produkmu dalam satu halaman rapi. Ketika calon pembeli mengeklik link itu, mereka bisa langsung melihat foto, harga, deskripsi, lalu melanjutkan order tanpa kamu harus mengirim gambar satu per satu lewat chat."
      },
      { type: "heading", level: 2, text: "Apa itu link katalog gratis" },
      {
        type: "paragraph",
        text: "Sederhananya, link katalog gratis adalah alamat online untuk etalase jualanmu. Fungsinya mirip toko mini: semua produk dikumpulkan di satu tempat, mudah dibagikan, dan gampang dibuka dari HP. Ini sangat membantu UMKM yang ingin tampil rapi tanpa biaya website."
      },
      { type: "heading", level: 2, text: "Kenapa UMKM butuh satu link katalog" },
      {
        type: "paragraph",
        text: "Mayoritas pembeli datang dari media sosial, status WhatsApp, atau chat pribadi. Karena jalurnya serba cepat, mereka butuh akses instan ke daftar produk. Satu link katalog mempersingkat proses itu: klik, lihat produk, lalu order."
      },
      { type: "heading", level: 2, text: "Manfaat langsung saat pakai link katalog gratis" },
      {
        type: "list",
        items: [
          "Produk terlihat lebih profesional dibanding kirim foto campur aduk di chat.",
          "Calon pembeli bisa melihat banyak produk sekaligus tanpa menunggu balasan admin.",
          "Link yang sama bisa dipakai di Instagram, TikTok, status WhatsApp, dan chat pelanggan.",
          "Proses order lebih singkat karena pembeli sudah tahu produk yang ingin dibeli."
        ]
      },
      { type: "heading", level: 2, text: "Cara memakai link katalog gratis dengan efektif" },
      {
        type: "list",
        ordered: true,
        items: [
          "Susun profil toko dengan nama yang jelas, bio singkat, dan nomor WhatsApp aktif.",
          "Tambahkan produk dengan foto yang terang, harga yang terlihat, dan deskripsi ringkas.",
          "Salin link katalog lalu pasang di bio Instagram, bio TikTok, status WhatsApp, dan chat balasan cepat.",
          "Arahkan pembeli dengan ajakan yang spesifik, misalnya 'Lihat katalog lengkap di link ini'."
        ]
      },
      {
        type: "callout",
        title: "Tempat terbaik menaruh link",
        text: "Prioritaskan bio Instagram, bio TikTok, status WhatsApp, dan pesan otomatis WhatsApp Business. Empat titik ini paling sering dilihat calon pembeli yang sudah tertarik."
      },
      { type: "heading", level: 2, text: "Kesalahan yang bikin link katalog sepi klik" },
      {
        type: "list",
        items: [
          "Tidak menulis ajakan yang jelas, sehingga orang tidak tahu link itu untuk apa.",
          "Produk belum lengkap atau harga tidak dicantumkan.",
          "Nama toko dan foto produk terlihat tidak konsisten, jadi kepercayaan turun.",
          "Link ditempel hanya sekali, lalu tidak pernah disebut lagi di konten dan chat."
        ]
      },
      {
        type: "paragraph",
        text: "Kalau tujuanmu adalah membuat pembeli lebih cepat paham dan lebih cepat order, link katalog gratis adalah langkah paling ringan untuk memulainya. Kamu tidak perlu menunggu punya website besar dulu untuk terlihat profesional."
      }
    ],
    faq: [
      {
        question: "Apakah link katalog gratis berbeda dari website?",
        answer:
          "Ya. Website biasanya lebih kompleks dan mahal, sedangkan link katalog gratis fokus pada satu fungsi utama: menampilkan produk secara rapi dan memudahkan order."
      },
      {
        question: "Apakah satu link bisa dipakai di banyak platform?",
        answer:
          "Bisa. Kamu bisa memakai link yang sama di Instagram, TikTok, WhatsApp, Facebook, dan chat pelanggan agar promosi tetap konsisten."
      },
      {
        question: "Apa keyword paling penting yang perlu muncul di halaman katalog?",
        answer:
          "Gunakan nama toko, kategori produk, dan istilah yang benar-benar dicari pembeli, misalnya jenis produk, bahan, ukuran, atau manfaat utamanya."
      }
    ]
  },
  {
    slug: "template-katalog-online-gratis",
    title: "Template Katalog Online Gratis: Struktur yang Bikin Pembeli Cepat Paham",
    description:
      "Butuh template katalog online gratis? Pelajari susunan halaman, urutan produk, dan elemen wajib yang membuat katalog lebih rapi dan mudah closing.",
    keywords: [
      "template katalog online gratis",
      "template katalog produk online",
      "format katalog online",
      "susunan katalog produk",
      "link katalog gratis"
    ],
    category: "Template",
    author: "Tim Linkatalog",
    publishedAt: "2026-05-31",
    updatedAt: "2026-06-01",
    readingMinutes: 6,
    coverImage: "/blog/template-katalog-online-gratis-photo.png",
    coverAlt: "Pemilik bisnis menyusun template katalog online gratis di laptop dengan catatan produk",
    excerpt:
      "Katalog yang rapi biasanya punya susunan yang jelas. Berikut template katalog online gratis yang enak dibaca pembeli dan mudah kamu tiru.",
    content: [
      {
        type: "paragraph",
        text: "Banyak penjual sudah punya produk bagus, tetapi katalognya terasa berantakan karena urutannya tidak jelas. Padahal template katalog online gratis yang tepat bisa membantu pembeli memahami isi toko hanya dalam beberapa detik pertama."
      },
      { type: "heading", level: 2, text: "Kenapa template katalog penting" },
      {
        type: "paragraph",
        text: "Template membuat tampilan katalog lebih konsisten. Pembeli tidak perlu menebak-nebak di mana harga, kategori, atau produk unggulan berada. Semakin sedikit kebingungan, semakin besar peluang mereka melanjutkan ke order."
      },
      { type: "heading", level: 2, text: "Elemen wajib dalam template katalog online gratis" },
      {
        type: "list",
        items: [
          "Header profil toko berisi nama usaha, bio singkat, dan kontak.",
          "Produk unggulan di bagian atas untuk menangkap minat pembeli baru.",
          "Kategori yang jelas agar produk mudah dipilah.",
          "Kartu produk berisi foto, nama, harga, dan deskripsi singkat.",
          "Tombol order atau checkout yang mudah terlihat."
        ]
      },
      { type: "heading", level: 2, text: "Urutan template yang paling mudah dipakai" },
      {
        type: "list",
        ordered: true,
        items: [
          "Mulai dari identitas toko dan janji utama, misalnya jenis produk dan area layanan.",
          "Tampilkan 3 sampai 5 produk yang paling cepat laku atau paling sering ditanya.",
          "Setelah itu baru tampilkan kategori agar pembeli bisa menjelajah dengan cepat.",
          "Sisipkan produk lengkap dengan harga dan deskripsi singkat yang konsisten.",
          "Tutup dengan ajakan order yang jelas lewat WhatsApp."
        ]
      },
      {
        type: "callout",
        title: "Aturan paling penting",
        text: "Pastikan pembeli bisa memahami apa yang kamu jual, berapa harganya, dan bagaimana cara order, semuanya tanpa harus bertanya dulu lewat chat."
      },
      { type: "heading", level: 2, text: "Checklist sebelum template dipakai" },
      {
        type: "list",
        items: [
          "Foto produk sudah seragam dan cukup terang.",
          "Harga tidak disembunyikan.",
          "Kategori tidak terlalu banyak sehingga tetap mudah dipindai.",
          "Tombol order aktif dan mengarah ke nomor yang benar.",
          "Link katalog diuji dulu dari HP pembeli, bukan hanya dari dashboard."
        ]
      },
      {
        type: "paragraph",
        text: "Template yang baik bukan yang paling ramai, melainkan yang paling jelas. Jika kamu mulai dari struktur yang sederhana lalu konsisten di setiap produk, katalog akan terasa lebih profesional dan lebih mudah menghasilkan chat masuk."
      }
    ],
    faq: [
      {
        question: "Apakah template katalog online gratis harus punya banyak kategori?",
        answer:
          "Tidak. Pakai kategori secukupnya saja. Terlalu banyak kategori justru membuat pembeli lambat menemukan produk utama."
      },
      {
        question: "Apa produk unggulan harus selalu di atas?",
        answer:
          "Sebaiknya iya. Produk unggulan membantu pembeli baru memahami toko kamu lebih cepat dan memberi arah saat mereka pertama kali membuka link katalog."
      },
      {
        question: "Boleh tidak satu template dipakai untuk banyak jenis produk?",
        answer:
          "Boleh. Yang penting elemen intinya tetap sama: foto yang konsisten, harga jelas, deskripsi singkat, dan tombol order yang mudah ditemukan."
      }
    ]
  },
  {
    slug: "cara-promosi-link-katalog",
    title: "Cara Promosi Link Katalog Gratis di WhatsApp, Instagram, dan TikTok",
    description:
      "Langkah promosi link katalog gratis agar link tidak sepi klik. Cocok untuk UMKM, reseller, dan toko online yang ingin mendatangkan order harian.",
    keywords: [
      "cara promosi link katalog",
      "promosi link katalog gratis",
      "share link katalog whatsapp",
      "link katalog instagram",
      "link katalog tiktok"
    ],
    category: "Promosi",
    author: "Tim Linkatalog",
    publishedAt: "2026-05-30",
    updatedAt: "2026-06-01",
    readingMinutes: 6,
    coverImage: "/blog/cara-promosi-link-katalog-photo.png",
    coverAlt: "Penjual menyiapkan konten media sosial untuk mempromosikan link katalog",
    excerpt:
      "Link katalog bagus saja belum cukup. Kamu juga perlu cara promosi yang tepat supaya calon pembeli benar-benar klik dan lanjut order.",
    content: [
      {
        type: "paragraph",
        text: "Banyak seller sudah punya link katalog gratis, tetapi hasilnya belum terasa karena link itu hanya ditempel tanpa arahan. Padahal promosi yang efektif bukan sekadar membagikan link, melainkan memberi konteks kenapa orang harus mengekliknya sekarang."
      },
      { type: "heading", level: 2, text: "Kenapa link katalog sering sepi klik" },
      {
        type: "paragraph",
        text: "Biasanya ada tiga penyebab utama: tidak ada ajakan yang jelas, konten promosi tidak menyebut manfaat membuka link, atau link hanya muncul sekali lalu tenggelam. Pembeli butuh pengulangan dan alasan yang spesifik."
      },
      { type: "heading", level: 2, text: "Cara promosi di WhatsApp" },
      {
        type: "list",
        ordered: true,
        items: [
          "Pasang link di status WhatsApp dengan foto produk terbaik dan teks singkat.",
          "Gunakan balasan cepat untuk pertanyaan umum seperti harga, stok, dan katalog lengkap.",
          "Masukkan link saat follow-up pelanggan lama yang pernah bertanya tetapi belum order."
        ]
      },
      { type: "heading", level: 2, text: "Cara promosi di Instagram dan TikTok" },
      {
        type: "list",
        items: [
          "Taruh link di bio dan sebutkan 'cek katalog lengkap di bio' secara rutin di caption dan video.",
          "Arahkan Story atau video pendek ke produk unggulan, bukan ke semua produk sekaligus.",
          "Gunakan konten before-after, demo, atau testimoni agar orang punya alasan klik."
        ]
      },
      {
        type: "callout",
        title: "Formula CTA yang sederhana",
        text: "Gabungkan produk + manfaat + arahan. Contoh: 'Lihat warna lengkap dan harga terbaru di link katalog kami'. Ajakan seperti ini jauh lebih jelas daripada hanya menulis 'klik link'."
      },
      { type: "heading", level: 2, text: "Jadwal promosi yang aman agar tidak terasa spam" },
      {
        type: "list",
        items: [
          "Status WhatsApp: 1 sampai 3 kali sehari dengan produk berbeda.",
          "Instagram Story: sorot produk populer, promo, dan stok baru.",
          "TikTok atau Reels: fokus pada satu produk atau satu masalah pembeli per video.",
          "Chat follow-up: kirim hanya ke orang yang memang pernah menunjukkan minat."
        ]
      },
      {
        type: "paragraph",
        text: "Promosi link katalog yang efektif selalu menghubungkan konten dengan niat beli. Saat orang sudah tertarik oleh produk atau manfaatnya, link katalog menjadi langkah berikutnya yang terasa natural, bukan memaksa."
      }
    ],
    faq: [
      {
        question: "Lebih baik promosi link katalog lewat bio atau chat langsung?",
        answer:
          "Keduanya penting. Bio memudahkan pembeli baru menemukan katalog, sedangkan chat langsung efektif untuk orang yang sudah menunjukkan minat."
      },
      {
        question: "Seberapa sering link katalog perlu disebut di konten?",
        answer:
          "Cukup rutin, tetapi tetap relevan. Sebut link ketika kamu menampilkan produk, promo, atau stok baru agar audiens punya alasan untuk mengeklik."
      },
      {
        question: "Apakah caption panjang lebih efektif untuk promosi link?",
        answer:
          "Tidak selalu. Yang terpenting adalah jelas: produk apa yang ditawarkan, manfaatnya apa, dan tindakan berikutnya apa."
      }
    ]
  },
  {
    slug: "cara-foto-produk-untuk-katalog-online",
    title: "Cara Foto Produk untuk Katalog Online agar Terlihat Profesional",
    description:
      "Panduan foto produk untuk katalog online memakai HP saja. Hasil foto lebih terang, konsisten, dan bikin calon pembeli lebih percaya.",
    keywords: [
      "foto produk untuk katalog online",
      "cara foto produk jualan",
      "foto katalog online",
      "tips foto produk hp",
      "katalog produk menarik"
    ],
    category: "Visual",
    author: "Tim Linkatalog",
    publishedAt: "2026-05-29",
    updatedAt: "2026-06-01",
    readingMinutes: 6,
    coverImage: "/blog/cara-foto-produk-untuk-katalog-online-photo.png",
    coverAlt: "Pemilik usaha memotret produk dengan HP di mini studio sederhana",
    excerpt:
      "Foto yang terang dan konsisten bisa membuat katalog biasa terlihat jauh lebih meyakinkan. Kabar baiknya, kamu bisa mulai hanya dengan HP.",
    content: [
      {
        type: "paragraph",
        text: "Saat pembeli belum bisa memegang produkmu, foto menjadi sumber kepercayaan utama. Karena itu, kualitas foto produk sangat memengaruhi apakah katalog online terlihat meyakinkan atau justru terkesan asal-asalan."
      },
      { type: "heading", level: 2, text: "Kenapa foto produk sangat menentukan" },
      {
        type: "paragraph",
        text: "Foto membantu pembeli memahami bentuk, warna, ukuran, dan kualitas produk dalam hitungan detik. Kalau fotonya gelap, ramai, atau tidak konsisten, pembeli akan ragu walaupun produknya sebenarnya bagus."
      },
      { type: "heading", level: 2, text: "Peralatan minimum yang sudah cukup" },
      {
        type: "list",
        items: [
          "HP dengan kamera yang bersih lensanya.",
          "Cahaya alami dari jendela atau lampu putih yang merata.",
          "Latar polos, misalnya kertas putih, meja kayu bersih, atau kain netral.",
          "Satu alas atau properti sederhana yang tidak mencuri perhatian."
        ]
      },
      { type: "heading", level: 2, text: "Langkah memotret produk untuk katalog" },
      {
        type: "list",
        ordered: true,
        items: [
          "Bersihkan produk dan rapikan detail kecil seperti lipatan, debu, atau bekas jari.",
          "Tempatkan produk dekat sumber cahaya agar warna terlihat natural.",
          "Ambil beberapa sudut penting: depan, samping, detail tekstur, dan skala ukuran bila perlu.",
          "Pilih hasil yang paling jelas dan gunakan gaya framing yang konsisten untuk semua produk."
        ]
      },
      {
        type: "callout",
        title: "Rahasia katalog terlihat rapi",
        text: "Konsistensi jauh lebih penting daripada efek yang heboh. Gunakan rasio foto, jarak kamera, dan latar yang mirip di semua produk agar katalog terasa satu brand."
      },
      { type: "heading", level: 2, text: "Kesalahan yang paling sering terjadi" },
      {
        type: "list",
        items: [
          "Memotret dengan cahaya campur sehingga warna produk berubah.",
          "Latar belakang terlalu ramai dan membuat fokus pembeli pecah.",
          "Mengunggah foto dengan ukuran dan arah yang berbeda-beda.",
          "Terlalu banyak filter sampai warna produk tidak sesuai aslinya."
        ]
      },
      {
        type: "paragraph",
        text: "Kalau kamu belum punya studio atau kamera mahal, tidak masalah. Foto produk yang terang, bersih, dan konsisten sudah cukup untuk membuat katalog online terasa lebih profesional dan lebih siap menghasilkan order."
      }
    ],
    faq: [
      {
        question: "Apakah foto produk harus pakai kamera profesional?",
        answer:
          "Tidak. HP dengan pencahayaan yang baik sudah cukup untuk menghasilkan foto katalog yang rapi dan meyakinkan."
      },
      {
        question: "Latar belakang terbaik untuk foto katalog apa?",
        answer:
          "Latar polos atau netral biasanya paling aman karena fokus pembeli tetap ke produk, bukan ke dekorasi."
      },
      {
        question: "Berapa banyak foto ideal untuk satu produk?",
        answer:
          "Minimal 2 sampai 4 foto: tampak utama, detail penting, sisi lain, dan satu foto yang membantu pembeli membayangkan ukuran atau pemakaian."
      }
    ]
  },
  {
    slug: "cara-menulis-deskripsi-produk-katalog-online",
    title: "Cara Menulis Deskripsi Produk untuk Katalog Online yang Bikin Orang Mau Chat",
    description:
      "Pelajari cara menulis deskripsi produk untuk katalog online agar pembeli cepat paham, percaya, dan lebih terdorong menghubungi WhatsApp untuk order.",
    keywords: [
      "deskripsi produk katalog online",
      "cara menulis deskripsi produk",
      "deskripsi produk yang menjual",
      "copywriting katalog online",
      "link katalog gratis"
    ],
    category: "Copywriting",
    author: "Tim Linkatalog",
    publishedAt: "2026-05-27",
    updatedAt: "2026-06-01",
    readingMinutes: 6,
    coverImage: "/blog/cara-menulis-deskripsi-produk-katalog-online-photo.png",
    coverAlt: "Pemilik usaha menulis deskripsi produk katalog online di laptop",
    excerpt:
      "Deskripsi produk yang baik tidak perlu panjang. Yang penting cepat menjawab pertanyaan pembeli dan membuat mereka berani lanjut chat.",
    content: [
      {
        type: "paragraph",
        text: "Banyak deskripsi produk terlalu singkat sehingga pembeli bingung, atau terlalu panjang sampai inti manfaatnya tenggelam. Padahal deskripsi produk untuk katalog online punya tugas sederhana: membantu pembeli cepat paham lalu berani order."
      },
      { type: "heading", level: 2, text: "Apa fungsi deskripsi produk di katalog online" },
      {
        type: "paragraph",
        text: "Deskripsi bukan sekadar pelengkap foto. Teks ini menjawab pertanyaan paling umum pembeli: apa produknya, siapa yang cocok, ukuran atau variannya apa, dan kenapa produk ini layak dibeli sekarang."
      },
      { type: "heading", level: 2, text: "Rumus deskripsi yang mudah dipakai" },
      {
        type: "list",
        ordered: true,
        items: [
          "Mulai dari nama produk yang jelas dan mudah dicari.",
          "Sebut manfaat utama dalam satu kalimat sederhana.",
          "Tambahkan detail penting seperti ukuran, bahan, warna, isi paket, atau cara pakai.",
          "Tutup dengan konteks pemakaian atau alasan membeli, misalnya cocok untuk hadiah atau stok harian."
        ]
      },
      {
        type: "quote",
        text: "Pembeli jarang mencari deskripsi yang puitis. Mereka lebih sering mencari jawaban cepat yang membuat keputusan terasa aman."
      },
      { type: "heading", level: 2, text: "Hal yang sebaiknya selalu ada" },
      {
        type: "list",
        items: [
          "Ukuran atau volume produk.",
          "Bahan atau komposisi utama bila relevan.",
          "Pilihan warna, aroma, rasa, atau varian.",
          "Info penting seperti ready stock, preorder, atau estimasi kirim."
        ]
      },
      {
        type: "callout",
        title: "Tulis seperti menjawab chat",
        text: "Gunakan bahasa yang natural dan mudah dipahami, seolah kamu sedang menjawab pertanyaan pelanggan. Ini membuat deskripsi lebih dekat, jelas, dan tidak terasa kaku."
      },
      { type: "heading", level: 2, text: "Kesalahan yang membuat deskripsi tidak efektif" },
      {
        type: "list",
        items: [
          "Hanya menulis nama produk tanpa manfaat atau detail penting.",
          "Memakai istilah yang terlalu umum seperti 'bagus' atau 'premium' tanpa penjelasan.",
          "Menyembunyikan informasi penting seperti ukuran, bahan, atau isi paket.",
          "Terlalu panjang sampai pembeli sulit memindai poin utamanya."
        ]
      },
      {
        type: "paragraph",
        text: "Deskripsi produk yang baik akan mengurangi chat berulang, menaikkan kepercayaan, dan membantu pembeli lebih cepat menentukan pilihan. Jika katalogmu sudah punya foto bagus, deskripsi yang jelas akan menjadi pasangan yang sangat kuat."
      }
    ],
    faq: [
      {
        question: "Apakah deskripsi produk harus panjang?",
        answer:
          "Tidak. Yang penting jelas dan lengkap di bagian yang memang dibutuhkan pembeli. Deskripsi singkat tetapi informatif biasanya lebih efektif."
      },
      {
        question: "Apa lebih baik fokus ke manfaat atau spesifikasi?",
        answer:
          "Idealnya gabungan keduanya. Manfaat membuat produk terasa relevan, sedangkan spesifikasi membuat pembeli merasa keputusan mereka aman."
      },
      {
        question: "Bolehkah satu deskripsi dipakai untuk semua platform?",
        answer:
          "Boleh sebagai dasar, tetapi sebaiknya disesuaikan sedikit. Untuk katalog online, utamakan kejelasan dan kemudahan dipindai."
      }
    ]
  }
];

/** Urutkan dari yang terbaru. */
function byNewest(a: BlogPost, b: BlogPost) {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

export async function getAllPosts(): Promise<BlogPost[]> {
  return [...POSTS].sort(byNewest);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return POSTS.find((post) => post.slug === slug) ?? null;
}

export async function getAllSlugs(): Promise<string[]> {
  return POSTS.map((post) => post.slug);
}

export async function getRelatedPosts(slug: string, limit = 2): Promise<BlogPost[]> {
  return [...POSTS].filter((post) => post.slug !== slug).sort(byNewest).slice(0, limit);
}

/** Format tanggal ISO ke gaya Indonesia, mis. "12 Mei 2026". */
export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

