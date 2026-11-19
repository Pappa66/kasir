# Kasir Toko Putra Nusantara 18 — Prototipe

Demo statis (Vue 3 + Vite + Tailwind) untuk aplikasi kasir & stok toko kelontong.
Data contoh, tanpa backend, tanpa penyimpanan permanen.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # hasil di dist/
npm run preview  # cek hasil build
```

## Halaman

| Halaman | Isi |
| --- | --- |
| Dashboard | Ringkasan hari ini, stok menipis, mendekati expired, produk terlaris, transaksi terakhir |
| Kasir | Cari/scan barcode, keranjang (qty desimal kg, batas stok), pembayaran tunai, struk 58/80 mm, cetak |
| Produk | Daftar 25 produk, cari/filter kategori, tambah & ubah produk, status stok |
| Stok Masuk | Dokumen penerimaan, detail dokumen, buat draft, terima barang |
| Invoice | Riwayat transaksi, filter selesai/void, cari, muat bertahap |
| Detail Invoice | Rincian item, ringkasan bayar, pratinjau struk, cetak ulang, void dengan alasan |
| Stock Opname | Daftar sesi, lembar hitung fisik, selisih + alasan wajib, posting dengan PIN pemilik |
| Laporan | Penjualan per jam & per kasir, nilai stok, produk terlaris, kategori |
| Pengaturan | Identitas toko, lebar struk, tes cetak, daftar pengguna, muat ulang data |
| Panduan | Alur demo 3 menit, tabel hak akses, catatan perangkat, mulai tur interaktif |
| Akses terbatas | Halaman pengganti saat kasir membuka modul pemilik; tombol masuk sebagai pemilik |

## Peran demo

Hanya ada dua peran sesuai spesifikasi: **Pemilik** (semua modul) dan **Kasir**
(Kasir, Produk lihat saja, Invoice, Panduan). Tiga akun contoh: H. Ahmad
(Pemilik), Siti dan Rina (Kasir). Ganti peran lewat dropdown nama di kanan atas.

- Kasir tidak melihat menu Dashboard, Stok Masuk, Opname, Laporan, Pengaturan.
- URL modul pemilik yang dibuka langsung diarahkan ke `/akses-terbatas?dari=...`;
  setelah masuk sebagai pemilik, halaman tujuan dibuka kembali.
- Produk untuk kasir: tanpa tambah/import/ubah, tanpa harga beli dan nilai stok.
- Void invoice hanya muncul untuk pemilik; kasir hanya bisa melihat dan mencetak.
- Transaksi baru mencatat nama pengguna aktif sebagai kasir.
- Ini simulasi, bukan autentikasi. Pilihan peran tersimpan di sessionStorage.

## Tur interaktif

Tombol **Tur** di topbar (dan **Mulai tur interaktif** di Panduan) menjalankan 6
langkah: menu, ganti peran, pencarian/scan, keranjang, pembayaran, dan struk.
Navigasi lewat Lanjut/Kembali/Lewati, panah kiri-kanan, atau Esc. Tur berpindah
ke halaman Kasir sendiri, menyorot elemen terkait, dan menghormati
`prefers-reduced-motion`.

## Label add-on

Aplikasi membedakan **paket dasar** dan **add-on** tanpa menampilkan harga di
dalam demo:

- Paket dasar: Kasir, Produk, Stok Masuk, Invoice, Opname, Laporan,
  Pengaturan, dan peran Pemilik/Kasir.
- Add-on: piutang/bon, batch expired/FEFO, kirim struk WhatsApp, export
  Excel/PDF. Label `ADD-ON` netral menandai fitur tambahan; penjelasan
  lengkap ada di Panduan, tanpa angka harga.
- Harga dan paket komersial dibahas terpisah, bukan di UI prototipe.

## Struktur penting

```
src/
  data/adapter.js      ← SATU-SATUNYA pintu data. Ganti isi file ini dengan
                          panggilan API/Inertia Laravel; komponen tidak berubah.
  data/*.json          ← data contoh (25 produk, 68 transaksi, supplier, opname)
  stores/              ← Pinia: keranjang, toko, ui (toast), opname, cetak,
                          sesi (peran demo), tour (langkah tur)
  components/          ← AppShell, StrukPreview, CetakStruk, Modal, ToastHost,
                          PrototypeBanner, EmptyState, TourGuide
  pages/               ← 10 halaman + 2 halaman detail
  style.css            ← token warna, tabel, tombol, aturan cetak
```

## Catatan demo

- Tanggal demo dipaku di `HARI_INI = '2026-11-19'` (`src/data/adapter.js`).
- Jam pada struk memakai jam asli komputer.
- Banner "Prototipe — data contoh, belum tersimpan" selalu tampil.
- Perubahan (transaksi baru, void, produk, opname, pengaturan) hanya bertahan
  selama tab terbuka; muat ulang mengembalikan data contoh.
- Lebar struk bisa diganti 58/80 mm dari dialog setelah pembayaran atau dari
  Pengaturan.
- Barcode gun USB bekerja sebagai keyboard: fokus otomatis di kolom cari,
  karakter + Enter langsung menambah barang.
- Posting opname memakai PIN pemilik demo `1234`; setiap selisih wajib beralasan.
- Tombol Cetak menyalin struk ke `#cetak-root` lalu memanggil `window.print()`,
  sehingga hanya struk yang tercetak (satu halaman). Salinan itu disembunyikan
  di layar dan hanya muncul saat media print. Ukuran kertas mengikuti driver
  printer (disarankan printer thermal 58/80 mm diset sebagai default).

## Data contoh

- 25 produk: beras 5/10/25 kg, gula curah desimal, Indomie karton→pcs,
  susu mendekati expired, gas tabung, dll.
- 68 transaksi tanggal 19/11/2026: 67 selesai + 1 void.
- Omzet contoh Rp 3.999.775, rata-rata Rp 59.698 per transaksi.

## Deploy

`npm run build` lalu unggah `dist/` (Vercel/Netlify/Cloudflare Pages).
Vercel Hobby untuk demo saja — bukan untuk produksi komersial.
