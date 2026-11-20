<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div class="min-w-0">
        <h2 class="text-lg font-semibold text-ink">Panduan memilih</h2>
        <p class="mt-0.5 max-w-2xl text-xs leading-relaxed text-ink-soft">
          Tidak semua toko butuh aplikasi yang sama. Halaman ini membandingkan pilihan yang umum,
          termasuk kekurangan kami, tanpa menyebut merek atau harga.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <a :href="tautanBon" target="_blank" rel="noopener" class="btn">
          <ReceiptText :size="15" :stroke-width="1.6" />
          Contoh invoice publik
          <ExternalLink :size="13" :stroke-width="1.6" class="text-ink-soft" />
        </a>
        <RouterLink to="/kasir" class="btn btn-primary">
          <ShoppingCart :size="15" :stroke-width="1.6" />
          Coba Kasir
        </RouterLink>
      </div>
    </div>

    <div
      class="flex flex-wrap gap-1 rounded border border-line bg-paper p-1"
      role="tablist"
      aria-label="Bagian panduan memilih"
    >
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        role="tab"
        :aria-selected="tab === t.id"
        class="inline-flex min-h-8 items-center gap-1.5 rounded px-3 py-1 text-xs font-medium transition-colors"
        :class="tab === t.id ? 'bg-ink text-white' : 'text-ink-soft hover:bg-surface hover:text-ink'"
        @click="tab = t.id"
      >
        <component :is="t.icon" :size="14" :stroke-width="1.6" />
        {{ t.label }}
      </button>
    </div>

    <!-- Perbandingan -->
    <template v-if="tab === 'banding'">
      <div class="grid gap-3 md:grid-cols-3">
        <section
          v-for="p in pilihan"
          :key="p.judul"
          class="panel flex flex-col p-4"
          :class="p.sorot ? 'border-accent-2/60' : ''"
        >
          <div class="flex items-center gap-2">
            <span
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-line bg-surface"
              :class="p.sorot ? 'text-accent-2' : 'text-ink-soft'"
            >
              <component :is="p.icon" :size="15" :stroke-width="1.6" />
            </span>
            <h3 class="min-w-0 text-sm font-semibold text-ink">{{ p.judul }}</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-ink-soft">{{ p.isi }}</p>
          <div class="mt-3 border-t border-line pt-2.5">
            <div class="text-2xs uppercase tracking-[0.06em] text-ink-soft">Cocok untuk</div>
            <p class="mt-0.5 text-xs leading-relaxed text-ink-soft">{{ p.cocok }}</p>
          </div>
          <div class="mt-2.5 flex gap-1.5 text-2xs leading-relaxed text-ink-soft">
            <component :is="p.catatanIcon" :size="13" :stroke-width="1.6" class="mt-0.5 shrink-0" />
            <span>{{ p.catatan }}</span>
          </div>
        </section>
      </div>

      <section class="panel overflow-hidden">
        <div class="panel-h">
          <span class="panel-title">Perbandingan kriteria</span>
          <span class="hidden text-xs text-ink-soft sm:inline">tanpa merek, tanpa harga</span>
        </div>

        <div class="hidden overflow-x-auto md:block">
          <table class="tbl">
            <thead>
              <tr>
                <th>Kriteria</th>
                <th class="w-40">Siap pakai</th>
                <th class="w-40">Paket + alat</th>
                <th class="w-44">Dibangun untuk toko</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in banding" :key="b.kriteria">
                <td>
                  <div class="font-medium text-ink">{{ b.kriteria }}</div>
                  <div class="text-2xs text-ink-soft">{{ b.ket }}</div>
                </td>
                <td>
                  <span class="inline-flex rounded border px-1.5 py-0.5 text-2xs" :class="nada(b.murah)">
                    {{ b.murah }}
                  </span>
                </td>
                <td>
                  <span class="inline-flex rounded border px-1.5 py-0.5 text-2xs" :class="nada(b.paket)">
                    {{ b.paket }}
                  </span>
                </td>
                <td>
                  <span class="inline-flex rounded border px-1.5 py-0.5 text-2xs" :class="nada(b.kita)">
                    {{ b.kita }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="divide-y divide-line md:hidden">
          <div v-for="b in banding" :key="b.kriteria" class="p-3">
            <div class="text-sm font-medium text-ink">{{ b.kriteria }}</div>
            <div class="text-2xs text-ink-soft">{{ b.ket }}</div>
            <dl class="mt-2 space-y-1.5">
              <div class="flex items-center justify-between gap-2">
                <dt class="text-2xs text-ink-soft">Siap pakai</dt>
                <dd>
                  <span class="inline-flex rounded border px-1.5 py-0.5 text-2xs" :class="nada(b.murah)">
                    {{ b.murah }}
                  </span>
                </dd>
              </div>
              <div class="flex items-center justify-between gap-2">
                <dt class="text-2xs text-ink-soft">Paket + alat</dt>
                <dd>
                  <span class="inline-flex rounded border px-1.5 py-0.5 text-2xs" :class="nada(b.paket)">
                    {{ b.paket }}
                  </span>
                </dd>
              </div>
              <div class="flex items-center justify-between gap-2">
                <dt class="text-2xs text-ink-soft">Dibangun untuk toko</dt>
                <dd>
                  <span class="inline-flex rounded border px-1.5 py-0.5 text-2xs" :class="nada(b.kita)">
                    {{ b.kita }}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <p class="text-2xs leading-relaxed text-ink-soft">
        Penilaian ini sudut pandang kami, bukan uji independen. Fitur dan biaya setiap penjual
        perlu dicek langsung sebelum memutuskan.
      </p>
    </template>

    <!-- Kelebihan & kekurangan -->
    <template v-else-if="tab === 'nilai'">
      <div class="grid items-start gap-4 lg:grid-cols-2">
        <section class="panel overflow-hidden">
          <div class="panel-h">
            <span class="panel-title">Yang sudah bisa dicoba</span>
            <span class="status text-ok">di demo ini</span>
          </div>
          <ul class="divide-y divide-line">
            <li v-for="k in lebih" :key="k.judul" class="flex gap-3 px-4 py-3">
              <Check :size="15" :stroke-width="1.8" class="mt-0.5 shrink-0 text-ok" />
              <div class="min-w-0">
                <div class="text-sm font-medium text-ink">{{ k.judul }}</div>
                <p class="mt-0.5 text-xs leading-relaxed text-ink-soft">{{ k.isi }}</p>
              </div>
            </li>
          </ul>
        </section>

        <section class="panel overflow-hidden">
          <div class="panel-h">
            <span class="panel-title">Yang perlu diketahui</span>
            <span class="status text-warn">sebelum memilih</span>
          </div>
          <ul class="divide-y divide-line">
            <li v-for="k in kurang" :key="k.judul" class="flex gap-3 px-4 py-3">
              <Minus :size="15" :stroke-width="1.8" class="mt-0.5 shrink-0 text-[#9aa8a5]" />
              <div class="min-w-0">
                <div class="text-sm font-medium text-ink">{{ k.judul }}</div>
                <p class="mt-0.5 text-xs leading-relaxed text-ink-soft">{{ k.isi }}</p>
              </div>
            </li>
          </ul>
        </section>
      </div>

      <section class="panel p-4">
        <div class="flex items-start gap-3">
          <span
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-line bg-surface text-accent-2"
          >
            <Info :size="15" :stroke-width="1.6" />
          </span>
          <div class="min-w-0">
            <h3 class="text-sm font-semibold text-ink">Kapan paket dasar sudah cukup?</h3>
            <p class="mt-1 text-xs leading-relaxed text-ink-soft">
              Kalau toko hanya butuh kasir, struk, dan stok sederhana, paket dasar sudah cukup.
              Fitur bon, expired, dan pembatasan peran baru terasa manfaatnya kalau toko sudah
              menjalankannya setiap hari. Kami lebih cocok untuk toko yang ingin alurnya
              disesuaikan dan butuh orang yang bisa dihubungi saat ada kendala.
            </p>
          </div>
        </div>
      </section>

      <section class="panel p-4">
        <div class="flex flex-wrap items-center gap-2">
          <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-line bg-surface text-ink-soft">
            <ShieldCheck :size="15" :stroke-width="1.6" />
          </span>
          <h3 class="text-sm font-semibold text-ink">Catatan prototipe</h3>
          <span class="status text-ink-soft">bukan aplikasi final</span>
        </div>
        <p class="mt-2 text-xs leading-relaxed text-ink-soft">
          Yang Anda lihat adalah prototipe fungsional dengan data contoh. Aplikasi final dibangun
          dengan database dan hosting toko. Beberapa batasan sengaja dicatat supaya jelas sejak
          awal.
        </p>
      </section>
    </template>

    <!-- Checklist -->
    <template v-else>
      <section class="panel overflow-hidden">
        <div class="panel-h">
          <div class="flex min-w-0 items-baseline gap-2">
            <span class="panel-title">Checklist untuk penjual mana pun</span>
            <span class="hidden text-xs text-ink-soft sm:inline">{{ tercentang }}/{{ checklist.length }} terjawab</span>
          </div>
          <div class="flex shrink-0 gap-2">
            <button type="button" class="btn btn-sm" @click="resetCek">
              <RotateCcw :size="13" :stroke-width="1.7" />
              Reset
            </button>
            <button type="button" class="btn btn-sm btn-primary" @click="salinCek">
              <Copy :size="13" :stroke-width="1.7" />
              Salin
            </button>
          </div>
        </div>

        <div class="divide-y divide-line">
          <label
            v-for="(q, i) in checklist"
            :key="q.tanya"
            class="flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-surface"
          >
            <input
              v-model="ceklis[i]"
              type="checkbox"
              class="mt-0.5 h-4 w-4 shrink-0 accent-[#0f3d3e]"
            />
            <span class="min-w-0">
              <span
                class="block text-sm text-ink transition-colors"
                :class="ceklis[i] ? 'text-ink-soft line-through' : ''"
              >
                {{ q.tanya }}
              </span>
              <span class="mt-0.5 block text-2xs leading-relaxed text-ink-soft">{{ q.kenapa }}</span>
            </span>
          </label>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-surface px-4 py-2.5">
          <span class="text-2xs text-ink-soft">Tanyakan juga ke kami. Jawaban yang sama berlaku.</span>
          <span class="text-2xs text-ink-soft sm:hidden">{{ tercentang }}/{{ checklist.length }} terjawab</span>
        </div>
      </section>

      <p class="text-2xs leading-relaxed text-ink-soft">
        Checklist ini bisa disalin dan dikirim ke penjual mana pun. Kalau ada penjual yang tidak
        bisa menjawab salah satunya, itu tanda untuk bertanya lebih dalam.
      </p>
    </template>

    <!-- Bukti di demo -->
    <section class="panel overflow-hidden">
      <div class="panel-h">
        <span class="panel-title">Buktikan di demo</span>
        <span class="hidden text-xs text-ink-soft sm:inline">invoice publik tanpa login</span>
      </div>
      <div class="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
        <a
          :href="tautanBon"
          target="_blank"
          rel="noopener"
          class="group flex items-start gap-3 bg-paper p-4 transition-colors hover:bg-surface"
        >
          <span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-line bg-surface text-accent-2">
            <ReceiptText :size="15" :stroke-width="1.6" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="flex flex-wrap items-center gap-2">
              <span class="text-sm font-medium text-ink">Invoice bon tanpa login</span>
              <span class="rounded border border-accent-2/40 px-1 py-px text-[9px] uppercase tracking-[0.06em] text-accent-2">
                tab baru
              </span>
            </span>
            <span class="mt-1 block text-xs leading-relaxed text-ink-soft">
              Buka contoh bon 0069. Pelanggan bisa melihat sisa bon dan mencetak tanpa login.
            </span>
          </span>
          <ExternalLink :size="14" :stroke-width="1.6" class="mt-0.5 shrink-0 text-[#9aa8a5]" />
        </a>

        <RouterLink
          to="/invoice/INV-20261119-0069"
          class="group flex items-start gap-3 bg-paper p-4 transition-colors hover:bg-surface"
        >
          <span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-line bg-surface text-accent-2">
            <MessageCircle :size="15" :stroke-width="1.6" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium text-ink">Coba tombol WA</span>
            <span class="mt-1 block text-xs leading-relaxed text-ink-soft">
              Buka detail invoice, lalu tombol WA. Pesan dan tautan publik terisi otomatis.
            </span>
          </span>
          <ChevronRight :size="15" :stroke-width="1.6" class="mt-0.5 shrink-0 text-[#9aa8a5]" />
        </RouterLink>

        <RouterLink
          to="/piutang"
          class="group flex items-start gap-3 bg-paper p-4 transition-colors hover:bg-surface"
        >
          <span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-line bg-surface text-accent-2">
            <Wallet :size="15" :stroke-width="1.6" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="flex flex-wrap items-center gap-2">
              <span class="text-sm font-medium text-ink">Piutang &amp; bon</span>
              <span class="status text-ink-soft">pemilik</span>
            </span>
            <span class="mt-1 block text-xs leading-relaxed text-ink-soft">
              Daftar bon berjalan, lewat tempo, dan pelunasan sebagian.
            </span>
          </span>
          <ChevronRight :size="15" :stroke-width="1.6" class="mt-0.5 shrink-0 text-[#9aa8a5]" />
        </RouterLink>

        <RouterLink
          to="/kedaluwarsa"
          class="group flex items-start gap-3 bg-paper p-4 transition-colors hover:bg-surface"
        >
          <span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-line bg-surface text-accent-2">
            <CalendarClock :size="15" :stroke-width="1.6" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="flex flex-wrap items-center gap-2">
              <span class="text-sm font-medium text-ink">Expired &amp; FEFO</span>
              <span class="status text-ink-soft">pemilik</span>
            </span>
            <span class="mt-1 block text-xs leading-relaxed text-ink-soft">
              Batch diurutkan tanggal expired dan dipotong otomatis saat penjualan.
            </span>
          </span>
          <ChevronRight :size="15" :stroke-width="1.6" class="mt-0.5 shrink-0 text-[#9aa8a5]" />
        </RouterLink>

        <RouterLink
          to="/laporan"
          class="group flex items-start gap-3 bg-paper p-4 transition-colors hover:bg-surface"
        >
          <span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-line bg-surface text-accent-2">
            <FileSpreadsheet :size="15" :stroke-width="1.6" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="flex flex-wrap items-center gap-2">
              <span class="text-sm font-medium text-ink">Laporan &amp; export</span>
              <span class="status text-ink-soft">pemilik</span>
            </span>
            <span class="mt-1 block text-xs leading-relaxed text-ink-soft">
              Lihat penjualan, lalu unduh CSV atau cetak PDF dari tombol di kanan atas.
            </span>
          </span>
          <ChevronRight :size="15" :stroke-width="1.6" class="mt-0.5 shrink-0 text-[#9aa8a5]" />
        </RouterLink>

        <RouterLink
          to="/kasir"
          class="group flex items-start gap-3 bg-paper p-4 transition-colors hover:bg-surface"
        >
          <span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-line bg-surface text-accent-2">
            <ShoppingCart :size="15" :stroke-width="1.6" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium text-ink">Kasir &amp; struk</span>
            <span class="mt-1 block text-xs leading-relaxed text-ink-soft">
              Coba transaksi tunai atau bon, lalu cetak struk 58/80 mm.
            </span>
          </span>
          <ChevronRight :size="15" :stroke-width="1.6" class="mt-0.5 shrink-0 text-[#9aa8a5]" />
        </RouterLink>
      </div>
    </section>

    <p class="text-2xs leading-relaxed text-ink-soft">
      Harga dan paket komersial dibahas terpisah dari demo. Halaman ini tidak memakai nama merek
      atau angka harga supaya perbandingannya tetap netral.
    </p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  BadgeCheck,
  CalendarClock,
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  FileSpreadsheet,
  Info,
  ListChecks,
  MessageCircle,
  Minus,
  Package,
  ReceiptText,
  RotateCcw,
  Scale,
  ShieldCheck,
  ShoppingCart,
  Store,
  Wallet,
} from 'lucide-vue-next'
import { tautanPublik } from '../data/adapter'
import { useUi } from '../stores/ui'

