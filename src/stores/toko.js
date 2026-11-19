import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPengaturan } from '../data/adapter'

// Identitas toko dipakai bersama oleh sidebar, kasir, dan struk.
// Pada aplikasi asli, nilai awal datang dari Inertia props.
export const useToko = defineStore('toko', () => {
  const data = ref(getPengaturan())

  function simpan(patch) {
    data.value = { ...data.value, ...patch }
  }

  return { data, simpan }
})
