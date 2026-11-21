<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div class="min-w-0">
        <h2 class="text-lg font-semibold text-ink">Panduan singkat</h2>
        <p class="mt-0.5 max-w-2xl text-xs text-ink-soft">
          Alur demo tiga menit, hak akses tiap peran, dan catatan perangkat. Masuk lewat halaman
          login dummy, lalu peran bisa diganti kapan saja.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <RouterLink to="/kasir" class="btn">
          <ShoppingCart :size="15" :stroke-width="1.6" />
          Buka Kasir
        </RouterLink>
        <button type="button" class="btn btn-primary" @click="tour.mulaiSemua()">
          <Play :size="14" :stroke-width="1.8" />
          Mulai tur interaktif
        </button>
      </div>
    </div>

    <section class="panel overflow-hidden" data-tour="panduan-addon">
      <div class="border-b border-line p-4">
        <div class="flex flex-wrap items-center gap-2.5">
          <AddonTag class="!px-2.5 !py-1 !text-xs" />
          <h3 class="text-base font-semibold text-ink">Apa itu add-on?</h3>
        </div>
        <p class="mt-2 max-w-3xl text-xs leading-relaxed text-ink-soft">
          Add-on adalah fitur tambahan di luar paket dasar aplikasi. Paket dasar sudah mencakup
          alur toko sehari-hari; add-on diaktifkan terpisah sesuai kebutuhan dan tidak mengubah
          data dasar. Di prototipe ini label <span class="font-medium text-ink">ADD-ON</span>
          dipakai untuk menandai fitur tambahan, dan tidak ada harga yang ditampilkan di aplikasi.
        </p>
      </div>
      <div class="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div class="p-4">
          <div class="text-2xs uppercase tracking-[0.06em] text-ink-soft">
            Paket dasar · sudah termasuk
          </div>
          <ul class="mt-2 space-y-1.5 text-xs text-ink-soft">
            <li v-for="b in dasar" :key="b" class="flex gap-2">
              <Check :size="13" :stroke-width="1.8" class="mt-0.5 shrink-0 text-ok" />
              <span>{{ b }}</span>
            </li>
          </ul>
        </div>
        <div class="p-4">
          <div class="flex flex-wrap items-center gap-2">
            <AddonTag />
            <span class="text-2xs uppercase tracking-[0.06em] text-ink-soft">
              Fitur tambahan
            </span>
          </div>
          <ul class="mt-2 space-y-1.5 text-xs text-ink-soft">
            <li v-for="a in addon" :key="a" class="flex gap-2">
              <Plus :size="13" :stroke-width="1.8" class="mt-0.5 shrink-0 text-accent-2" />
              <span>{{ a }}</span>
            </li>
          </ul>
          <p class="mt-2 text-2xs leading-relaxed text-ink-soft">
            Semua add-on di bawah sudah bisa dicoba di demo ini. Kedaluwarsa khusus pemilik;
            Piutang bisa dibuka kasir untuk mencatat pelunasan bon; WhatsApp dan export dibuka
            dari invoice dan laporan.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-px border-t border-line bg-line sm:grid-cols-2">
        <RouterLink
          v-for="a in addonDetail"
          :key="a.judul"
          :to="a.to"
          class="group flex items-start gap-3 bg-paper p-4 transition-colors hover:bg-surface"
        >
          <span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-line bg-surface text-accent-2">
            <component :is="a.icon" :size="15" :stroke-width="1.6" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="flex flex-wrap items-center gap-2">
              <span class="text-sm font-medium text-ink">{{ a.judul }}</span>
              <span class="rounded border border-accent-2/40 px-1 py-px text-[9px] uppercase tracking-[0.06em] text-accent-2">
                add-on
              </span>
            </span>
            <span class="mt-1 block text-xs leading-relaxed text-ink-soft">{{ a.isi }}</span>
          </span>
          <ChevronRight
            :size="15"
            :stroke-width="1.6"
            class="mt-0.5 shrink-0 text-[#9aa8a5] transition-transform group-hover:translate-x-0.5"
          />
        </RouterLink>
      </div>
    </section>

    <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div class="min-w-0 space-y-4">
        <section class="panel" data-tour="panduan-alur">
          <div class="panel-h">
            <span class="panel-title">Alur demo 3 menit</span>
            <span class="hidden text-xs text-ink-soft sm:inline">klik untuk langsung membuka</span>
          </div>
          <div class="divide-y divide-line">
            <RouterLink
              v-for="(l, i) in alur"
              :key="l.to"
              :to="l.to"
              class="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface"
            >
              <span class="mt-0.5 w-6 shrink-0 font-mono text-xs text-[#9aa8a5]">
                {{ String(i + 1).padStart(2, '0') }}
              </span>
              <span class="min-w-0 flex-1">
                <span class="flex flex-wrap items-center gap-2">
                  <span class="text-sm font-medium text-ink">{{ l.judul }}</span>
                  <span v-if="l.khusus" class="status text-warn">Pemilik</span>
                </span>
                <span class="mt-0.5 block text-xs leading-relaxed text-ink-soft">{{ l.isi }}</span>
              </span>
              <ChevronRight
                :size="16"
                :stroke-width="1.6"
                class="mt-0.5 shrink-0 text-[#9aa8a5] transition-transform group-hover:translate-x-0.5"
              />
            </RouterLink>
          </div>
        </section>

        <section class="panel" data-tour="panduan-bab">
          <div class="panel-h">
            <span class="panel-title">Bab tur</span>
            <span class="text-xs text-ink-soft">{{ babTur.length }} bab · {{ totalLangkah }} langkah</span>
          </div>
          <div class="divide-y divide-line">
            <button
              v-for="b in babTur"
              :key="b.id"
              type="button"
              class="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-surface"
              @click="tour.mulaiBab(b.id)"
            >
              <span class="mt-0.5 min-w-0 flex-1">
                <span class="block text-sm font-medium text-ink">{{ b.judul }}</span>
                <span class="mt-0.5 block text-2xs leading-relaxed text-ink-soft">{{ b.ket }}</span>
              </span>
              <span class="shrink-0 text-2xs text-ink-soft">{{ b.langkah.length }} langkah</span>
              <Play :size="14" :stroke-width="1.8" class="mt-0.5 shrink-0 text-accent-2" />
            </button>
          </div>
          <div class="border-t border-line bg-surface px-4 py-2.5 text-2xs leading-relaxed text-ink-soft">
            Tombol tanda tanya di topbar menjelaskan halaman yang sedang dibuka. Tombol Tur
            menjalankan semua bab berurutan.
          </div>
        </section>

        <section class="panel" data-tour="panduan-akses">
          <div class="panel-h">
            <span class="panel-title">Hak akses per peran</span>
            <span class="text-xs text-ink-soft">maks. 3 akun</span>
          </div>
          <div class="overflow-x-auto">
            <table class="tbl">
              <thead>
                <tr>
                  <th>Modul</th>
                  <th class="w-32">Pemilik</th>
                  <th class="w-32">Kasir</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="a in akses" :key="a.modul">
                  <td class="font-medium text-ink">{{ a.modul }}</td>
                  <td class="text-xs text-ink-soft">{{ a.pemilik }}</td>
                  <td class="text-xs">
                    <span v-if="a.kasir" class="text-ink-soft">{{ a.kasir }}</span>
                    <span v-else class="inline-flex items-center gap-1 text-[#9aa8a5]">
                      <Minus :size="12" :stroke-width="1.8" />
                      tidak ada
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="border-t border-line px-4 py-2.5 text-2xs leading-relaxed text-ink-soft">
            Kasir tidak dapat membuka harga beli, nilai stok, laporan laba, pengaturan, dan opname.
            Menu yang tidak diizinkan tidak muncul; URL langsung diarahkan ke halaman akses terbatas.
          </p>
        </section>

        <section class="panel" data-tour="panduan-perangkat">
          <div class="panel-h">
            <span class="panel-title">Catatan perangkat</span>
            <span class="text-xs text-ink-soft">toko, bukan gudang</span>
          </div>
          <div class="grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div class="p-4">
              <div class="flex items-center gap-2 text-sm font-medium text-ink">
                <ScanLine :size="16" :stroke-width="1.6" class="text-accent-2" />
                Barcode gun USB
              </div>
              <p class="mt-1.5 text-xs leading-relaxed text-ink-soft">
                Bertindak seperti keyboard dan mengakhiri dengan Enter. Cukup fokuskan kursor di
                kolom cari Kasir, lalu tembak. Tanpa scan kamera HP.
              </p>
            </div>
            <div class="p-4">
              <div class="flex items-center gap-2 text-sm font-medium text-ink">
                <Printer :size="16" :stroke-width="1.6" class="text-accent-2" />
                Printer thermal
              </div>
              <p class="mt-1.5 text-xs leading-relaxed text-ink-soft">
                58 atau 80 mm, dipilih di Pengaturan. Ukuran kertas mengikuti driver printer;
                aplikasi hanya mengatur lebar isi. Satu struk, satu halaman.
              </p>
            </div>
            <div class="p-4">
              <div class="flex items-center gap-2 text-sm font-medium text-ink">
                <Monitor :size="16" :stroke-width="1.6" class="text-accent-2" />
                Browser
              </div>
              <p class="mt-1.5 text-xs leading-relaxed text-ink-soft">
                Chrome atau Edge di PC/laptop toko. HP dipakai untuk memantau laporan, bukan untuk
                melayani transaksi.
              </p>
            </div>
          </div>
        </section>
      </div>

      <aside class="min-w-0 space-y-4 lg:sticky lg:top-[68px]">
        <section class="panel">
          <div class="panel-h">
            <span class="panel-title">Peran demo</span>
            <span class="text-xs text-ink-soft">bisa diganti</span>
          </div>
          <div class="p-4">
            <div class="flex items-center justify-between gap-2">
              <div class="min-w-0">
                <div class="truncate text-sm font-medium text-ink">{{ sesi.aktif.nama }}</div>
                <div class="mt-0.5 text-xs text-ink-soft">sedang aktif</div>
              </div>
              <span
                class="status shrink-0"
                :class="sesi.pemilik ? 'text-accent-2' : 'text-warn'"
              >
                {{ sesi.aktif.role }}
              </span>
            </div>

            <div class="mt-3 grid grid-cols-2 gap-1.5">
              <button
                v-for="r in ['Pemilik', 'Kasir']"
                :key="r"
                type="button"
                class="btn btn-sm justify-center"
                :class="sesi.aktif.role === r ? 'border-accent-2 text-accent-2' : ''"
                @click="masuk(r)"
              >
                {{ r }}
              </button>
            </div>

            <p class="mt-2.5 text-2xs leading-relaxed text-ink-soft">
              Ganti peran juga bisa lewat nama pengguna di kanan atas. Pilihan tersimpan selama tab
              terbuka.
            </p>
          </div>
        </section>

        <section class="panel" data-tour="panduan-tur">
          <div class="panel-h">
            <span class="panel-title">Tur otomatis</span>
            <span class="text-xs text-ink-soft">sekali per tab</span>
          </div>
          <div class="p-4">
            <label class="flex cursor-pointer items-start gap-3">
              <input
                v-model="autoTur"
                type="checkbox"
                class="mt-0.5 h-4 w-4 shrink-0 accent-[#0f3d3e]"
              />
              <span class="min-w-0">
                <span class="block text-sm font-medium text-ink">Mulai sendiri saat demo dibuka</span>
                <span class="mt-0.5 block text-2xs leading-relaxed text-ink-soft">
                  Tur berjalan otomatis sekali per tab. Tombol Tur di topbar tetap bisa dipakai
                  kapan saja, dan tombol Lewati tetap tersedia.
                </span>
              </span>
            </label>
          </div>
        </section>

        <section class="panel">
          <div class="panel-h">
            <span class="panel-title">Batasan prototipe</span>
          </div>
          <ul class="space-y-2 p-4 text-xs leading-relaxed text-ink-soft">
            <li v-for="b in batasan" :key="b" class="flex gap-2">
              <Minus :size="13" :stroke-width="1.8" class="mt-0.5 shrink-0 text-[#9aa8a5]" />
              <span>{{ b }}</span>
            </li>
          </ul>
        </section>

        <section class="panel p-4">
          <div class="flex items-center gap-2 text-sm font-medium text-ink">
            <ShieldCheck :size="16" :stroke-width="1.6" class="text-accent-2" />
            Data contoh
          </div>
          <p class="mt-1.5 text-xs leading-relaxed text-ink-soft">
            Toko Putra Nusantara 18, Sukabumi. Produk, harga, dan transaksi hanya untuk
            memperlihatkan alur kerja.
          </p>
        </section>
      </aside>
    </div>

    <RouterLink
      to="/panduan-memilih"
      class="panel group flex flex-wrap items-center gap-3 p-4 transition-colors hover:bg-surface"
    >
      <span
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-line bg-surface text-accent-2"
      >
        <Scale :size="16" :stroke-width="1.6" />
      </span>
      <span class="min-w-0 flex-1">
        <span class="block text-sm font-medium text-ink">Bandingkan dengan pilihan lain</span>
        <span class="mt-0.5 block text-xs leading-relaxed text-ink-soft">
          Panduan memilih aplikasi kasir: kriteria, kekurangan kami, dan checklist untuk penjual
          mana pun.
        </span>
      </span>
      <ChevronRight
        :size="16"
        :stroke-width="1.6"
        class="shrink-0 text-[#9aa8a5] transition-transform group-hover:translate-x-0.5"
      />
    </RouterLink>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  CalendarClock,
  Check,
  ChevronRight,
  FileSpreadsheet,
  MessageCircle,
  Minus,
  Monitor,
  Play,
  Plus,
  Printer,
  ScanLine,
  Scale,
  ShieldCheck,
  ShoppingCart,
  Wallet,
} from 'lucide-vue-next'
import AddonTag from '../components/AddonTag.vue'
import { BAB_TUR } from '../data/tur'
import { useSesi } from '../stores/sesi'
import { useTour } from '../stores/tour'
import { useUi } from '../stores/ui'