const ui = useUi()
const tab = ref('banding')
const tautanBon = tautanPublik('INV-20261119-0069')

const tabs = [
  { id: 'banding', label: 'Perbandingan', icon: Scale },
  { id: 'nilai', label: 'Kelebihan & kekurangan', icon: BadgeCheck },
  { id: 'ceklis', label: 'Checklist', icon: ListChecks },
]

const pilihan = [
  {
    judul: 'Aplikasi siap pakai',
    icon: Package,
    isi: 'Dibeli jadi, semua toko memakai template yang sama. Cepat dipakai dan murah di awal.',
    cocok: 'Toko yang hanya butuh kasir, struk, dan stok dasar.',
    catatan: 'Perlu dicek: lisensi perangkat, biaya langganan, dan cara ekspor data.',
    catatanIcon: Info,
    sorot: false,
  },
  {
    judul: 'Paket aplikasi + alat',
    icon: Store,
    isi: 'Aplikasi digabung dengan printer, komputer, atau scanner. Praktis kalau belum punya perangkat.',
    cocok: 'Toko baru yang ingin langsung jalan tanpa membeli alat terpisah.',
    catatan: 'Perlu dicek: aplikasi yang dipakai, lisensi, dan lama pendampingan.',
    catatanIcon: Info,
    sorot: false,
  },
  {
    judul: 'Dibangun untuk toko ini',
    icon: ShieldCheck,
    isi: 'Alur disesuaikan dengan kebiasaan toko: bon, expired, peran, dan struk.',
    cocok: 'Toko yang rutin jual bon atau punya produk ber-expired.',
    catatan: 'Butuh waktu bangun dan input data awal; bukan pilihan termurah di awal.',
    catatanIcon: Info,
    sorot: true,
  },
]

