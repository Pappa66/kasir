import { defineStore } from 'pinia'
import { ref } from 'vue'

// Data struk yang sedang dicetak. Dipisah dari modal agar hasil cetak
// tidak terpengaruh layout halaman (fixed/scroll) dan hanya satu halaman.
export const useCetak = defineStore('cetak', () => {
  const isi = ref(null)

  function siapkan(data) {
    isi.value = data
  }

  function bersihkan() {
    isi.value = null
  }

  return { isi, siapkan, bersihkan }
})
