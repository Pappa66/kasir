<template>
  <div class="min-h-screen">
    <aside
      class="fixed inset-y-0 left-0 z-30 flex w-[56px] flex-col bg-ink text-[#a9bcba] lg:w-[232px]"
    >
      <div class="flex h-[52px] items-center gap-2 border-b border-white/10 px-4">
        <div
          class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#1c4644] text-[11px] font-semibold text-white"
        >
          {{ inisial }}
        </div>
        <div class="hidden min-w-0 lg:block">
          <div class="truncate text-xs font-semibold leading-tight text-white" :title="toko.data.nama_toko">
            {{ toko.data.nama_toko }}
          </div>
          <div class="truncate text-2xs text-[#7f9997]">Prototipe aplikasi</div>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto py-3">
        <div class="mb-1 hidden px-4 text-2xs uppercase tracking-[0.08em] text-[#5f7a78] lg:block">
          Menu
        </div>
        <RouterLink
          v-for="m in menu"
          :key="m.path"
          :to="m.path"
          class="group relative flex h-10 items-center gap-3 px-4 text-sm transition-colors hover:bg-white/5 hover:text-white"
          :class="aktif(m.path) ? 'bg-white/[0.07] text-white' : ''"
          :title="m.label"
        >
          <span
            v-if="aktif(m.path)"
            class="absolute inset-y-0 left-0 w-[2px] bg-[#59a9a2]"
            aria-hidden="true"
          />
          <component :is="m.icon" :size="18" :stroke-width="1.5" class="shrink-0" />
          <span class="hidden lg:block">{{ m.label }}</span>
        </RouterLink>
      </nav>

      <div class="border-t border-white/10 py-2">
        <button
          class="flex h-10 w-full items-center gap-3 px-4 text-sm text-[#a9bcba] transition-colors hover:bg-white/5 hover:text-white"
          type="button"
          title="Keluar"
          @click="keluar"
        >
          <LogOut :size="18" :stroke-width="1.5" class="shrink-0" />
          <span class="hidden lg:block">Keluar</span>
        </button>
      </div>
    </aside>

    <div class="pl-[56px] lg:pl-[232px]">
      <header
        class="sticky top-0 z-20 flex h-[52px] items-center justify-between gap-3 border-b border-line bg-paper px-3 sm:px-4 lg:px-6"
      >
        <div class="flex min-w-0 items-center gap-3">
          <h1 class="truncate text-base font-semibold text-ink">{{ judulHalaman }}</h1>
        </div>
        <div class="flex shrink-0 items-center gap-2 sm:gap-3">
          <span class="hidden text-xs text-ink-soft xl:inline">{{ toko.data.nama_toko }}</span>
          <span class="hidden h-4 w-px bg-line xl:block" aria-hidden="true" />
          <span class="text-sm text-ink">{{ toko.data.kasir_aktif }}</span>
          <span class="hidden text-xs text-ink-soft sm:inline">{{ toko.data.role_aktif }}</span>
        </div>
      </header>

      <main class="min-w-0 p-3 pb-12 sm:p-4 sm:pb-12 lg:px-6 lg:pb-12 lg:pt-6">
        <slot />
      </main>
    </div>

    <ToastHost />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  ArrowDownToLine,
  ReceiptText,
  ClipboardCheck,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-vue-next'
import ToastHost from './ToastHost.vue'
import { useToko } from '../stores/toko'
import { useUi } from '../stores/ui'

const route = useRoute()
const toko = useToko()
const ui = useUi()

const menu = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/kasir', label: 'Kasir', icon: ShoppingCart },
  { path: '/produk', label: 'Produk', icon: Package },
  { path: '/stok-masuk', label: 'Stok Masuk', icon: ArrowDownToLine },
  { path: '/invoice', label: 'Invoice', icon: ReceiptText },
  { path: '/opname', label: 'Stock Opname', icon: ClipboardCheck },
  { path: '/laporan', label: 'Laporan', icon: BarChart3 },
  { path: '/pengaturan', label: 'Pengaturan', icon: Settings },
]

const aktif = (path) => route.path === path || route.path.startsWith(path + '/')
const judulHalaman = computed(() => route.meta.title || 'Kasir')

const inisial = computed(() => {
  const kata = toko.data.nama_toko.split(/\s+/).filter((w) => w.toLowerCase() !== 'toko')
  return kata
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
})

function keluar() {
  ui.kabari('Demo tanpa autentikasi. Sesi berakhir saat tab ditutup.', 'info')
}
</script>
