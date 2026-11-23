<template>
  <Teleport to="body">
    <div
      v-if="tour.aktif && kotak"
      class="fixed inset-0 z-[70]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-judul"
    >
      <div
        v-if="kotak.tanpaTarget"
        class="tour-tirai fixed inset-0 bg-[#0f2f2e]/70"
        aria-hidden="true"
      />

      <!-- tirai: empat sisi supaya target tetap terlihat -->
      <div
        v-else
        class="tour-tirai fixed bg-[#0f2f2e]/60"
        :style="{ top: '0px', left: '0px', right: '0px', height: Math.max(0, kotak.top) + 'px' }"
        aria-hidden="true"
      />
      <div
        v-if="!kotak.tanpaTarget"
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
        v-if="!kotak.tanpaTarget"
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
        v-if="!kotak.tanpaTarget"
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
        v-if="!kotak.tanpaTarget"
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
        class="tour-kartu fixed max-h-[calc(100vh-16px)] max-h-[calc(100dvh-16px)] overflow-y-auto overscroll-contain rounded-lg border border-line bg-paper p-4 shadow-[0_18px_48px_rgba(15,47,46,0.28)]"
        :style="gayaKartu"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <div class="flex items-baseline justify-between gap-2">
              <span class="truncate text-2xs uppercase tracking-[0.08em] text-ink-soft">
                {{ tour.babJudul || 'Tur' }}
              </span>
              <span class="shrink-0 text-2xs tnum text-ink-soft">{{ nomor }} / {{ tour.jumlah }}</span>
            </div>
            <div class="mt-1.5 h-1 overflow-hidden rounded-full bg-[#dce3e1]" aria-hidden="true">
              <div
                class="h-full rounded-full bg-accent-2 transition-[width] duration-300"
                :style="{ width: persen + '%' }"
              />
            </div>
            <h3 id="tour-judul" class="mt-2 text-sm font-semibold text-ink">{{ tour.kini.judul }}</h3>
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

        <p class="mt-1.5 text-xs leading-relaxed text-ink-soft">{{ tour.kini.isi }}</p>

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
              {{ tour.terakhir ? 'Selesai' : 'Lanjut' }}
              <ArrowRight v-if="!tour.terakhir" :size="14" :stroke-width="1.8" />
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
import { useSesi } from '../stores/sesi'
import { useTour } from '../stores/tour'
import { useUi } from '../stores/ui'


const tour = useTour()
const ui = useUi()
const sesi = useSesi()
const route = useRoute()
const router = useRouter()

const KUNCI_TERLIHAT = 'demo-tur-terlihat'
const KUNCI_AUTO = 'demo-tur-otomatis'
let timerAuto = null

const kotak = ref(null)
const kartuEl = ref(null)
const tombolLanjut = ref(null)
let pengamatKartu = null
if (typeof ResizeObserver !== 'undefined') {
  pengamatKartu = new ResizeObserver(() => {
    if (tour.aktif) jadwalkanUkur()
  })
}
const vw = ref(document.documentElement.clientWidth)
const vh = ref(window.innerHeight)
const bannerTinggi = ref(0)

const nomor = computed(() => tour.indeks + 1)
const persen = computed(() =>
  tour.jumlah ? Math.round(((tour.indeks + 1) / tour.jumlah) * 100) : 0,
)
const gayaKartu = computed(() => {
  if (!kotak.value) return {}
  if (vw.value < 640) {
    // Panel menempel di sisi yang berlawanan dengan target agar sorotan
    // tidak tertutup kartu. Tinggi mengikuti isi dan tidak keluar layar.
    const atas = kotak.value.letak === 'atas'
    return {
      left: '8px',
      right: '8px',
      top: atas ? '8px' : 'auto',
      bottom: atas ? 'auto' : '8px',
      width: 'auto',
      maxWidth: 'calc(100vw - 16px)',
    }
  }
  return {
    top: kotak.value.kartuTop + 'px',
    left: kotak.value.kartuLeft + 'px',
    width: kotak.value.kartuLebar + 'px',
    maxWidth: 'calc(100vw - 16px)',
    maxHeight: `calc(100dvh - ${bannerTinggi.value + 16}px)`,
  }
})

