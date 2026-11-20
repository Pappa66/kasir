import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getPengaturan } from '../data/adapter'

// Peran demo: Pemilik (semua akses) dan Kasir (kasir, produk, invoice, bon).
// Di aplikasi asli, pengguna aktif datang dari sesi login Laravel.
const KUNCI_MASUK = 'demo-masuk'

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

  // Penanda halaman login dummy: berlaku per tab, bukan permanen.
  const masuk = ref(sessionStorage.getItem(KUNCI_MASUK) === '1')

  const aktif = computed(() => daftar.value.find((u) => u.id === aktifId.value) || bawaan)
  const peran = computed(() => (aktif.value.role === 'Pemilik' ? 'pemilik' : 'kasir'))
  const pemilik = computed(() => peran.value === 'pemilik')

  function simpanPengguna(id) {
    aktifId.value = id
    sessionStorage.setItem('demo-pengguna', String(id))
  }

  function ganti(id) {
    const u = daftar.value.find((x) => x.id === Number(id))
    if (!u || !u.aktif) return
    simpanPengguna(u.id)
  }

  // Dipakai halaman login dummy: pilih akun pertama yang aktif untuk peran
  // tersebut, lalu tandai sesi tab ini sudah masuk.
  function masukSebagai(role) {
    const target = role === 'pemilik' ? 'Pemilik' : 'Kasir'
    const u = daftar.value.find((x) => x.role === target && x.aktif)
    if (!u) return false
    simpanPengguna(u.id)
    masuk.value = true
    sessionStorage.setItem(KUNCI_MASUK, '1')
    return true
  }

  function keluar() {
    masuk.value = false
    sessionStorage.removeItem(KUNCI_MASUK)
    sessionStorage.removeItem('demo-pengguna')
  }

  return { daftar, aktif, peran, pemilik, masuk, ganti, masukSebagai, keluar }
})
