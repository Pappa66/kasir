<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div class="min-w-0">
        <h2 class="text-lg font-semibold text-ink">Panduan singkat</h2>
        <p class="mt-0.5 max-w-2xl text-xs text-ink-soft">
          Alur demo tiga menit, hak akses tiap peran, dan catatan perangkat. Tidak perlu login —
          peran bisa diganti kapan saja.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <RouterLink to="/kasir" class="btn">
          <ShoppingCart :size="15" :stroke-width="1.6" />
          Buka Kasir
        </RouterLink>
        <button type="button" class="btn btn-primary" @click="tour.mulai()">
          <Play :size="14" :stroke-width="1.8" />
          Mulai tur interaktif
        </button>
      </div>
    </div>

    <section class="panel overflow-hidden">
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
      <div class="grid divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
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
            Diaktifkan terpisah sesuai kebutuhan toko. Label pada Dashboard menandai fitur ini.
          </p>
        </div>
      </div>
    </section>

    <div class="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div class="min-w-0 space-y-4">
        <section class="panel">
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

        <section class="panel">
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

        <section class="panel">
          <div class="panel-h">
            <span class="panel-title">Catatan perangkat</span>
            <span class="text-xs text-ink-soft">toko, bukan gudang</span>
          </div>
          <div class="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
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
            <span class="text-xs text-ink-soft">tanpa login</span>
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
  </div>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import {
  Check,
  ChevronRight,
  Minus,
  Monitor,
  Play,
  Plus,
  Printer,
  ScanLine,
  ShieldCheck,
  ShoppingCart,
} from 'lucide-vue-next'
import AddonTag from '../components/AddonTag.vue'
import { useSesi } from '../stores/sesi'
import { useTour } from '../stores/tour'
import { useUi } from '../stores/ui'

const router = useRouter()
const sesi = useSesi()
const tour = useTour()
const ui = useUi()

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
    isi: 'Transaksi barusan masuk ke daftar. Void hanya bisa dilakukan pemilik dan wajib beralasan.',
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
    isi: 'Lihat penjualan hari ini, produk terlaris, dan daftar stok di bawah minimum.',
  },
]

const akses = [
  { modul: 'Kasir', pemilik: 'Penuh', kasir: 'Penuh' },
  { modul: 'Produk', pemilik: 'Tambah & ubah', kasir: 'Lihat saja' },
  { modul: 'Invoice', pemilik: 'Termasuk void', kasir: 'Lihat & cetak' },
  { modul: 'Stok Masuk', pemilik: 'Penuh', kasir: null },
  { modul: 'Stock Opname', pemilik: 'Hitung & posting', kasir: null },
  { modul: 'Laporan', pemilik: 'Penuh', kasir: null },
  { modul: 'Pengaturan', pemilik: 'Penuh', kasir: null },
  { modul: 'Panduan', pemilik: 'Penuh', kasir: 'Penuh' },
]

const batasan = [
  'Tanpa login, database, dan penyimpanan permanen.',
  'Muat ulang halaman mengembalikan data contoh.',
  'Kirim WhatsApp, export Excel, dan audit log belum dibuat.',
  'Pembayaran hanya tunai; tanpa QRIS atau kartu.',
]

const dasar = [
  'Kasir, keranjang, dan pembayaran tunai',
  'Produk, stok, dan stok masuk',
  'Invoice dan struk thermal 58/80 mm',
  'Stock opname dengan alasan selisih',
  'Laporan penjualan, stok, dan laba',
  'Pengaturan toko dan pengguna',
  'Peran Pemilik dan Kasir',
]

const addon = [
  'Piutang dan bon pelanggan',
  'Batch expired dan FEFO',
  'Kirim struk lewat WhatsApp',
  'Export Excel dan PDF',
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
