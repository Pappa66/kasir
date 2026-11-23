// Isi tur interaktif. Satu bab = satu halaman/topik.
// target: selector CSS yang disorot. rute: halaman yang dibuka dulu.
const s = (target, judul, isi, posisi = 'bawah') => ({ target, judul, isi, posisi })
const sP = (...a) => ({ ...s(...a), peran: ['pemilik'] })

export const BAB_TUR = [
  {
    id: 'mulai',
    judul: 'Mulai & peran',
    ket: 'Menu, peran, tema, dan tombol bantuan.',
    langkah: [
      s('[data-tour="menu"]', 'Satu aplikasi, semua pekerjaan', 'Menu di kiri adalah peta aplikasi. Pemilik melihat semua modul; kasir hanya melihat Kasir, Produk, Invoice, Piutang, Panduan, dan Pilihan tampilan.'),
      s('[data-tour="lencana"]', 'Label ADD-ON dan angkanya', 'Label ADD-ON menandai fitur tambahan di luar paket dasar. Angka di sampingnya adalah jumlah yang menunggu tindakan di modul itu: Piutang menghitung bon berjalan, Kedaluwarsa menghitung batch expired atau segera. Modul tanpa label add-on tidak memakai angka ini.'),
      s('[data-tour="peran"]', 'Ganti peran tanpa keluar', 'Klik nama pengguna di kanan atas untuk masuk sebagai Pemilik, Kasir Siti, atau Kasir Rina. Menu dan tombol langsung menyesuaikan.'),
      s('[data-tour="tema"]', 'Tiga arah tampilan', 'Tombol palet mengganti tampilan antara Kasir, Brutal, dan Elegan. Ini alat demo untuk memilih arah desain; data dan alur tidak berubah.'),
      s('[data-tour="bantuan"]', 'Bantuan per halaman', 'Tombol tanda tanya menjelaskan halaman yang sedang dibuka. Cocok saat staf baru bertanya “ini untuk apa?”.'),
      s('[data-tour="tur"]', 'Tur lengkap 15 bab', 'Tombol Tur memandu seluruh aplikasi dari awal. Tur bisa dihentikan kapan saja dengan Esc atau tombol Lewati.'),
      { ...sP('main h2', 'Dashboard pemilik', 'Halaman pertama setelah masuk adalah ringkasan hari ini: omzet, transaksi, rata-rata, dan item terjual.'), rute: '/dashboard' },
      { ...sP('[data-tour="dash-kpi"]', 'Empat angka utama', 'Angka dihitung dari transaksi sah hari ini. Transaksi void tidak ikut omzet, tetapi jumlahnya tetap terlihat.'), rute: '/dashboard' },
    ],
  },
  {
    id: 'dashboard',
    judul: 'Dashboard',
    ket: 'Ringkasan omzet, stok kritis, dan aktivitas.',
    rute: '/dashboard',
    peran: ['pemilik'],
    langkah: [
      s('[data-tour="dash-kpi"]', 'Ringkasan hari ini', 'Omzet, jumlah transaksi, rata-rata per transaksi, dan item terjual. Semua memakai data contoh tanggal demo.'),
      s('[data-tour="dash-perhatian"]', 'Tiga hal yang perlu perhatian', 'Stok kritis, batch mendekati kedaluwarsa, dan bon berjalan. Klik kartu kedaluwarsa atau bon untuk langsung membuka halamannya.'),
      s('[data-tour="dash-terlaris"]', 'Produk terlaris', 'Diurutkan dari omzet, bukan jumlah unit. Berguna untuk memutuskan barang apa yang harus selalu ada.'),
      s('[data-tour="dash-terakhir"]', 'Transaksi terakhir', 'Klik satu baris untuk membuka invoice. Dari sana pemilik bisa mencetak ulang, mengirim WhatsApp, atau mem-void.'),
      s('[data-tour="dash-perlu"]', 'Perlu dipesan', 'Daftar produk yang stoknya di bawah minimum. Ini pengingat belanja, bukan pesanan otomatis ke supplier.'),
    ],
  },
  {
    id: 'kasir',
    judul: 'Kasir',
    ket: 'Scan, keranjang, bayar tunai/QRIS, dan bon.',
    rute: '/kasir',
    langkah: [
      s('[data-tour="cari"]', 'Cari atau scan barang', 'Ketik nama atau kode, atau tembakkan barcode gun USB. Tekan Enter untuk menambah ke keranjang. Kolom ini otomatis fokus saat halaman dibuka.'),
      s('[data-tour="keranjang"]', 'Keranjang', 'Setiap barang masuk ke sini. Tombol Kosongkan menghapus semua item; ikon silang menghapus satu baris.'),
      s('[data-tour="kasir-qty"]', 'Qty dan harga', 'Qty bisa desimal untuk barang kg, misalnya 0,25. Harga per satuan dan subtotal dihitung otomatis. Stok yang tidak cukup ditolak.'),
      s('[data-tour="kasir-metode"]', 'Tunai atau bon', 'Pilih Tunai untuk pembayaran langsung. Pilih Bon untuk pelanggan langganan; isi nama, WhatsApp, uang muka, dan jatuh tempo.'),
      s('[data-tour="kasir-total"]', 'Total belanja', 'Total adalah subtotal dikurangi pajak toko (saat ini 0%). Angka besar ini yang harus dibayar pelanggan.'),
      s('[data-tour="kasir-kanal"]', 'Tunai atau QRIS toko', 'QRIS di sini adalah QRIS statis milik toko, bukan QRIS dinamis per transaksi. Nominal mengikuti total dan dicatat sebagai kanal uang masuk.'),
      s('[data-tour="kasir-uang"]', 'Uang diterima dan kembalian', 'Masukkan uang pelanggan atau tekan Uang pas. Tombol +50 rb dan +100 rb mempercepat. Kembalian muncul otomatis.'),
      s('[data-tour="kasir-aksi"]', 'Simpan pembayaran', 'Tombol ini menyimpan transaksi, memotong stok dan batch FEFO, lalu menampilkan struk. Nomor invoice dibuat berurutan.'),
      s('[data-tour="kasir-metode"]', 'Bon pelanggan', 'Bon menyimpan sisa tagihan di halaman Piutang. Nama pelanggan wajib; WhatsApp opsional untuk mengirim tagihan.'),
      s('[data-tour="pintasan"]', 'Pintasan keyboard', 'Gunakan / untuk fokus ke pencarian, Enter untuk menambah, dan Esc untuk membersihkan pencarian. Barcode gun bekerja seperti keyboard.'),
    ],
  },
  {
    id: 'produk',
    judul: 'Produk',
    ket: 'Daftar barang, harga, stok, dan kategori.',
    rute: '/produk',
    langkah: [
      s('[data-tour="produk-tambah"]', 'Tambah produk', 'Pemilik bisa menambah barang baru. Form berisi nama, kategori, satuan, barcode, stok awal, harga beli, harga jual, dan stok minimum.'),
      s('[data-tour="produk-impor"]', 'Impor dari Excel', 'Impor massal memakai template CSV. Berguna saat pertama kali pindah dari pembukuan manual. Di demo, tombol ini hanya memperlihatkan alurnya.'),
      s('[data-tour="produk-cari"]', 'Cari dan filter kategori', 'Cari berdasarkan nama, kode, atau barcode. Filter kategori mempersempit daftar tanpa mengubah data.'),
      s('[data-tour="produk-tabel"]', 'Harga dan stok', 'Harga jual terlihat untuk semua peran. Harga beli, nilai stok, dan margin hanya untuk pemilik. Status menandai stok menipis.'),
      s('[data-tour="produk-aksi"]', 'Kasir hanya melihat', 'Kasir bisa mencari dan melihat stok, tetapi tombol tambah, impor, dan ubah disembunyikan. Ini mencegah harga diubah dari meja kasir.'),
    ],
  },
  {
    id: 'stok',
    judul: 'Stok masuk',
    ket: 'Penerimaan barang dan batch kedaluwarsa.',
    rute: '/stok-masuk',
    peran: ['pemilik'],
    langkah: [
      s('main h2', 'Penerimaan barang', 'Catat barang datang dari supplier. Setiap penerimaan menyimpan nomor dokumen, supplier, tanggal, dan daftar barang.'),
      s('[data-tour="stok-aksi"]', 'Tambah penerimaan', 'Klik untuk membuat dokumen baru. Tambahkan beberapa baris sekaligus, lalu simpan sebagai draf atau langsung terima.'),
      s('[data-tour="stok-dokumen"]', 'Dokumen penerimaan', 'Draf bisa diperiksa dulu; setelah diterima, stok produk bertambah dan batch baru tercatat. Dokumen yang sudah diterima tidak bisa diubah.'),
      s('[data-tour="stok-dokumen"]', 'Batch dan expired', 'Isi tanggal expired per baris. Batch inilah yang nanti dipotong lebih dulu saat kasir menjual, sesuai FEFO.'),
    ],
  },
  {
    id: 'invoice',
    judul: 'Invoice',
    ket: 'Riwayat transaksi dan tautan publik.',
    rute: '/invoice',
    langkah: [
      s('main h2', 'Riwayat transaksi', 'Semua transaksi tersimpan di sini, termasuk yang sudah void. Nomor invoice tidak pernah dipakai ulang.'),
      s('[data-tour="invoice-aksi"]', 'Ekspor dan transaksi baru', 'Ekspor CSV untuk pembukuan, atau langsung buka Kasir untuk transaksi baru.'),
      s('[data-tour="invoice-cari"]', 'Cari transaksi', 'Cari nomor invoice, nama kasir, atau nama pelanggan. Hasil langsung menyempit saat mengetik.'),
      s('[data-tour="invoice-tabel"]', 'Status transaksi', 'Lunas, bon, dan void punya warna berbeda. Klik baris untuk membuka rincian, cetak ulang, atau mencatat pelunasan.'),
    ],
  },
  {
    id: 'detail',
    judul: 'Detail invoice',
    ket: 'Cetak, WhatsApp, void, dan tautan pelanggan.',
    rute: '/invoice/INV-20261119-0069',
    cocok: ['/invoice/'],
    langkah: [
      s('[data-tour="detail-aksi"]', 'Aksi pada satu transaksi', 'Cetak struk, kirim WhatsApp, ekspor CSV, dan catat pelunasan bon. Semua aksi bekerja pada invoice yang sedang dibuka.'),
      s('[data-tour="detail-rincian"]', 'Rincian barang dan total', 'Barang, qty, harga, subtotal, pajak, dan total. Untuk bon, sisa tagihan dan riwayat uang masuk ikut ditampilkan.'),
      s('[data-tour="detail-info"]', 'Informasi pelanggan', 'Nama, WhatsApp, kasir, dan kanal pembayaran. Data ini yang dipakai saat mengirim tagihan.'),
      s('[data-tour="detail-publik"]', 'Tautan invoice publik', 'Salin tautan bertoken agar pelanggan bisa membuka rincian tanpa login. Tautan ini hanya untuk demo dan bukan autentikasi asli.'),
      s('[data-tour="detail-void"]', 'Void dengan pengaman', 'Kasir boleh void hanya untuk transaksi hari ini, maksimal 15 menit setelah transaksi, maksimal 3 kali sehari, dan bukan bon yang sudah dibayar. Void di atas Rp 100.000 tetap bisa tetapi ditandai perlu tinjauan pemilik.'),
    ],
  },
  {
    id: 'piutang',
    judul: 'Piutang & bon',
    ket: 'Bon berjalan, jatuh tempo, dan pelunasan.',
    rute: '/piutang',
    langkah: [
      s('[data-tour="piutang-kpi"]', 'Ringkasan piutang', 'Total sisa, jumlah bon berjalan, bon lewat tempo, dan bon lunas. Angka lewat tempo berwarna merah sebagai peringatan.'),
      s('[data-tour="piutang-aksi"]', 'Buat bon baru', 'Membuka Kasir dengan metode Bon sudah terpilih. Kasir juga boleh membuat bon, bukan hanya pemilik.'),
      s('[data-tour="piutang-cari"]', 'Cari pelanggan', 'Cari berdasarkan nama pelanggan, nomor invoice, atau nomor HP. Tab memisahkan berjalan, lewat tempo, dan lunas.'),
      s('[data-tour="piutang-tabel"]', 'Catat pelunasan', 'Tombol Bayar membuka form nominal. Bisa diisi penuh atau sebagian; riwayat pembayaran tersimpan di detail invoice.'),
    ],
  },
  {
    id: 'kedaluwarsa',
    judul: 'Kedaluwarsa & FEFO',
    ket: 'Batch mendekati expired dan penarikan barang.',
    rute: '/kedaluwarsa',
    peran: ['pemilik'],
    langkah: [
      s('[data-tour="exp-kpi"]', 'Ringkasan risiko', 'Jumlah batch yang sudah expired, yang mendekati 30 hari, nilai berisiko, dan total batch aktif.'),
      s('[data-tour="exp-fefo"]', 'Cara kerja FEFO', 'First Expired First Out: saat menjual, batch dengan tanggal expired terdekat dipotong lebih dulu. Ini mengurangi barang rusak.'),
      s('[data-tour="exp-tabel"]', 'Daftar batch', 'Urut dari yang paling dekat kedaluwarsa. Tab memisahkan expired, segera, dan aman.'),
      s('[data-tour="exp-tabel"]', 'Tarik dari rak', 'Barang rusak atau expired bisa ditarik dengan alasan. Stok produk berkurang dan jejaknya tercatat untuk pemilik.'),
    ],
  },
  {
    id: 'opname',
    judul: 'Stock opname',
    ket: 'Hitung fisik dan posting selisih.',
    rute: '/opname',
    peran: ['pemilik'],
    langkah: [
      s('main h2', 'Sesi opname', 'Opname membandingkan stok sistem dengan hitungan fisik. Selisih wajib diberi alasan sebelum diposting.'),
      s('[data-tour="opname-aksi"]', 'Mulai sesi baru', 'Sesi baru menyalin stok sistem sebagai titik awal. Petugas lalu mengisi hasil hitung per produk.'),
      s('[data-tour="opname-kpi"]', 'Progres hitung', 'Lihat berapa produk sudah dihitung dan berapa selisih ditemukan. Sesi yang belum diposting bisa dilanjutkan kapan saja.'),
      s('[data-tour="opname-daftar"]', 'Posting oleh pemilik', 'Setelah semua dihitung, pemilik memposting sesi. Stok sistem menyesuaikan dan selisih masuk jejak aktivitas.'),
    ],
  },
  {
    id: 'laporan',
    judul: 'Laporan',
    ket: 'Omzet, laba, produk, stok, dan void.',
    rute: '/laporan',
    peran: ['pemilik'],
    langkah: [
      s('[data-tour="lap-periode"]', 'Harian, mingguan, dan bulanan', 'Pilih periode laporan, lalu pakai panah untuk membuka hari, minggu, atau bulan yang sudah lewat. Pembanding di bawah KPI menunjukkan naik atau turun terhadap periode sebelumnya; angka minus tetap ditampilkan.'),
      s('[data-tour="lap-kpi"]', 'Angka penjualan', 'Omzet, transaksi, item, dan rata-rata untuk periode yang dipilih. Tab Stok mengganti isi dengan nilai persediaan dan potensi margin.'),
      s('[data-tour="lap-void"]', 'Void periode ini', 'Daftar transaksi yang dibatalkan beserta tanggal, alasan, dan penandaan perlu tinjauan. Void di atas Rp 100.000 muncul di sini.'),
      s('[data-tour="lap-tab"]', 'Dua sudut pandang', 'Tab Penjualan untuk omzet dan laba; tab Stok untuk nilai persediaan. Filter hanya stok menipis ada di tab Stok.'),
      s('[data-tour="lap-jam"]', 'Rekap per jam atau per hari', 'Pada laporan harian, klik satu jam untuk melihat transaksi dan item. Pada mingguan atau bulanan, tabel berubah menjadi rekap harian dan setiap hari bisa dibuka. Hari tanpa transaksi tetap tampil nol.'),
      s('[data-tour="lap-kasir"]', 'Per kasir', 'Kontribusi omzet tiap kasir. Membantu melihat beban kerja, bukan untuk menilai kinerja secara otomatis.'),
      s('[data-tour="lap-tab"]', 'Produk terlaris dan kategori', 'Produk diurutkan dari omzet. Kategori menunjukkan ke mana uang pelanggan paling banyak pergi.'),
      s('[data-tour="lap-aksi"]', 'Ekspor CSV dan cetak PDF', 'CSV untuk diolah di Excel; cetak PDF untuk arsip atau rapat. Keduanya dibuat di browser, bukan dari server.'),
    ],
  },
  {
    id: 'jejak',
    judul: 'Jejak aktivitas',
    ket: 'Siapa melakukan apa, kapan, dan alasannya.',
    rute: '/jejak',
    peran: ['pemilik'],
    langkah: [
      s('main h2', 'Jejak yang tidak bisa dihapus', 'Hanya pemilik yang bisa membuka halaman ini. Catatan dibuat otomatis saat void, ubah harga, opname, dan pembayaran bon.'),
      s('[data-tour="jejak-filter"]', 'Filter dan pencarian', 'Saring berdasarkan jenis aksi atau pengguna, lalu cari nomor invoice, objek, atau alasan.'),
      s('[data-tour="jejak-tabel"]', 'Isi catatan', 'Waktu, pengguna, peran, aksi, objek, detail, dan alasan. Void yang perlu tinjauan tetap terlihat di sini.'),
      s('[data-tour="jejak-filter"]', 'Ekspor untuk pemeriksaan', 'Ekspor CSV mengikuti filter yang aktif. Di versi Laravel, tabel ini append-only dan hanya bisa dibaca pemilik.'),
    ],
  },
  {
    id: 'pengaturan',
    judul: 'Pengaturan',
    ket: 'Identitas toko, struk, pengguna, kategori, satuan.',
    rute: '/pengaturan',
    peran: ['pemilik'],
    langkah: [
      s('[data-tour="set-identitas"]', 'Identitas toko', 'Nama, alamat, telepon, dan pajak. Nama dan alamat tercetak di struk; pajak memengaruhi total transaksi.'),
      s('[data-tour="set-struk"]', 'Struk dan printer', 'Pilih 58 atau 80 mm sesuai printer thermal. Tes cetak memakai struk contoh tanpa menyimpan transaksi.'),
      s('[data-tour="set-pengguna"]', 'Pengguna dan peran', 'Daftar akun demo beserta perannya. Tambah pengguna dan PIN pemilik tersedia di aplikasi asli, bukan di prototipe.'),
      s('[data-tour="set-kategori"]', 'Kategori produk', 'Pemilik bisa menambah, mengganti nama, dan menonaktifkan kategori. Kategori dipakai saat menambah produk dan di laporan.'),
      s('[data-tour="set-satuan"]', 'Satuan produk', 'Satuan seperti pcs, kg, liter, atau karung bisa diatur di sini. Satuan menentukan cara qty ditampilkan di kasir dan struk.'),
      s('[data-tour="set-simpan"]', 'Simpan perubahan', 'Perubahan berlaku selama sesi demo. Muat ulang halaman mengembalikan data contoh.'),
    ],
  },
  {
    id: 'panduan',
    judul: 'Panduan',
    ket: 'Alur demo, hak akses, dan catatan perangkat.',
    rute: '/panduan',
    langkah: [
      s('[data-tour="panduan-addon"]', 'Paket dasar dan add-on', 'Paket dasar sudah mencakup kasir, produk, stok, invoice, dan laporan. Empat add-on: Piutang, Kedaluwarsa, WhatsApp, dan ekspor.'),
      s('[data-tour="panduan-alur"]', 'Alur demo tiga menit', 'Urutan singkat untuk mencoba sendiri: kasir, produk, invoice, stok, laporan, piutang, dan kedaluwarsa.'),
      s('[data-tour="panduan-akses"]', 'Hak akses per peran', 'Tabel ini merangkum siapa boleh apa. URL yang tidak diizinkan diarahkan ke halaman akses terbatas, bukan hanya disembunyikan.'),
      s('[data-tour="panduan-tur"]', 'Tur otomatis', 'Tur otomatis berjalan sekali per tab. Bisa dimatikan di sini, dan tombol Tur di topbar tetap tersedia kapan saja.'),
      s('[data-tour="panduan-perangkat"]', 'Catatan perangkat', 'Barcode gun USB, printer thermal 58/80 mm, dan browser Chrome/Edge di PC toko. HP dipakai untuk memantau, bukan melayani transaksi.'),
    ],
  },
  {
    id: 'tema',
    judul: 'Pilihan tampilan',
    ket: 'Bandingkan tiga arah desain.',
    rute: '/tema',
    langkah: [
      s('main h2', 'Tiga arah desain', 'Kasir, Brutal, dan Elegan memakai data yang sama. Halaman ini membandingkan ketiganya untuk dipilih bersama klien.'),
      s('[data-tour="tema-grid"]', 'Pratinjau berdampingan', 'Setiap kartu menampilkan ringkasan, tombol, status, dan tabel dalam tema masing-masing. Tekan Pakai untuk mencoba seluruh aplikasi.'),
      s('[data-tour="tema-tabel"]', 'Pertimbangan', 'Kelebihan, kekurangan, dan kecocokan tiap tema. Warna status dan struk thermal tetap sama di semua tema.'),
      s('[data-tour="tema"]', 'Ganti kapan saja', 'Tombol palet di topbar juga bisa mengganti tema. Pilihan tersimpan di browser dan hanya memengaruhi tampilan.'),
    ],
  },
]

const SEMUA_PERAN = ['pemilik', 'kasir']

export function daftarBab(peran = 'pemilik') {
  return BAB_TUR.filter((b) => (b.peran || SEMUA_PERAN).includes(peran))
}

export function langkahBab(bab, peran = 'pemilik') {
  const boleh = !bab.peran || bab.peran.includes(peran)
  if (!boleh) return []
  return bab.langkah
    .filter((l) => !l.peran || l.peran.includes(peran))
    .map((l) => ({ ...l, rute: l.rute || bab.rute || null, bab: bab.id }))
}

export function semuaLangkah(peran = 'pemilik') {
  return daftarBab(peran).flatMap((b) => langkahBab(b, peran))
}

export function babUntuk(path, peran = 'pemilik') {
  const daftar = daftarBab(peran)
  return (
    daftar.find((b) => b.cocok && b.cocok.some((c) => path.startsWith(c))) ||
    daftar.find((b) => b.rute === path) ||
    null
  )
}

// Daftar lengkap untuk pemilik; dipakai skrip pemeriksa.
export const SEMUA_LANGKAH = semuaLangkah('pemilik')
