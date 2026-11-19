<template>
  <Teleport to="body">
    <div
      v-if="tour.aktif && kotak"
      class="fixed inset-0 z-[70]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-judul"
    >
      <!-- tirai: empat sisi supaya target tetap terlihat -->
      <div
        class="tour-tirai fixed bg-[#0f2f2e]/60"
        :style="{ top: '0px', left: '0px', right: '0px', height: Math.max(0, kotak.top) + 'px' }"
        aria-hidden="true"
      />
      <div
        class="tour-tirai fixed bg-[#0f2f2e]/60"
        :style="{
          top: kotak.top + kotak.height + 'px',
          left: '0px',
          right: '0px',
          bottom: '0px',
        }"
        aria-hidden="true"
      />
      <div
        class="tour-tirai fixed bg-[#0f2f2e]/60"
        :style="{
          top: kotak.top + 'px',
          left: '0px',
          width: Math.max(0, kotak.left) + 'px',
          height: kotak.height + 'px',
        }"
        aria-hidden="true"
      />
      <div
        class="tour-tirai fixed bg-[#0f2f2e]/60"
        :style="{
          top: kotak.top + 'px',
          left: kotak.left + kotak.width + 'px',
          right: '0px',
          height: kotak.height + 'px',
        }"
        aria-hidden="true"
      />

      <!-- sorotan target -->
      <div
        class="tour-sorot pointer-events-none fixed rounded-md ring-2 ring-[#7fc4bd]"
        :style="{
          top: kotak.top + 'px',
          left: kotak.left + 'px',
          width: kotak.width + 'px',
          height: kotak.height + 'px',
          boxShadow: '0 0 0 4px rgba(127,196,189,0.22)',
        }"
        aria-hidden="true"
      />

      <!-- kartu penjelasan -->
      <div
        ref="kartuEl"
        class="tour-kartu fixed rounded-lg border border-line bg-paper p-4 shadow-[0_18px_48px_rgba(15,47,46,0.28)]"
        :style="gayaKartu"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-2xs uppercase tracking-[0.08em] text-ink-soft">
                Langkah {{ nomor }} dari {{ langkah.length }}
              </span>
              <span class="flex gap-1" aria-hidden="true">
                <span
                  v-for="(l, i) in langkah"
                  :key="i"
                  class="h-1 w-3 rounded-full transition-colors"
                  :class="i <= tour.indeks ? 'bg-accent-2' : 'bg-[#dce3e1]'"
                />
              </span>
            </div>
            <h3 id="tour-judul" class="mt-1.5 text-sm font-semibold text-ink">{{ kini.judul }}</h3>
          </div>
          <button
            type="button"
            class="shrink-0 text-ink-soft transition-colors hover:text-ink"
            title="Tutup tur"
            @click="lewati"
          >
            <X :size="16" :stroke-width="1.7" />
          </button>
        </div>

        <p class="mt-1.5 text-xs leading-relaxed text-ink-soft">{{ kini.isi }}</p>

        <div class="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3">
          <button type="button" class="btn btn-ghost btn-sm" @click="lewati">Lewati</button>
          <div class="flex gap-2">
            <button v-if="nomor > 1" type="button" class="btn btn-sm" @click="sebelum">
              Kembali
            </button>
            <button
              ref="tombolLanjut"
              type="button"
              class="btn btn-sm btn-primary"
              @click="lanjut"
            >
              {{ terakhir ? 'Selesai' : 'Lanjut' }}
              <ArrowRight v-if="!terakhir" :size="14" :stroke-width="1.8" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight, X } from 'lucide-vue-next'
import { useTour } from '../stores/tour'
import { useUi } from '../stores/ui'