const banding = [
  {
    kriteria: 'Bon, DP & jatuh tempo',
    ket: 'Pelanggan bayar sebagian, sisanya ditagih.',
    murah: 'Jarang',
    paket: 'Tergantung',
    kita: 'Ada',
  },
  {
    kriteria: 'Expired & FEFO',
    ket: 'Batch terdekat dipotong lebih dulu.',
    murah: 'Jarang',
    paket: 'Tergantung',
    kita: 'Ada',
  },
  {
    kriteria: 'Peran pemilik & kasir',
    ket: 'Kasir tidak melihat harga beli dan laba.',
    murah: 'Biasanya 1 admin',
    paket: 'Tergantung',
    kita: 'Ada',
  },
  {
    kriteria: 'Void wajib alasan',
    ket: 'Pembatalan tercatat dan khusus pemilik.',
    murah: 'Jarang',
    paket: 'Perlu dicek',
    kita: 'Ada',
  },
  {
    kriteria: 'Struk thermal 58/80 mm',
    ket: 'Cetak sesuai printer yang dipakai toko.',
    murah: 'Tergantung',
    paket: 'Biasanya ada',
    kita: 'Ada',
  },
  {
    kriteria: 'Invoice publik',
    ket: 'Pelanggan buka dan cetak tanpa login.',
    murah: 'Umumnya tidak',
    paket: 'Umumnya tidak',
    kita: 'Ada',
  },
  {
    kriteria: 'WhatsApp',
    ket: 'Pesan terisi, lalu buka WhatsApp.',
    murah: 'Manual',
    paket: 'Tergantung',
    kita: 'Ada',
  },
  {
    kriteria: 'Export Excel & PDF',
    ket: 'Laporan bisa diunduh atau dicetak.',
    murah: 'Terbatas',
    paket: 'Tergantung',
    kita: 'Ada',
  },
  {
    kriteria: 'Data & hosting',
    ket: 'Di mana data disimpan dan siapa yang backup.',
    murah: 'Server penjual',
    paket: 'Tergantung',
    kita: 'Hosting Anda',
  },
  {
    kriteria: 'Perangkat',
    ket: 'Printer, komputer, dan scanner.',
    murah: 'Tidak termasuk',
    paket: 'Termasuk',
    kita: 'Opsional',
  },
  {
    kriteria: 'Pendampingan',
    ket: 'Bantuan saat aplikasi bermasalah.',
    murah: 'Chat marketplace',
    paket: 'Tergantung vendor',
    kita: 'Langsung',
  },
  {
    kriteria: 'Biaya total',
    ket: 'Bukan hanya harga awal.',
    murah: 'Cek langganan',
    paket: 'Sekali + alat',
    kita: 'Sekali bangun',
  },
]

