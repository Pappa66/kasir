<template>
  <div class="flex min-h-screen flex-col bg-surface">
    <header class="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper px-4 py-3 sm:px-6">
      <div class="flex min-w-0 items-center gap-3">
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-ink text-sm font-semibold text-white"
        >
          PN
        </div>
        <div class="min-w-0">
          <div class="truncate text-sm font-semibold text-ink">{{ toko.nama_toko }}</div>
          <div class="text-2xs text-ink-soft">Demo aplikasi kasir &amp; stok</div>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <a :href="tautanBon" target="_blank" rel="noopener" class="btn btn-sm">
          <ReceiptText :size="14" :stroke-width="1.6" />
          Contoh invoice publik
          <ExternalLink :size="12" :stroke-width="1.6" class="text-ink-soft" />
        </a>
      </div>
    </header>

    <main class="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-8 pb-16 sm:px-6 sm:py-12 sm:pb-16">
      <div class="grid w-full items-start gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <section class="min-w-0">
          <span class="status text-accent-2">
            <ShieldCheck :size="12" :stroke-width="1.8" />
            Halaman masuk dummy
          </span>
          <h1 class="mt-3 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
            Masuk sebagai siapa?
          </h1>
          <p class="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
            Demo ini tidak memakai kata sandi. Pilih peran untuk melihat menu dan tombol yang
            memang tersedia untuk peran tersebut. Pilihan tersimpan selama tab ini terbuka.
          </p>

          <dl class="mt-6 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
            <div class="bg-paper p-3">
              <dt class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Data</dt>
              <dd class="mt-1 text-xs leading-relaxed text-ink">Contoh, bukan data toko asli</dd>
            </div>
            <div class="bg-paper p-3">
              <dt class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Kata sandi</dt>
              <dd class="mt-1 text-xs leading-relaxed text-ink">Tidak ada</dd>
            </div>
            <div class="bg-paper p-3">
              <dt class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Penyimpanan</dt>
              <dd class="mt-1 text-xs leading-relaxed text-ink">Hilang saat tab ditutup</dd>
            </div>
          </dl>

          <p class="mt-4 flex items-start gap-2 text-2xs leading-relaxed text-ink-soft">
            <Info :size="13" :stroke-width="1.6" class="mt-0.5 shrink-0" />
            <span>
              Ingin melihat invoice pelanggan tanpa masuk? Buka contoh invoice publik di kanan atas.
              Tautan itu memang dirancang untuk dibuka tanpa akun.
            </span>
          </p>
        </section>

        <section class="grid gap-3">
          <button
            v-for="p in pilihan"
            :key="p.peran"
            type="button"
            class="panel group flex w-full items-start gap-3 p-4 text-left transition-colors hover:border-accent-2/60 hover:bg-surface"
            :class="p.utama ? 'border-accent-2/50' : ''"
            @click="masuk(p.peran)"
          >
            <span
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-line bg-surface"
              :class="p.utama ? 'text-accent-2' : 'text-ink-soft'"
            >
              <component :is="p.icon" :size="19" :stroke-width="1.6" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="flex flex-wrap items-center gap-2">
                <span class="text-sm font-semibold text-ink">{{ p.label }}</span>
                <span class="status" :class="p.utama ? 'text-accent-2' : 'text-warn'">
                  {{ p.contoh }}
                </span>
              </span>
              <span class="mt-1 block text-xs leading-relaxed text-ink-soft">{{ p.isi }}</span>
              <span class="mt-2 flex flex-wrap gap-1">
                <span
                  v-for="a in p.akses"
                  :key="a"
                  class="rounded border border-line bg-paper px-1.5 py-0.5 text-2xs text-ink-soft"
                >
                  {{ a }}
                </span>
              </span>
            </span>
            <ArrowRight
              :size="16"
              :stroke-width="1.7"
              class="mt-1 shrink-0 text-[#9aa8a5] transition-transform group-hover:translate-x-0.5"
            />
          </button>

          <p class="text-2xs leading-relaxed text-ink-soft">
            Kasir bisa membuat bon dan mencatat pelunasan; void dan laporan tetap khusus pemilik.
            Peran bisa diganti lagi dari menu nama di kanan atas setelah masuk.
          </p>
        </section>
      </div>
    </main>

    <PrototypeBanner penuh />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowRight,
  ExternalLink,
  Info,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  Store,
} from 'lucide-vue-next'
import PrototypeBanner from '../components/PrototypeBanner.vue'
import { getPengaturan, tautanPublik } from '../data/adapter'
import { useSesi } from '../stores/sesi'
import { useUi } from '../stores/ui'

const router = useRouter()
const route = useRoute()
const sesi = useSesi()
const ui = useUi()
const toko = getPengaturan()
const tautanBon = tautanPublik('INV-20261119-0069')

const pilihan = [
  {
    peran: 'pemilik',
    label: 'Masuk sebagai Pemilik',
    contoh: 'H. Ahmad',
    icon: Store,
    isi: 'Akses penuh: dashboard, laporan, laba, stok masuk, opname, pengaturan, dan void.',
    akses: ['Dashboard', 'Laporan', 'Piutang', 'Kedaluwarsa', 'Pengaturan'],
    utama: true,
  },
  {
    peran: 'kasir',
    label: 'Masuk sebagai Kasir',
    contoh: 'Siti',
    icon: ShoppingCart,
    isi: 'Fokus jualan: kasir, produk, invoice, bon, dan panduan. Harga beli serta laba disembunyikan.',
    akses: ['Kasir', 'Produk', 'Invoice', 'Bayar bon'],
    utama: false,
  },
]

const namaAktif = computed(() => sesi.aktif.nama)

function masuk(peran) {
  const berhasil = sesi.masukSebagai(peran)
  if (!berhasil) {
    ui.kabari('Akun demo untuk peran ini tidak tersedia.', 'warn')
    return
  }
  ui.kabari(`Masuk sebagai ${peran === 'pemilik' ? 'Pemilik' : 'Kasir'} (${namaAktif.value}).`, 'ok')

  // Kembali ke halaman yang tadi diminta kalau peran ini memang berhak.
  const dari = typeof route.query.dari === 'string' ? route.query.dari : ''
  const tujuan = dari ? router.resolve(dari) : null
  if (tujuan && (!tujuan.meta.peran || tujuan.meta.peran.includes(peran))) {
    router.replace(dari)
    return
  }
  router.replace(peran === 'pemilik' ? '/dashboard' : '/kasir')
}
</script>