let percobaan = null
let jedaUkur = null
let kunci = 0
let abaikanRute = null
let hentiTerakhir = 0

function tinggiBanner() {
  const b = document.querySelector('[data-banner]')
  if (!b) return 0
  return getComputedStyle(b).position === 'fixed' ? Math.ceil(b.getBoundingClientRect().height) : 0
}

function kartuTengah(lebar) {
  // Target tidak ada / tidak terlihat di layar ini (mis. tabel desktop di HP):
  // tampilkan kartu di tengah tanpa sorotan agar tur tidak berhenti.
  const tinggiKartu = kartuEl.value?.offsetHeight || 240
  const hp = vw.value < 640
  const lebarAkhir = hp ? Math.min(400, vw.value - 16) : lebar
  const banner = tinggiBanner()
  bannerTinggi.value = banner
  const batasBawah = vh.value - banner - 8
  kotak.value = {
    tanpaTarget: true,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    kartuLeft: Math.max(8, (vw.value - lebarAkhir) / 2),
    kartuTop: hp
      ? Math.max(8, batasBawah - tinggiKartu)
      : Math.max(12, Math.min(vh.value / 2 - tinggiKartu / 2, batasBawah - tinggiKartu)),
    kartuLebar: lebarAkhir,
    letak: 'bawah',
  }
}

