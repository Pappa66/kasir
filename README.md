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
| Detail Invoice | Rincian item, status bon, pelunasan, tautan publik, WA, CSV, cetak ulang, void berjenjang dengan alasan |
| Piutang & Bon (add-on) | Bon berjalan, lewat tempo, pelunasan sebagian/penuh |
| Kedaluwarsa & FEFO (add-on) | Batch per tanggal expired, sisa hari, nilai berisiko, tarik batch dari rak |
| Invoice publik | Halaman tanpa shell untuk pelanggan; divalidasi token demo, bisa dicetak |
| Stock Opname | Daftar sesi, lembar hitung fisik, selisih + alasan wajib, posting dengan PIN pemilik |
| Laporan | Rekap Harian/Mingguan/Bulanan, tanggal lampau bisa dibuka, omzet/HPP/laba, per jam atau per hari, per kasir, kanal tunai/QRIS, void, nilai stok, ekspor CSV/PDF |
| Pengaturan | Identitas toko, lebar struk, tes cetak, pengguna, kategori & satuan produk, muat ulang data |
| Panduan | Alur demo 3 menit, 15 bab tur, tabel hak akses, catatan perangkat, tur otomatis |
| Panduan memilih | Perbandingan pilihan aplikasi, kelebihan/kekurangan jujur, checklist untuk penjual mana pun |
| Jejak aktivitas | Catatan siapa melakukan apa (void, ubah harga, opname, pelunasan), filter + ekspor; khusus pemilik |
| Pilihan tampilan | Perbandingan tiga tema demo (Kasir, Brutal, Elegan) berdampingan |
| Akses terbatas | Halaman pengganti saat kasir membuka modul pemilik; tombol masuk sebagai pemilik |

## Peran demo

Hanya ada dua peran sesuai spesifikasi: **Pemilik** (semua modul) dan **Kasir**
(Kasir, Produk lihat saja, Invoice, Piutang/bon, Panduan). Tiga akun contoh: H. Ahmad
(Pemilik), Siti dan Rina (Kasir). Masuk lewat halaman `/login` dengan memilih
peran; setelah itu peran bisa diganti lewat dropdown nama di kanan atas.

Di aplikasi asli, pemilik membuat akun kasir (nama, peran, PIN) dari
Pengaturan. Paket dasar dibatasi 3 akun: 1 pemilik + 2 kasir. Akun awal saat
serah terima adalah H. Ahmad, Siti, dan Rina; nama serta PIN bisa diganti
pemilik, sedangkan kasir tidak bisa membuat akun. Demo ini tidak menyimpan akun
baru dan cukup memilih peran.

- Login hanya simulasi: tanpa kata sandi, status masuk disimpan di
  `sessionStorage` sehingga hilang saat tab ditutup. Tombol Keluar kembali ke
  `/login`.
- Kasir tidak melihat menu Dashboard, Stok Masuk, Opname, Laporan, Pengaturan,
  dan Kedaluwarsa.
- URL modul pemilik yang dibuka langsung diarahkan ke `/akses-terbatas?dari=...`;
  setelah masuk sebagai pemilik, halaman tujuan dibuka kembali.
- Produk untuk kasir: tanpa tambah/import/ubah, tanpa harga beli dan nilai stok.
- Void berjenjang. Kasir boleh void transaksi hari ini, maksimal 15 menit setelah
  transaksi, maksimal 3 kali sehari, dan bukan bon yang sudah dibayar. Void di atas
  Rp 100.000 tetap bisa tetapi ditandai **perlu tinjauan** pemilik. Pemilik tidak
  dibatasi. Tidak ada PIN pemilik: pemilik tidak selalu berada di toko.
- Jejak aktivitas hanya bisa dibaca pemilik. Setiap void, ubah harga, opname, dan
  pelunasan bon menulis catatan baru; catatan tidak bisa dihapus dari aplikasi.
- Kasir boleh membuka Piutang dan mencatat pelunasan bon; tarik batch expired
  tetap untuk pemilik.
- Transaksi baru mencatat nama pengguna aktif sebagai kasir.
- Pembayaran memakai dua kanal: tunai dan QRIS statis toko. QRIS hanya label
  pencatatan uang masuk (nominal mengikuti total, konfirmasi lewat notifikasi
  speaker); tidak ada QRIS dinamis, kartu, atau transfer dengan bukti.
- Halaman `/publik/:nomor?token=...` sengaja melewati guard login dan peran
  karena dibuka pelanggan; isinya hanya divalidasi token demo.

## Tur interaktif