const langkah = [
  {
    target: '[data-tour="menu"]',
    rute: null,
    posisi: 'kanan',
    judul: 'Semua modul di satu tempat',
    isi: 'Menu di kiri menyesuaikan peran. Pemilik melihat semua modul; kasir hanya Kasir, Produk, Invoice, dan Panduan.',
  },
  {
    target: '[data-tour="peran"]',
    rute: null,
    posisi: 'bawah',
    judul: 'Coba peran lain',
    isi: 'Klik nama pengguna di kanan atas untuk masuk sebagai Pemilik atau Kasir. Halaman yang tidak diizinkan akan menampilkan pesan akses terbatas.',
  },
  {
    target: '[data-tour="cari"]',
    rute: '/kasir',
    posisi: 'bawah',
    judul: 'Cari atau scan barang',
    isi: 'Ketik nama atau kode, atau tembakkan barcode gun USB. Tekan Enter untuk menambah ke keranjang. Kolom ini fokus otomatis saat halaman Kasir dibuka.',
  },
  {
    target: '[data-tour="keranjang"]',
    rute: '/kasir',
    posisi: 'kanan',
    judul: 'Keranjang dan qty',
    isi: 'Qty kg bisa desimal (contoh 0,25). Sistem menolak jumlah melebihi stok. Hapus item lewat ikon silang di ujung baris.',
  },
  {
    target: '[data-tour="bayar"]',
    rute: '/kasir',
    posisi: 'kiri',
    judul: 'Pembayaran tunai',
    isi: 'Masukkan uang diterima atau tekan Uang pas. Kembalian dihitung otomatis, dan tombol Bayar aktif setelah uang cukup.',
  },
  {
    target: '[data-tour="pintasan"]',
    rute: '/kasir',
    posisi: 'kiri',
    judul: 'Struk 58 / 80 mm',
    isi: 'Setelah bayar, struk muncul dan bisa dicetak. Pilih lebar 58 atau 80 mm; hanya struk yang keluar saat print, satu halaman.',
  },
]

const tour = useTour()
const ui = useUi()
const route = useRoute()
const router = useRouter()

const KUNCI_TERLIHAT = 'demo-tur-terlihat'
const KUNCI_AUTO = 'demo-tur-otomatis'
let timerAuto = null

const kotak = ref(null)
const kartuEl = ref(null)
const tombolLanjut = ref(null)
const vw = ref(window.innerWidth)
const vh = ref(window.innerHeight)

const kini = computed(() => langkah[tour.indeks] || langkah[0])
const nomor = computed(() => tour.indeks + 1)
const terakhir = computed(() => tour.indeks === langkah.length - 1)
const gayaKartu = computed(() => {
  if (!kotak.value) return {}
  return {
    top: kotak.value.kartuTop + 'px',
    left: kotak.value.kartuLeft + 'px',
    width: kotak.value.kartuLebar + 'px',
  }
})

let percobaan = null
let jedaUkur = null
let kunci = 0

function ukur() {
  if (!tour.aktif) return
  const el = document.querySelector(kini.value.target)
  if (!el) {
    kotak.value = null
    return
  }
  const r = el.getBoundingClientRect()
  const pad = 6
  const lebar = Math.min(340, vw.value - 24)
  const tinggi = kartuEl.value?.offsetHeight || 218
  const jarak = 12
  const posisi = kini.value.posisi || 'bawah'

  let kx
  let ky
  if (posisi === 'kanan') {
    kx = r.right + jarak
    ky = r.top + 8
    if (kx + lebar > vw.value - 12) {
      kx = vw.value - lebar - 12
      ky = r.bottom + jarak
    }
  } else if (posisi === 'kiri') {
    kx = r.left - jarak - lebar
    ky = r.top + 8
    if (kx < 12) kx = 12
  } else if (posisi === 'atas') {
    kx = r.left + r.width / 2 - lebar / 2
    ky = r.top - jarak - tinggi
  } else {
    kx = r.left + r.width / 2 - lebar / 2
    ky = r.bottom + jarak
  }

  kx = Math.max(12, Math.min(kx, vw.value - lebar - 12))
  ky = Math.max(12, Math.min(ky, vh.value - tinggi - 12))

  kotak.value = {
    top: Math.max(0, r.top - pad),
    left: Math.max(0, r.left - pad),
    width: Math.min(vw.value - Math.max(0, r.left - pad), r.width + pad * 2),
    height: r.height + pad * 2,
    kartuLeft: kx,
    kartuTop: ky,
    kartuLebar: lebar,
  }
}