const router = useRouter()
const sesi = useSesi()
const tour = useTour()
const ui = useUi()
const babTur = BAB_TUR
const totalLangkah = BAB_TUR.reduce((n, b) => n + b.langkah.length, 0)

const autoTur = ref(localStorage.getItem('demo-tur-otomatis') !== '0')
watch(autoTur, (v) => {
  localStorage.setItem('demo-tur-otomatis', v ? '1' : '0')
  if (v) sessionStorage.removeItem('demo-tur-terlihat')
})

const alur = [
  {
    to: '/kasir',
    judul: 'Mulai dari Kasir',
    isi: 'Ketik atau scan dua barang, ubah qty, lalu bayar tunai. Struk muncul dan siap dicetak 58/80 mm.',
  },
  {
    to: '/produk',
    judul: 'Cek daftar produk',
    isi: 'Cari barang dan lihat stok. Sebagai kasir, tombol tambah, import, dan harga beli disembunyikan.',
  },
  {
    to: '/invoice',
    judul: 'Buka invoice terakhir',
    isi: 'Transaksi barusan masuk ke daftar. Void wajib beralasan; kasir dibatasi 15 menit dan Rp 100.000, pemilik tidak dibatasi.',
  },
  {
    to: '/stok-masuk',
    judul: 'Tambah stok, lalu opname',
    khusus: true,
    isi: 'Catat barang masuk dari supplier, lalu cocokkan stok fisik. Posting opname memakai PIN demo 1234.',
  },
  {
    to: '/laporan',
    judul: 'Tutup buku di Laporan',
    khusus: true,
    isi: 'Lihat penjualan hari ini, produk terlaris, dan stok menipis. Ekspor CSV atau cetak PDF dari tombol di kanan atas.',
  },
  {
    to: '/piutang',
    judul: 'Jual bon, lalu tagih',
    khusus: true,
    isi: 'Di Kasir pilih metode Bon, isi pelanggan dan jatuh tempo. Catat pelunasan dari halaman Piutang atau detail invoice.',
  },
  {
    to: '/kedaluwarsa',
    judul: 'Cek batch kedaluwarsa',
    khusus: true,
    isi: 'Batch diurutkan tanggal expired. Penjualan memotong batch terdekat lebih dulu; batch rusak bisa ditarik dari rak.',
  },
]

