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
| Login | Halaman masuk dummy: pilih Pemilik atau Kasir, tanpa kata sandi |
| Kasir | Cari/scan barcode, keranjang (qty desimal kg, batas stok), pembayaran tunai atau QRIS statis toko, struk 58/80 mm, cetak |
| Produk | Daftar 25 produk, cari/filter kategori, tambah & ubah produk, status stok |
| Stok Masuk | Dokumen penerimaan, detail dokumen, buat draft, terima barang |
| Invoice | Riwayat transaksi, filter lunas/bon/void, cari, ekspor CSV |
| Detail Invoice | Rincian item, status bon, pelunasan, tautan publik, WA, CSV, cetak ulang, void dengan alasan |
| Piutang & Bon (add-on) | Bon berjalan, lewat tempo, pelunasan sebagian/penuh |
| Kedaluwarsa & FEFO (add-on) | Batch per tanggal expired, sisa hari, nilai berisiko, tarik batch dari rak |
| Invoice publik | Halaman tanpa shell untuk pelanggan; divalidasi token demo, bisa dicetak |
| Stock Opname | Daftar sesi, lembar hitung fisik, selisih + alasan wajib, posting dengan PIN pemilik |
| Laporan | Omzet, HPP, laba kotor/bersih, penjualan per jam (klik untuk rincian item), per kasir, kanal tunai/QRIS, nilai stok, ekspor CSV/PDF |
| Pengaturan | Identitas toko, lebar struk, tes cetak, daftar pengguna, muat ulang data |
| Panduan | Alur demo 3 menit, tabel hak akses, catatan perangkat, mulai tur interaktif |
| Panduan memilih | Perbandingan pilihan aplikasi, kelebihan/kekurangan jujur, checklist untuk penjual mana pun |
| Akses terbatas | Halaman pengganti saat kasir membuka modul pemilik; tombol masuk sebagai pemilik |

## Peran demo

Hanya ada dua peran sesuai spesifikasi: **Pemilik** (semua modul) dan **Kasir**
(Kasir, Produk lihat saja, Invoice, Piutang/bon, Panduan). Tiga akun contoh: H. Ahmad
(Pemilik), Siti dan Rina (Kasir). Masuk lewat halaman `/login` dengan memilih
peran; setelah itu peran bisa diganti lewat dropdown nama di kanan atas.

- Login hanya simulasi: tanpa kata sandi, status masuk disimpan di
  `sessionStorage` sehingga hilang saat tab ditutup. Tombol Keluar kembali ke
  `/login`.
- Kasir tidak melihat menu Dashboard, Stok Masuk, Opname, Laporan, Pengaturan,
  dan Kedaluwarsa.
- URL modul pemilik yang dibuka langsung diarahkan ke `/akses-terbatas?dari=...`;
  setelah masuk sebagai pemilik, halaman tujuan dibuka kembali.
- Produk untuk kasir: tanpa tambah/import/ubah, tanpa harga beli dan nilai stok.
- Void invoice hanya muncul untuk pemilik; kasir hanya bisa melihat dan mencetak.
- Kasir boleh membuka Piutang dan mencatat pelunasan bon; tarik batch expired
  tetap untuk pemilik.
- Transaksi baru mencatat nama pengguna aktif sebagai kasir.
- Pembayaran memakai dua kanal: tunai dan QRIS statis toko. QRIS hanya label
  pencatatan uang masuk (nominal mengikuti total, konfirmasi lewat notifikasi
  speaker); tidak ada QRIS dinamis, kartu, atau transfer dengan bukti.
- Halaman `/publik/:nomor?token=...` sengaja melewati guard login dan peran
  karena dibuka pelanggan; isinya hanya divalidasi token demo.

## Tur interaktif

Tombol **Tur** di topbar (dan **Mulai tur interaktif** di Panduan) menjalankan 6
langkah: menu, ganti peran, pencarian/scan, keranjang, pembayaran, dan struk.
Navigasi lewat Lanjut/Kembali/Lewati, panah kiri-kanan, atau Esc. Tur berpindah
ke halaman Kasir sendiri, menyorot elemen terkait, dan menghormati
`prefers-reduced-motion`.

