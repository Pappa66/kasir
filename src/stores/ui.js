import { defineStore } from 'pinia'
import { ref } from 'vue'

let timer = null

// Umpan balik singkat untuk aksi yang tidak berpindah halaman.
export const useUi = defineStore('ui', () => {
  const pesan = ref('')
  const nada = ref('info') // info | ok | warn

  function kabari(teks, tone = 'info') {
    pesan.value = teks
    nada.value = tone
    clearTimeout(timer)
    timer = setTimeout(() => (pesan.value = ''), 2800)
  }

  return { pesan, nada, kabari }
})
