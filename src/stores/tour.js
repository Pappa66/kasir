import { defineStore } from 'pinia'
import { ref } from 'vue'

// Status tur interaktif. Indeks disimpan di store agar tidak hilang
// saat tur berpindah halaman.
export const useTour = defineStore('tour', () => {
  const aktif = ref(false)
  const indeks = ref(0)

  function mulai() {
    indeks.value = 0
    aktif.value = true
  }

  function tutup() {
    aktif.value = false
  }

  return { aktif, indeks, mulai, tutup }
})
