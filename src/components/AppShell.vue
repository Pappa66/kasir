<template>
  <div class="min-h-screen" data-shell>
    <div
      v-if="navBuka"
      class="fixed inset-0 z-30 bg-ink/50 lg:hidden"
      aria-hidden="true"
      @click="navBuka = false"
    />

    <aside
      id="menu-samping"
      class="fixed inset-y-0 left-0 z-40 flex flex-col bg-ink text-[#a9bcba] transition-[width] duration-200"
      :class="[
        navBuka ? 'w-[232px] shadow-2xl' : 'w-[56px]',
        navCiut ? 'lg:w-[56px] lg:shadow-none' : 'lg:w-[232px] lg:shadow-none',
      ]"
      :data-nav-buka="navBuka ? '1' : '0'"
      :data-nav-ciut="navCiut ? '1' : '0'"
      data-shell-nav
    >
      <div class="flex h-[52px] items-center gap-2 border-b border-white/10 px-4">
        <div
          class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#1c4644] text-[11px] font-semibold text-white"
        >
          {{ inisial }}
        </div>
        <div class="nav-lebar min-w-0">
          <div class="truncate text-xs font-semibold leading-tight text-white" :title="toko.data.nama_toko">
            {{ toko.data.nama_toko }}
          </div>
          <div class="truncate text-2xs text-[#7f9997]">Prototipe aplikasi</div>
        </div>
        <button
          v-if="navBuka"
          type="button"
          class="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded text-[#a9bcba] transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          title="Tutup menu"
          aria-label="Tutup menu"
          @click="navBuka = false"
        >
          <X :size="16" :stroke-width="1.8" />
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto py-3" data-tour="menu">
        <div class="nav-lebar mb-1 px-4 text-2xs uppercase tracking-[0.08em] text-[#5f7a78]">
          Menu
        </div>
        <RouterLink
          v-for="m in menuTampil"
          :key="m.path"
          :to="m.path"
          class="group relative flex h-10 items-center gap-3 px-4 text-sm transition-colors hover:bg-white/5 hover:text-white"
          :class="aktif(m.path) ? 'bg-white/[0.07] text-white' : ''"
          :title="m.label"
          :data-tour="m.addon ? 'lencana' : undefined"
          @click="navBuka = false"
        >
          <span
            v-if="aktif(m.path)"
            class="absolute inset-y-0 left-0 w-[2px] bg-[#59a9a2]"
            aria-hidden="true"
          />
          <component :is="m.icon" :size="18" :stroke-width="1.5" class="shrink-0" />
          <span class="nav-lebar">{{ m.label }}</span>
          <span
            v-if="m.addon"
            class="nav-lebar ml-auto shrink-0 rounded border border-[#59a9a2]/50 px-1 py-px text-[8px] uppercase tracking-[0.06em] text-[#7fc4bd]"
            :title="lencana(m) ? `Fitur tambahan di luar paket dasar. ${lencana(m)} ${m.lencana === 'piutang' ? 'bon berjalan' : 'batch mendekati kedaluwarsa'} perlu dilihat.` : 'Fitur tambahan di luar paket dasar'"
          >
            add-on<template v-if="lencana(m)"> · {{ lencana(m) }}</template>
          </span>
          <span
            v-else-if="lencana(m)"
            class="nav-lebar ml-auto min-w-[18px] rounded-full bg-white/10 px-1 text-center text-[10px] leading-[16px] text-white"
            :title="m.lencana === 'piutang' ? 'Bon berjalan' : 'Batch expired atau segera'"
          >
            {{ lencana(m) }}
          </span>
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
          <span class="nav-lebar">Keluar</span>
        </button>
      </div>
    </aside>

    <div
      class="pl-[56px] transition-[padding] duration-200"
      :class="navCiut ? 'lg:pl-[56px]' : 'lg:pl-[232px]'"
      data-shell-body
    >
      <header
        class="sticky top-0 z-20 flex h-[52px] items-center justify-between gap-2 border-b border-line bg-paper px-2 sm:gap-3 sm:px-4 lg:px-6"
        data-shell-head
      >
        <div class="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <button
            type="button"
            class="btn btn-sm flex h-8 w-8 shrink-0 items-center justify-center px-0 lg:hidden"
            title="Buka menu"
            aria-label="Buka menu"
            aria-controls="menu-samping"
            :aria-expanded="navBuka"
            @click="navBuka = true"
          >
            <Menu :size="16" :stroke-width="1.8" />
          </button>
          <button
            type="button"
            class="btn btn-sm hidden h-8 w-8 shrink-0 items-center justify-center px-0 lg:flex"
            :title="navCiut ? 'Lebarkan menu' : 'Ciutkan menu'"
            :aria-label="navCiut ? 'Lebarkan menu' : 'Ciutkan menu'"
            aria-controls="menu-samping"
            :aria-expanded="!navCiut"
            @click="navCiut = !navCiut"
          >
            <PanelLeftOpen v-if="navCiut" :size="16" :stroke-width="1.8" />
            <PanelLeftClose v-else :size="16" :stroke-width="1.8" />
          </button>
          <h1 class="truncate text-base font-semibold text-ink">{{ judulHalaman }}</h1>
        </div>
        <div class="flex shrink-0 items-center gap-2 sm:gap-3">
          <span class="hidden text-xs text-ink-soft xl:inline">{{ toko.data.nama_toko }}</span>
          <span class="hidden h-4 w-px bg-line xl:block" aria-hidden="true" />

          <div ref="akarTema" class="relative hidden sm:block" data-tour="tema">
            <button
              type="button"
              class="btn btn-sm h-8"
              title="Pilihan tampilan"
              aria-haspopup="menu"
              :aria-expanded="temaOpen"
              @click="temaOpen = !temaOpen"
            >
              <Palette :size="14" :stroke-width="1.8" />
              <span class="hidden md:inline">{{ namaTema }}</span>
            </button>
            <div
              v-if="temaOpen"
              class="absolute right-0 top-[calc(100%+6px)] z-40 w-64 overflow-hidden rounded border border-line bg-paper shadow-[0_8px_28px_rgba(15,47,46,0.16)]"
              role="menu"
            >
              <div class="border-b border-line px-3 py-2 text-2xs uppercase tracking-[0.06em] text-ink-soft">
                Tema demo
              </div>
              <button
                v-for="t in tema.daftar"
                :key="t.id"
                type="button"
                role="menuitem"
                class="flex w-full items-start justify-between gap-2 px-3 py-2 text-left transition-colors hover:bg-surface"
                :class="t.id === tema.aktif ? 'bg-surface' : ''"
                @click="pilihTema(t.id)"
              >
                <span class="min-w-0">
                  <span class="block text-sm text-ink">{{ t.nama }}</span>
                  <span class="block text-2xs leading-snug text-ink-soft">{{ t.ket }}</span>
                </span>
                <Check
                  v-if="t.id === tema.aktif"
                  :size="14"
                  :stroke-width="1.8"
                  class="mt-1 shrink-0 text-accent-2"
                />
              </button>
              <RouterLink
                to="/tema"
                class="block border-t border-line px-3 py-2 text-2xs text-accent-2 hover:bg-surface"
                @click="temaOpen = false"
              >
                Bandingkan ketiganya →
              </RouterLink>
            </div>
          </div>

          <button
            v-if="tour.adaBab(route.path)"
            type="button"
            class="btn btn-sm h-8"
            :class="tour.aktif && tour.kini?.target?.includes('bantuan') ? 'flex' : 'hidden sm:flex'"
            title="Jelaskan halaman ini"
            aria-label="Jelaskan halaman ini"
            data-tour="bantuan"
            @click="tour.mulaiHalaman(route.path)"
          >
            <CircleHelp :size="14" :stroke-width="1.8" />
          </button>

          <button
            type="button"
            class="btn btn-sm h-8"
            title="Mulai tur interaktif"
            aria-label="Mulai tur interaktif"
            data-tour="tur"
            @click="tour.mulaiKilat()"
          >
            <Play :size="14" :stroke-width="1.8" />
            <span class="hidden sm:inline">Tur</span>
          </button>

          <div ref="akarPeran" class="relative" data-tour="peran">
            <button
              type="button"
              class="flex h-8 items-center gap-2 rounded border border-line bg-paper px-2 text-left transition-colors hover:bg-surface"
              :aria-expanded="peranOpen"
              aria-haspopup="menu"
              :title="`Ganti peran (${sesi.aktif.nama} · ${sesi.aktif.role})`"
              @click="peranOpen = !peranOpen"
            >
              <span
                class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold leading-none text-white sm:hidden"
                aria-hidden="true"
              >
                {{ inisialPengguna }}
              </span>
              <span class="hidden max-w-[84px] truncate text-sm text-ink sm:block sm:max-w-[110px]">
                {{ sesi.aktif.nama }}
              </span>
              <span
                class="hidden rounded-sm bg-surface px-1.5 py-0.5 text-[10px] uppercase tracking-[0.04em] sm:inline"
                :class="sesi.pemilik ? 'text-accent-2' : 'text-warn'"
              >
                {{ sesi.aktif.role }}
              </span>
              <ChevronDown
                :size="13"
                :stroke-width="1.8"
                class="text-ink-soft transition-transform"
                :class="peranOpen ? 'rotate-180' : ''"
              />
            </button>

            <div
              v-if="peranOpen"
              class="absolute right-0 top-[calc(100%+6px)] z-40 w-60 overflow-hidden rounded border border-line bg-paper shadow-[0_8px_28px_rgba(15,47,46,0.16)]"
              role="menu"
            >
              <div class="border-b border-line px-3 py-2 text-2xs uppercase tracking-[0.06em] text-ink-soft">
                Mode demo · masuk sebagai
              </div>
              <button
                v-for="u in sesi.daftar"
                :key="u.id"
                type="button"
                role="menuitem"
                class="flex w-full items-center justify-between gap-2 px-3 py-2 text-left transition-colors hover:bg-surface"
                :class="u.id === sesi.aktif.id ? 'bg-surface' : ''"
                @click="pilih(u)"
              >
                <span class="min-w-0">
                  <span class="block truncate text-sm text-ink">{{ u.nama }}</span>
                  <span class="block text-2xs text-ink-soft">{{ u.role }}</span>
                </span>
                <Check
                  v-if="u.id === sesi.aktif.id"
                  :size="14"
                  :stroke-width="1.8"
                  class="shrink-0 text-accent-2"
                />
              </button>
              <div class="border-t border-line bg-surface px-3 py-2 text-2xs leading-relaxed text-ink-soft">
                Ganti peran tanpa keluar. Menu dan tombol menyesuaikan peran yang dipilih.
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="min-w-0 p-3 pb-4 sm:p-4 sm:pb-12 lg:px-6 lg:pb-12 lg:pt-6">
        <slot />
      </main>
    </div>

    <ToastHost />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  ArrowDownToLine,
  ReceiptText,
  ClipboardCheck,
  BarChart3,
  Settings,
  BookOpen,
  Wallet,
  CalendarClock,
  Scale,
  ChevronDown,
  Check,
  LogOut,
  Play,
  Palette,
  ScrollText,
  CircleHelp,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-vue-next'