const lebih = [
  {
    judul: 'Bon dan piutang',
    isi: 'DP, jatuh tempo, pelunasan sebagian, dan sisa bon tampil di invoice maupun struk.',
  },
  {
    judul: 'Expired dan FEFO',
    isi: 'Batch terdekat dipotong lebih dulu; batch rusak bisa ditarik dari rak.',
  },
  {
    judul: 'Peran dan void',
    isi: 'Kasir dibatasi; void khusus pemilik dan wajib memakai alasan.',
  },
  {
    judul: 'Invoice publik',
    isi: 'Pelanggan membuka dan mencetak invoice lewat tautan tanpa login.',
  },
  {
    judul: 'WhatsApp dan export',
    isi: 'Pesan terisi lalu membuka wa.me; laporan bisa diunduh CSV atau dicetak PDF.',
  },
  {
    judul: 'Data di hosting Anda',
    isi: 'Aplikasi final tidak mengunci data di server penjual.',
  },
  {
    judul: 'Pendampingan',
    isi: 'Setup, pelatihan kasir, dan bantuan input data awal.',
  },
]

const kurang = [
  {
    judul: 'Masih prototipe',
    isi: 'Data contoh dan belum tersimpan permanen. Versi final memakai database.',
  },
  {
    judul: 'Belum ada QRIS dinamis dan kartu',
    isi: 'QRIS yang didukung hanya QRIS statis toko. QRIS dinamis per transaksi, kartu, dan e-wallet belum termasuk.',
  },
  {
    judul: 'Belum multi-cabang',
    isi: 'Satu instalasi untuk satu toko; belum ada konsolidasi antar-cabang.',
  },
  {
    judul: 'Belum modul akuntansi',
    isi: 'Laporan penjualan dan stok, bukan neraca atau laporan pajak.',
  },
  {
    judul: 'WhatsApp belum otomatis',
    isi: 'Membuka wa.me; pesan masih dikirim manual dari aplikasi WhatsApp.',
  },
  {
    judul: 'Perangkat tidak termasuk',
    isi: 'Bisa memakai printer dan komputer yang sudah ada; setup dibantu.',
  },
  {
    judul: 'Bukan pilihan termurah',
    isi: 'Cocok kalau butuh penyesuaian dan pendampingan, bukan sekadar struk.',
  },
]