function ukur() {
  if (!tour.aktif || !tour.kini) return
  const lebar = Math.min(340, Math.max(200, vw.value - 24))
  let el = document.querySelector(tour.kini.target)
  if (!el) return kartuTengah(lebar)
  let r = el.getBoundingClientRect()
  if (r.width < 2 || r.height < 2) {
    // Elemen memang disembunyikan di layar ini (mis. tombol khusus desktop):
    // tampilkan kartu di tengah tanpa sorotan.
    const gaya = window.getComputedStyle(el)
    if (gaya.display === 'none' || gaya.visibility === 'hidden' || el.offsetParent === null) {
      return kartuTengah(lebar)
    }
    // Elemen ada tetapi runtuh; naik ke wadah terdekat yang terlihat.
    let p = el.parentElement
    while (p && p !== document.body) {
      const b = p.getBoundingClientRect()
      if (b.width > 2 && b.height > 2) {
        el = p
        r = b
        break
      }
      p = p.parentElement
    }
    if (r.width < 2 || r.height < 2) return kartuTengah(lebar)
  }
  const pad = 6
  const tinggi = kartuEl.value?.offsetHeight || 218
  const jarak = 12
  const banner = tinggiBanner()
  bannerTinggi.value = banner
  const batasBawah = vh.value - banner - 8
  const posisi = tour.kini.posisi || 'bawah'

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

  if (vw.value < 640) {
    // Di HP kartu jadi panel bawah yang lebar dan mudah dijangkau jempol;
    // sorotan target tetap terlihat di atasnya.
    const lebarHp = Math.min(400, vw.value - 16)
    kx = (vw.value - lebarHp) / 2
    ky = Math.max(8, batasBawah - tinggi)
    kotak.value = {
      top: Math.max(0, r.top - pad),
      left: Math.max(0, r.left - pad),
      width: Math.min(vw.value - Math.max(0, r.left - pad), r.width + pad * 2),
      height: r.height + pad * 2,
      kartuLeft: kx,
      kartuTop: ky,
      kartuLebar: lebarHp,
      letak: r.top + r.height / 2 > vh.value / 2 ? 'atas' : 'bawah',
    }
    return
  }
  kx = Math.max(12, Math.min(kx, vw.value - lebar - 12))
  ky = Math.max(12, Math.min(ky, batasBawah - tinggi))

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

// Teks langkah bisa membuat kartu lebih tinggi setelah posisi dihitung.
// Amati perubahan tinggi kartu lalu ukur ulang agar tidak menembus banner.
watch(
  kartuEl,
  (el, lama) => {
    if (!pengamatKartu) return
    if (lama) pengamatKartu.unobserve(lama)
    if (el) pengamatKartu.observe(el)
  },
  { flush: 'post' },
)

function targetkan(ulang = 0) {
  clearTimeout(percobaan)
  nextTick(() => {
    const el = document.querySelector(tour.kini.target)
    if (!el) {
      if (ulang < 24) {
        percobaan = setTimeout(() => targetkan(ulang + 1), 70)
      } else {
        ukur()
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
  if (tour.kini.rute && route.path !== tour.kini.rute) {
    const tujuan = tour.kini.rute
    // Tandai perpindahan ini sebagai bagian dari tur, bukan klik menu pengguna.
    abaikanRute = tujuan
    await router.push(tujuan)
    setTimeout(() => {
      if (abaikanRute === tujuan) abaikanRute = null
    }, 1200)
    if (token !== kunci || !tour.aktif) return
    await new Promise((r) => setTimeout(r, 260))
  }
  if (token !== kunci) return
  targetkan(ulang)
}

function lanjut() {
  if (tour.terakhir) {
    tour.tutup()
    ui.kabari('Tur selesai. Coba transaksi pertama Anda.', 'ok')
    return
  }
  tour.lanjut()
}

function sebelum() {
  tour.sebelumnya()
}

function lewati() {
  tour.tutup()
}

function hentikanTur(pesan) {
  if (!tour.aktif) return
  tour.tutup()
  const sekarang = Date.now()
  if (sekarang - hentiTerakhir > 400) {
    ui.kabari(pesan, 'info')
    hentiTerakhir = sekarang
  }
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
  vw.value = document.documentElement.clientWidth
  vh.value = window.innerHeight
  jadwalkanUkur()
}

watch(
  () => tour.aktif,
  (v) => {
    if (v) {
      vw.value = document.documentElement.clientWidth
      vh.value = window.innerHeight
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

function cobaAuto() {
  // Tur otomatis: sekali per tab, bisa dimatikan dari Panduan.
  // Halaman publik (invoice ber-token) dan login tidak memulai tur;
  // setelah masuk ke aplikasi, percobaan diulang lewat watch rute.
  clearTimeout(timerAuto)
  if (localStorage.getItem(KUNCI_AUTO) === '0') return
  if (sessionStorage.getItem(KUNCI_TERLIHAT) === '1') return
  if (tour.aktif || route.meta.publik || route.meta.login) return
  timerAuto = setTimeout(() => {
    if (tour.aktif || route.meta.publik || route.meta.login) return
    if (sessionStorage.getItem(KUNCI_TERLIHAT) === '1') return
    tour.mulaiBab('mulai')
  }, 1200)
}

onMounted(cobaAuto)
watch(() => route.path, (path) => {
  if (!tour.aktif) return cobaAuto()
  if (abaikanRute && path === abaikanRute) {
    abaikanRute = null
    return
  }
  // Pengguna menekan menu sendiri saat tur berjalan: jangan tinggalkan
  // tirai di halaman baru, karena halaman akan terlihat seperti hilang.
  hentikanTur('Tur dihentikan karena Anda pindah halaman. Mulai lagi dari tombol Tur.')
})

watch(
  () => sesi.aktif.id,
  () => {
    if (tour.aktif) {
      hentikanTur('Tur dihentikan karena peran berubah. Tur mengikuti menu peran yang baru.')
    }
  },
)

onBeforeUnmount(() => {
  clearTimeout(timerAuto)
  document.removeEventListener('keydown', tombol)
  window.removeEventListener('resize', ukuran)
  window.removeEventListener('scroll', jadwalkanUkur, true)
  clearTimeout(percobaan)
  cancelAnimationFrame(jedaUkur)
  if (pengamatKartu) pengamatKartu.disconnect()
})
</script>