Tombol **Tur** menjalankan tur lengkap dari menu sampai pilihan tampilan:
**15 bab / 80 langkah untuk pemilik**, dan **8 bab / 43 langkah untuk kasir**.
Bab milik pemilik (Dashboard, Stok Masuk, Kedaluwarsa, Opname, Laporan, Jejak,
Pengaturan) otomatis dilewati untuk kasir, jadi tur tidak pernah membuka halaman
yang bukan haknya. Tombol tanda tanya di topbar menjelaskan halaman yang sedang
dibuka (di layar kecil tombol ini disembunyikan; daftar bab ada di Panduan), dan
Panduan punya daftar bab yang bisa dijalankan sendiri-sendiri.
Navigasi lewat Lanjut/Kembali/Lewati, panah kiri-kanan, atau Esc. Tur berpindah
halaman sendiri, menyorot elemen terkait, dan menghormati
`prefers-reduced-motion`. Di HP kartu tur menjadi panel bawah yang lebar agar
mudah dijangkau; bila target tidak tersedia di layar kecil (mis. tombol khusus
desktop), kartu tampil tanpa sorotan.

Tur juga berjalan otomatis sekali per tab saat demo pertama dibuka, tetapi hanya
bab pengantar (6 langkah untuk kasir, 8 untuk pemilik), bukan seluruh tur. Bisa dimatikan dari Panduan;
tombol Tur tetap tersedia. Tur otomatis tidak muncul di halaman invoice publik.

## Laporan

Laporan punya tiga mode rekap: **Harian** (satu hari, rincian per jam), **Mingguan**
(Senin–Minggu, rincian per hari), dan **Bulanan** (satu bulan kalender, rincian per
hari). Panah sebelumnya/berikutnya berpindah periode; tanggal setelah hari demo
(19 November 2026) tidak bisa dipilih, tetapi tanggal dan periode lampau tetap bisa
dibuka kembali. Hari tanpa transaksi tampil sebagai baris nol, bukan hilang.

Di atas rekap ada perbandingan dengan periode sebelumnya dalam nominal rupiah dan
jumlah transaksi (mis. “Omzet +Rp 4.202.275”). Nilai turun ditampilkan dengan tanda
minus, dan bila periode pembanding kosong dipakai “—”. Ekspor CSV dan cetak PDF
mengikuti label periode yang sedang dibuka.

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
- Angka kecil di samping label `ADD-ON` pada menu adalah jumlah data yang perlu
  ditangani saat itu (mis. bon berjalan atau batch mendekati expired), bukan
  jumlah add-on yang dibeli. Panduan menjelaskan arti angka tersebut per menu.
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
  data/*.json          ← data contoh (25 produk, 71 transaksi hari ini + 299
                          riwayat, 15 batch, supplier, stok masuk, opname)
  stores/              ← Pinia: keranjang (tunai/bon), toko, ui (toast),
                          opname, cetak, sesi (peran demo), tour (langkah tur)
  components/          ← AppShell, StrukPreview, CetakStruk, Modal, ToastHost,
                          PrototypeBanner, EmptyState, TourGuide, AddonTag,
                          KirimWA
  lib/                 ← format, ekspor (CSV/WA), pesan (template WhatsApp)
  pages/               ← halaman aplikasi, detail invoice, publik, jejak, tema
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
- Void memakai jam demo (transaksi terakhir + 5 menit) supaya batas 15 menit pada
  data contoh tetap bisa diuji.
- Kategori dan satuan produk diatur di Pengaturan. Kategori/satuan yang masih
  dipakai produk tidak bisa dihapus.
- Tema disimpan di `localStorage['demo-tema']` dan hanya mengubah tampilan;
  warna status serta struk thermal tetap sama di semua tema.
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
  sehingga hanya struk yang tercetak. Struk panjang tercetak bersambung di
  kertas thermal dan baris barang tidak dipotong di tengah halaman. Salinan itu disembunyikan
  di layar dan hanya muncul saat media print. Ukuran kertas mengikuti driver
  printer (disarankan printer thermal 58/80 mm diset sebagai default).

## Data contoh

- 25 produk: beras 5/10/25 kg, gula curah desimal, Indomie karton→pcs,
  susu mendekati expired, gas tabung, dll.
- 15 batch FEFO untuk produk ber-expired.
- 71 transaksi tanggal 19/11/2026: 67 selesai tunai, 3 bon, 1 void.
- Riwayat contoh 1 September–18 November 2026 (299 transaksi, termasuk 5 void dan
  2 bon belum lunas) dipakai untuk menguji rekap mingguan/bulanan dan tanggal
  lampau. Hari Minggu sengaja kosong.
- Omzet contoh mengikuti data transaksi di `penjualan.json` dan `riwayat.json`.

## Deploy

`npm run build` lalu unggah `dist/` (Vercel/Netlify/Cloudflare Pages).
Vercel Hobby untuk demo saja — bukan untuk produksi komersial.
