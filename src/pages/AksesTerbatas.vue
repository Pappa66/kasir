<template>
  <div class="flex min-h-[60vh] items-center justify-center">
    <section class="panel w-full max-w-lg">
      <div class="flex items-start gap-3 border-b border-line p-4">
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-line bg-surface">
          <Lock :size="17" :stroke-width="1.6" class="text-warn" />
        </div>
        <div class="min-w-0">
          <h2 class="text-base font-semibold text-ink">Halaman ini untuk pemilik</h2>
          <p class="mt-0.5 text-xs leading-relaxed text-ink-soft">
            Anda masuk sebagai <span class="font-medium text-ink">{{ sesi.aktif.nama }}</span>
            ({{ sesi.aktif.role }}). Modul ini tidak termasuk hak akses kasir.
          </p>
        </div>
      </div>

      <div class="space-y-3 p-4">
        <div v-if="dari" class="rounded border border-line bg-surface px-3 py-2">
          <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Diminta</div>
          <div class="mt-0.5 break-all font-mono text-xs text-ink">{{ dari }}</div>
        </div>

        <div>
          <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Yang bisa dibuka kasir</div>
          <div class="mt-1.5 flex flex-wrap gap-1.5">
            <RouterLink
              v-for="m in menuKasir"
              :key="m.to"
              :to="m.to"
              class="btn btn-sm"
            >
              <component :is="m.icon" :size="13" :stroke-width="1.6" />
              {{ m.label }}
            </RouterLink>
          </div>
        </div>

        <p class="text-2xs leading-relaxed text-ink-soft">
          Aplikasi asli memakai login Laravel: kasir tidak akan melihat menu ini sama sekali, bukan
          hanya ditolak setelah diklik.
        </p>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-surface px-4 py-3">
        <RouterLink to="/panduan" class="btn btn-sm">Lihat panduan</RouterLink>
        <div class="flex flex-wrap gap-2">
          <RouterLink to="/kasir" class="btn btn-sm">Ke Kasir</RouterLink>
          <button type="button" class="btn btn-sm btn-primary" @click="jadiPemilik">
            <ShieldCheck :size="14" :stroke-width="1.7" />
            Masuk sebagai pemilik
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  Lock,
  Package,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  BookOpen,
} from 'lucide-vue-next'
import { useSesi } from '../stores/sesi'
import { useUi } from '../stores/ui'

const route = useRoute()
const router = useRouter()
const sesi = useSesi()
const ui = useUi()

const dari = computed(() => {
  const d = route.query.dari
  return typeof d === 'string' && d ? d : ''
})

const menuKasir = [
  { to: '/kasir', label: 'Kasir', icon: ShoppingCart },
  { to: '/produk', label: 'Produk', icon: Package },
  { to: '/invoice', label: 'Invoice', icon: ReceiptText },
  { to: '/panduan', label: 'Panduan', icon: BookOpen },
]

function jadiPemilik() {
  const u = sesi.daftar.find((x) => x.role === 'Pemilik' && x.aktif)
  if (!u) return ui.kabari('Akun pemilik tidak tersedia di data demo.', 'warn')
  sesi.ganti(u.id)
  ui.kabari(`Masuk sebagai ${u.nama} (Pemilik).`, 'ok')
  const tujuan = dari.value && dari.value.startsWith('/') ? dari.value : '/dashboard'
  router.replace(tujuan)
}
</script>
