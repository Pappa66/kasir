import { defineStore } from 'pinia'
import { ref } from 'vue'

// Tema demo. Hanya mengubah tampilan; data dan alur tidak terpengaruh.
export const DAFTAR_TEMA = [
  { id: 'kasir', nama: 'Kasir', ket: 'Rapi & cepat — paling aman untuk shift panjang' },
  { id: 'brutal', nama: 'Brutal', ket: 'Berani & mencolok — mudah diingat' },
  { id: 'elegan', nama: 'Elegan', ket: 'Tenang & premium — kesan mahal' },
]

const KUNCI = 'demo-tema'

export function terapkanTema(id) {
  const aman = DAFTAR_TEMA.some((t) => t.id === id) ? id : 'kasir'
  if (typeof document !== 'undefined') document.documentElement.dataset.tema = aman
  return aman
}

export const useTema = defineStore('tema', () => {
  const aktif = ref(terapkanTema(localStorage.getItem(KUNCI) || 'kasir'))

  function pakai(id) {
    aktif.value = terapkanTema(id)
    localStorage.setItem(KUNCI, aktif.value)
  }

  return { aktif, pakai, daftar: DAFTAR_TEMA }
})