const checklist = [
  {
    tanya: 'Lisensi per perangkat atau bisa banyak perangkat?',
    kenapa: 'Mempengaruhi biaya saat menambah kasir atau komputer.',
  },
  {
    tanya: 'Kalau berhenti berlangganan, data saya bisa diekspor?',
    kenapa: 'Supaya data tidak terkunci saat pindah aplikasi.',
  },
  {
    tanya: 'Data disimpan di mana, dan siapa yang backup?',
    kenapa: 'Pastikan ada salinan dan prosedur pemulihan.',
  },
  {
    tanya: 'Ada biaya tersembunyi: aktivasi, update, atau support?',
    kenapa: 'Harga awal belum tentu sama dengan biaya total.',
  },
  {
    tanya: 'Bisa bon, DP, dan jatuh tempo?',
    kenapa: 'Penting kalau pelanggan sering bayar kemudian.',
  },
  {
    tanya: 'Bisa batch expired dan FEFO?',
    kenapa: 'Penting untuk susu, makanan, dan minuman.',
  },
  {
    tanya: 'Kasir bisa dibatasi dari harga beli dan laba?',
    kenapa: 'Menjaga data sensitif tetap di pemilik.',
  },
  {
    tanya: 'Struk cocok dengan printer thermal saya?',
    kenapa: 'Cek ukuran 58/80 mm dan driver yang dipakai.',
  },
  {
    tanya: 'Support bisa dihubungi saat jam jualan?',
    kenapa: 'Masalah biasanya muncul saat toko sedang ramai.',
  },
  {
    tanya: 'Kalau ada bug, berapa lama perbaikannya?',
    kenapa: 'Tanyakan komitmen waktu perbaikan, bukan hanya janji.',
  },
]

