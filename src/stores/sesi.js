import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getPengaturan } from '../data/adapter'

// Peran demo: Pemilik (semua akses) dan Kasir (kasir, produk, invoice).
// Di aplikasi asli, pengguna aktif datang dari sesi login Laravel.
export const useSesi = defineStore('sesi', () => {
  const daftar = ref(
    getPengaturan().pengguna.map((u, i) => ({
      id: u.id ?? i + 1,
      nama: u.nama,
      role: u.role,
      aktif: u.aktif !== false,
    })),
  )

  const bawaan = daftar.value.find((u) => u.role === 'Pemilik') || daftar.value[0]
  const tersimpan = Number(sessionStorage.getItem('demo-pengguna'))
  const aktifId = ref(daftar.value.some((u) => u.id === tersimpan) ? tersimpan : bawaan.id)

  const aktif = computed(() => daftar.value.find((u) => u.id === aktifId.value) || bawaan)
  const peran = computed(() => (aktif.value.role === 'Pemilik' ? 'pemilik' : 'kasir'))
  const pemilik = computed(() => peran.value === 'pemilik')

  function ganti(id) {
    const u = daftar.value.find((x) => x.id === Number(id))
    if (!u || !u.aktif) return
    aktifId.value = u.id
    sessionStorage.setItem('demo-pengguna', String(u.id))
  }

  return { daftar, aktif, peran, pemilik, ganti }
})