const akses = [
  { modul: 'Kasir', pemilik: 'Penuh', kasir: 'Penuh' },
  { modul: 'Produk', pemilik: 'Tambah & ubah', kasir: 'Lihat saja' },
  { modul: 'Invoice', pemilik: 'Termasuk void', kasir: 'Void terbatas' },
  { modul: 'Jejak aktivitas', pemilik: 'Baca & ekspor', kasir: null },
  { modul: 'Invoice publik', pemilik: 'Tautan bertoken', kasir: 'Tautan bertoken' },
  { modul: 'Piutang & Bon', pemilik: 'Penuh', kasir: 'Bayar bon' },
  { modul: 'Kedaluwarsa & FEFO', pemilik: 'Penuh', kasir: null },
  { modul: 'Stok Masuk', pemilik: 'Penuh', kasir: null },
  { modul: 'Stock Opname', pemilik: 'Hitung & posting', kasir: null },
  { modul: 'Laporan', pemilik: 'Penuh', kasir: null },
  { modul: 'Pengaturan', pemilik: 'Penuh', kasir: null },
  { modul: 'Panduan', pemilik: 'Penuh', kasir: 'Penuh' },
  { modul: 'Panduan memilih', pemilik: 'Penuh', kasir: 'Penuh' },
  { modul: 'Pilihan tampilan', pemilik: 'Ganti tema', kasir: 'Ganti tema' },
]