import ToastHost from './ToastHost.vue'
import { getKedaluwarsaRingkas, getPiutangRingkas } from '../data/adapter'
import { useToko } from '../stores/toko'
import { useUi } from '../stores/ui'
import { useSesi } from '../stores/sesi'
import { useTour } from '../stores/tour'
import { useTema } from '../stores/tema'

const route = useRoute()
const router = useRouter()
const toko = useToko()
const ui = useUi()
const sesi = useSesi()
const tour = useTour()
const tema = useTema()

const menu = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, peran: ['pemilik'] },
  { path: '/kasir', label: 'Kasir', icon: ShoppingCart, peran: ['pemilik', 'kasir'] },
  { path: '/produk', label: 'Produk', icon: Package, peran: ['pemilik', 'kasir'] },
  { path: '/stok-masuk', label: 'Stok Masuk', icon: ArrowDownToLine, peran: ['pemilik'] },
  { path: '/invoice', label: 'Invoice', icon: ReceiptText, peran: ['pemilik', 'kasir'] },
  { path: '/piutang', label: 'Piutang', icon: Wallet, peran: ['pemilik', 'kasir'], addon: true, lencana: 'piutang' },
  { path: '/kedaluwarsa', label: 'Kedaluwarsa', icon: CalendarClock, peran: ['pemilik'], addon: true, lencana: 'expired' },
  { path: '/opname', label: 'Stock Opname', icon: ClipboardCheck, peran: ['pemilik'] },
  { path: '/laporan', label: 'Laporan', icon: BarChart3, peran: ['pemilik'] },
  { path: '/jejak', label: 'Jejak Aktivitas', icon: ScrollText, peran: ['pemilik'] },
  { path: '/pengaturan', label: 'Pengaturan', icon: Settings, peran: ['pemilik'] },
  { path: '/panduan', label: 'Panduan', icon: BookOpen, peran: ['pemilik', 'kasir'] },
  { path: '/panduan-memilih', label: 'Panduan memilih', icon: Scale, peran: ['pemilik', 'kasir'] },
  { path: '/tema', label: 'Pilihan tampilan', icon: Palette, peran: ['pemilik', 'kasir'] },
]

