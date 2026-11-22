import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { BAB_TUR, babUntuk, daftarBab, langkahBab, semuaLangkah } from '../data/tur'
import { useSesi } from './sesi'

// Status tur interaktif. Daftar langkah disimpan di store supaya tur bisa
// berpindah halaman tanpa kehilangan posisi.
export const useTour = defineStore('tour', () => {
  const aktif = ref(false)
  const indeks = ref(0)
  const langkah = ref([])
  const bab = ref(null)
  const sesi = useSesi()

  const kini = computed(() => langkah.value[indeks.value] || null)
  const jumlah = computed(() => langkah.value.length)
  const terakhir = computed(() => indeks.value >= langkah.value.length - 1)
  const babJudul = computed(() => {
    const id = kini.value?.bab || bab.value
    return BAB_TUR.find((b) => b.id === id)?.judul || ''
  })

  function jalankan(daftar, idBab) {
    if (!daftar.length) return false
    langkah.value = daftar
    bab.value = idBab
    indeks.value = 0
    aktif.value = true
    return true
  }

  function mulaiSemua() {
    return jalankan(semuaLangkah(sesi.peran), 'semua')
  }

  // Tombol Tur di topbar: tur lengkap dari awal.
  function mulaiKilat() {
    return mulaiSemua()
  }

  function mulaiBab(id) {
    const b = BAB_TUR.find((x) => x.id === id)
    if (!b) return false
    const daftar = langkahBab(b, sesi.peran)
    if (!daftar.length) return false
    return jalankan(daftar, b.id)
  }

  // Tombol bantuan: jelaskan halaman yang sedang dibuka.
  function mulaiHalaman(path) {
    const b = babUntuk(path, sesi.peran)
    if (!b) return false
    const daftar = langkahBab(b, sesi.peran)
    if (!daftar.length) return false
    return jalankan(daftar, b.id)
  }

  function adaBab(path) {
    return !!babUntuk(path, sesi.peran)
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
    daftar: daftarBab,
    aktif,
    indeks,
    langkah,
    bab,
    kini,
    jumlah,
    terakhir,
    babJudul,
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
