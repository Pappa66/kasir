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

## Struktur penting

```
src/
  data/adapter.js      ← SATU-SATUNYA pintu data. Ganti isi file ini dengan
                          panggilan API/Inertia Laravel; komponen tidak berubah.
  data/*.json          ← data contoh (25 produk, 68 transaksi, supplier, opname)
  stores/              ← Pinia: keranjang, toko, ui (toast), opname, cetak
  components/          ← AppShell, StrukPreview, CetakStruk, Modal, ToastHost,
                          PrototypeBanner, EmptyState
  pages/               ← 8 halaman + 2 halaman detail
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
  sehingga hanya struk yang tercetak (satu halaman). Ukuran kertas mengikuti
  driver printer (disarankan printer thermal 58/80 mm diset sebagai default).

## Data contoh

- 25 produk: beras 5/10/25 kg, gula curah desimal, Indomie karton→pcs,
  susu mendekati expired, gas tabung, dll.
- 68 transaksi tanggal 19/11/2026: 67 selesai + 1 void.
- Omzet contoh Rp 3.999.775, rata-rata Rp 59.698 per transaksi.

## Deploy

`npm run build` lalu unggah `dist/` (Vercel/Netlify/Cloudflare Pages).
Vercel Hobby untuk demo saja — bukan untuk produksi komersial.