Tur juga berjalan otomatis sekali per tab saat demo pertama dibuka. Bisa
dimatikan dari Panduan; tombol Tur tetap tersedia. Tur otomatis tidak muncul di
halaman invoice publik.

## Label add-on

Aplikasi membedakan **paket dasar** dan **add-on** tanpa menampilkan harga di
dalam demo:

- Paket dasar: Kasir, Produk, Stok Masuk, Invoice, Opname, Laporan,
  Pengaturan, dan peran Pemilik/Kasir.
- Add-on: piutang/bon, batch expired/FEFO, kirim struk WhatsApp, export
  Excel/PDF. Label `ADD-ON` netral menandai fitur tambahan; penjelasan
  lengkap ada di Panduan, tanpa angka harga.
- Jumlah add-on perangkat lunak ada empat. Setup thermal, input data awal,
  dan maintenance adalah layanan pendampingan, bukan fitur yang muncul di
  menu aplikasi.
- Semua add-on sudah berfungsi di demo:
  - **Piutang/bon** — metode Bon di Kasir (DP, nomor HP, jatuh tempo),
    pelunasan di `/piutang` atau detail invoice, sisa bon ikut di struk.
  - **Expired/FEFO** — batch dari penerimaan barang, penjualan memotong batch
    terdekat, batch expired bisa ditarik dan stok ikut berkurang.
  - **WhatsApp** — modal pesan terisi, membuka `wa.me`; tidak ada API dan
    tidak mengirim otomatis.
  - **Export** — CSV ber-BOM (aman dibuka di Excel) dan cetak PDF satu
    halaman untuk laporan/invoice.
- Harga dan paket komersial dibahas terpisah, bukan di UI prototipe.

## Struktur penting

```
src/
  data/adapter.js      ← SATU-SATUNYA pintu data. Ganti isi file ini dengan
                          panggilan API/Inertia Laravel; komponen tidak berubah.
  data/*.json          ← data contoh (25 produk, 71 transaksi, 15 batch,
                          supplier, stok masuk, opname)
  stores/              ← Pinia: keranjang (tunai/bon), toko, ui (toast),
                          opname, cetak, sesi (peran demo), tour (langkah tur)
  components/          ← AppShell, StrukPreview, CetakStruk, Modal, ToastHost,
                          PrototypeBanner, EmptyState, TourGuide, AddonTag,
                          KirimWA
  lib/                 ← format, ekspor (CSV/WA), pesan (template WhatsApp)
  pages/               ← 12 halaman + 4 halaman detail/publik
  style.css            ← token warna, tabel, tombol, aturan cetak
```

## Catatan demo

- Tanggal demo dipaku di `HARI_INI = '2026-11-19'` (`src/data/adapter.js`).
- Jam pada struk memakai jam asli komputer.
- Banner "Prototipe — data contoh, belum tersimpan" selalu tampil.
- Perubahan (transaksi baru, void, pelunasan bon, produk, batch, opname,
  pengaturan) hanya bertahan selama tab terbuka; muat ulang mengembalikan data
  contoh.
- Penjualan memotong stok dan batch FEFO; void mengembalikan keduanya.
- Menerima dokumen Stok Masuk menambah stok dan membuat batch bila tanggal
  expired diisi.
- Tautan invoice publik berbentuk `/#/publik/<nomor>?token=<token demo>` dan
  ditolak bila token tidak cocok.
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
- 15 batch FEFO untuk produk ber-expired.
- 71 transaksi tanggal 19/11/2026: 67 selesai tunai, 3 bon, 1 void.
- Omzet contoh mengikuti data transaksi di `penjualan.json`.

## Deploy

`npm run build` lalu unggah `dist/` (Vercel/Netlify/Cloudflare Pages).
Vercel Hobby untuk demo saja — bukan untuk produksi komersial.