const ceklis = ref(checklist.map(() => false))
const tercentang = computed(() => ceklis.value.filter(Boolean).length)

function nada(nilai) {
  const teks = String(nilai).toLowerCase()
  if (teks === 'ada') return 'border-ok/25 bg-[#eef7f2] text-ok'
  if (teks.startsWith('belum')) return 'border-line bg-surface text-ink-soft'
  if (
    teks.startsWith('tergantung') ||
    teks.startsWith('perlu') ||
    teks.startsWith('cek') ||
    teks.startsWith('opsional') ||
    teks.startsWith('biasanya')
  ) {
    return 'border-warn/25 bg-[#fdf6ec] text-warn'
  }
  return 'border-line bg-surface text-ink-soft'
}

function resetCek() {
  ceklis.value = checklist.map(() => false)
  ui.kabari('Centang checklist direset.', 'info')
}

async function salinCek() {
  const teks = [
    'CHECKLIST MEMILIH APLIKASI KASIR',
    'Tanyakan ke penjual mana pun, termasuk kami.',
    '',
    ...checklist.map(
      (q, i) =>
        `${ceklis.value[i] ? '[x]' : '[ ]'} ${i + 1}. ${q.tanya}\n    ${q.kenapa}`,
    ),
  ].join('\n')

  try {
    await navigator.clipboard.writeText(teks)
    ui.kabari('Checklist disalin. Tempel di WhatsApp atau catatan.', 'ok')
  } catch {
    const ta = document.createElement('textarea')
    ta.value = teks
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const berhasil = document.execCommand('copy')
    ta.remove()
    ui.kabari(
      berhasil
        ? 'Checklist disalin. Tempel di WhatsApp atau catatan.'
        : 'Browser menolak akses clipboard. Salin manual dari daftar.',
      berhasil ? 'ok' : 'warn',
    )
  }
}
</script>