const menuTampil = computed(() => {
  // route.path menjadi pemicu agar angka lencana ikut segar setelah transaksi.
  const _ = route.path
  const piutang = getPiutangRingkas()
  const expired = getKedaluwarsaRingkas()
  return menu
    .filter((m) => m.peran.includes(sesi.peran))
    .map((m) => ({
      ...m,
      _lencana: m.lencana === 'piutang' ? piutang.jumlah : m.lencana === 'expired' ? expired.expired + expired.segera : 0,
    }))
})

const lencana = (m) => (m._lencana > 0 ? m._lencana : 0)

const aktif = (path) => route.path === path || route.path.startsWith(path + '/')
const judulHalaman = computed(() => route.meta.title || 'Kasir')

const peranOpen = ref(false)
const akarPeran = ref(null)
const temaOpen = ref(false)
const akarTema = ref(null)

// Panel menu: di HP membuka drawer lebar, di desktop bisa diciutkan jadi rail ikon.
const navBuka = ref(false)
const navCiut = ref(false)
try {
  navCiut.value = localStorage.getItem('demo-nav-ciut') === '1'
} catch {}
watch(navCiut, (v) => {
  try {
    localStorage.setItem('demo-nav-ciut', v ? '1' : '0')
  } catch {}
})
watch(
  () => route.path,
  () => {
    navBuka.value = false
  },
)
watch(
  () => tour.aktif,
  (v) => {
    if (v) navBuka.value = false
  },
)