const batasan = [
  'Login dummy tanpa kata sandi; belum ada autentikasi asli.',
  'Tanpa database dan penyimpanan permanen.',
  'QRIS statis toko dicatat sebagai kanal; belum ada QRIS dinamis, kartu, atau transfer.',
  'Muat ulang halaman mengembalikan data contoh.',
  'WhatsApp dibuka lewat wa.me; demo tidak mengirim pesan otomatis.',
  'Ekspor CSV/PDF dibuat di browser, bukan dari server.',
  'Tautan invoice publik memakai token demo, bukan autentikasi.',
]

const dasar = [
  'Kasir, keranjang, pembayaran tunai & QRIS statis',
  'Produk, stok, dan penerimaan barang',
  'Invoice dan struk thermal 58/80 mm',
  'Stock opname dengan alasan selisih',
  'Laporan penjualan, stok, dan laba',
  'Pengaturan toko, pengguna, kategori & satuan',
  'Peran Pemilik dan Kasir',
  'Void berjenjang dengan alasan + jejak audit',
]

const addon = [
  'Piutang dan bon pelanggan',
  'Batch expired dan FEFO',
  'Kirim struk lewat WhatsApp',
  'Export Excel (CSV) dan PDF',
]

const addonDetail = [
  {
    judul: 'Piutang & bon',
    to: '/piutang',
    icon: Wallet,
    isi: 'Jual barang dengan DP atau tempo, catat pelunasan sebagian, dan pantau bon lewat tempo.',
  },
  {
    judul: 'Expired & FEFO',
    to: '/kedaluwarsa',
    icon: CalendarClock,
    isi: 'Batch per tanggal expired, potong otomatis saat jual, dan tarik batch rusak dari rak.',
  },
  {
    judul: 'Kirim WhatsApp',
    to: '/invoice',
    icon: MessageCircle,
    isi: 'Buka WhatsApp dengan rincian invoice dan tautan publik yang sudah terisi dari detail invoice.',
  },
  {
    judul: 'Export Excel & PDF',
    to: '/laporan',
    icon: FileSpreadsheet,
    isi: 'Unduh CSV yang rapi di Excel, atau cetak laporan dan invoice ke PDF satu halaman.',
  },
]

function masuk(role) {
  const u = sesi.daftar.find((x) => x.role === role && x.aktif)
  if (!u) return
  sesi.ganti(u.id)
  ui.kabari(`Mode ${role.toLowerCase()}: ${u.nama}.`, 'info')
  if (!sesi.pemilik && ['/stok-masuk'].includes(router.currentRoute.value.path)) {
    router.replace('/kasir')
  }
}
</script>
