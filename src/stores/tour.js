import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { BAB_TUR, SEMUA_LANGKAH, babUntuk } from '../data/tur'

// Status tur interaktif. Daftar langkah disimpan di store supaya tur bisa
// berpindah halaman tanpa kehilangan posisi.
export const useTour = defineStore('tour', () => {
  const aktif = ref(false)
  const indeks = ref(0)
  const langkah = ref([])
  const bab = ref(null)

  const kini = computed(() => langkah.value[indeks.value] || null)
  const jumlah = computed(() => langkah.value.length)
  const terakhir = computed(() => indeks.value >= langkah.value.length - 1)

  function jalankan(daftar, idBab) {
    if (!daftar.length) return false
    langkah.value = daftar
    bab.value = idBab
    indeks.value = 0
    aktif.value = true
    return true
  }

  function mulaiSemua() {
    return jalankan(SEMUA_LANGKAH, 'semua')
  }

  // Tombol Tur di topbar: tur lengkap dari awal.
  function mulaiKilat() {
    return mulaiSemua()
  }

  function mulaiBab(id) {
    const b = BAB_TUR.find((x) => x.id === id)
    if (!b) return false
    return jalankan(
      b.langkah.map((l) => ({ ...l, rute: l.rute || b.rute, bab: b.id })),
      b.id,
    )
  }

  // Tombol bantuan: jelaskan halaman yang sedang dibuka.
  function mulaiHalaman(path) {
    const b = babUntuk(path)
    if (!b) return false
    return jalankan(
      b.langkah.map((l) => ({ ...l, rute: l.rute || b.rute, bab: b.id })),
      b.id,
    )
  }

  function adaBab(path) {
    return !!babUntuk(path)
  }

  function lanjut() {
    if (!aktif.value) return
    if (indeks.value < langkah.value.length - 1) indeks.value += 1
    else aktif.value = false
  }

  function sebelumnya() {
    if (aktif.value && indeks.value > 0) indeks.value -= 1
  }

  function tutup() {
    aktif.value = false
  }

  return {
    aktif,
    indeks,
    langkah,
    bab,
    kini,
    jumlah,
    terakhir,
    mulaiSemua,
    mulaiKilat,
    mulaiBab,
    mulaiHalaman,
    adaBab,
    lanjut,
    sebelumnya,
    tutup,
  }
})