const namaTema = computed(
  () => tema.daftar.find((t) => t.id === tema.aktif)?.nama || 'Kasir',
)

function pilihTema(id) {
  tema.pakai(id)
  temaOpen.value = false
  const nama = tema.daftar.find((t) => t.id === tema.aktif)?.nama || 'Kasir'
  ui.kabari(`Tampilan ${nama} dipakai. Data tidak berubah.`, 'info')
}

function klikLuar(e) {
  if (peranOpen.value && akarPeran.value && !akarPeran.value.contains(e.target)) {
    peranOpen.value = false
  }
  if (temaOpen.value && akarTema.value && !akarTema.value.contains(e.target)) {
    temaOpen.value = false
  }
}
function tombolEsc(e) {
  if (e.key === 'Escape') {
    peranOpen.value = false
    temaOpen.value = false
    navBuka.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', klikLuar)
  document.addEventListener('keydown', tombolEsc)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', klikLuar)
  document.removeEventListener('keydown', tombolEsc)
})

function pilih(u) {
  sesi.ganti(u.id)
  peranOpen.value = false
  const izin = route.meta.peran
  if (izin && !izin.includes(sesi.peran)) router.replace('/kasir')
  ui.kabari(`Mode ${u.role.toLowerCase()}: ${u.nama}.`, 'info')
}

const inisialPengguna = computed(() =>
  (sesi.aktif.nama || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((k) => k[0])
    .join('')
    .toUpperCase(),
)

const inisial = computed(() => {
  const kata = toko.data.nama_toko.split(/\s+/).filter((w) => w.toLowerCase() !== 'toko')
  return kata
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
})

function keluar() {
  tour.tutup()
  sesi.keluar()
  ui.kabari('Keluar dari demo. Pilih peran untuk masuk lagi.', 'info')
  router.replace('/login')
}
</script>