function jadwalkanUkur() {
  cancelAnimationFrame(jedaUkur)
  jedaUkur = requestAnimationFrame(ukur)
}

function targetkan(ulang = 0) {
  clearTimeout(percobaan)
  nextTick(() => {
    const el = document.querySelector(kini.value.target)
    if (!el) {
      if (ulang < 24) {
        percobaan = setTimeout(() => targetkan(ulang + 1), 70)
      } else {
        kotak.value = null
      }
      return
    }
    const halus = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: halus ? 'smooth' : 'auto' })
    kotak.value = { ...(kotak.value || {}), top: 0, left: 0, width: 0, height: 0 }
    setTimeout(() => {
      ukur()
      nextTick(() => {
        ukur()
        tombolLanjut.value?.focus({ preventScroll: true })
      })
    }, halus ? 280 : 30)
  })
}

async function muat(ulang = 0) {
  if (!tour.aktif) return
  const token = ++kunci
  if (kini.value.rute && route.path !== kini.value.rute) {
    await router.push(kini.value.rute)
    if (token !== kunci || !tour.aktif) return
    await new Promise((r) => setTimeout(r, 260))
  }
  if (token !== kunci) return
  targetkan(ulang)
}

function lanjut() {
  if (terakhir.value) {
    tour.tutup()
    ui.kabari('Tur selesai. Coba transaksi pertama Anda.', 'ok')
    return
  }
  tour.indeks += 1
}

function sebelum() {
  if (tour.indeks > 0) tour.indeks -= 1
}

function lewati() {
  tour.tutup()
}

function tombol(e) {
  if (!tour.aktif) return
  if (e.key === 'Escape') {
    e.preventDefault()
    lewati()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    lanjut()
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    sebelum()
  }
}

function ukuran() {
  vw.value = window.innerWidth
  vh.value = window.innerHeight
  jadwalkanUkur()
}

watch(
  () => tour.aktif,
  (v) => {
    if (v) {
      sessionStorage.setItem(KUNCI_TERLIHAT, '1')
      document.addEventListener('keydown', tombol)
      window.addEventListener('resize', ukuran)
      window.addEventListener('scroll', jadwalkanUkur, true)
      muat()
    } else {
      document.removeEventListener('keydown', tombol)
      window.removeEventListener('resize', ukuran)
      window.removeEventListener('scroll', jadwalkanUkur, true)
      kotak.value = null
      clearTimeout(percobaan)
    }
  },
)

watch(
  () => tour.indeks,
  () => {
    if (tour.aktif) muat()
  },
)

onMounted(() => {
  // Tur otomatis: sekali per tab, bisa dimatikan dari Panduan.
  // Halaman publik (invoice ber-token) tidak pernah memulai tur.
  const auto = localStorage.getItem(KUNCI_AUTO) !== '0'
  const sudah = sessionStorage.getItem(KUNCI_TERLIHAT) === '1'
  if (!auto || sudah || route.meta.publik) return
  timerAuto = setTimeout(() => {
    if (tour.aktif || route.meta.publik) return
    if (sessionStorage.getItem(KUNCI_TERLIHAT) === '1') return
    tour.mulai()
  }, 900)
})

onBeforeUnmount(() => {
  clearTimeout(timerAuto)
  document.removeEventListener('keydown', tombol)
  window.removeEventListener('resize', ukuran)
  window.removeEventListener('scroll', jadwalkanUkur, true)
  clearTimeout(percobaan)
  cancelAnimationFrame(jedaUkur)
})
</script>
