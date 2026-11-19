import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useKeranjang = defineStore('keranjang', () => {
  const items = ref([])
  const tunai = ref(0)
  const pelanggan = ref('')

  const jumlahItem = computed(() => items.value.length)
  const totalQty = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
  const subtotal = computed(() => items.value.reduce((s, i) => s + Math.round(i.qty * i.harga), 0))
  const total = computed(() => subtotal.value)
  const kembalian = computed(() => Math.max(0, (Number(tunai.value) || 0) - total.value))
  const bisaBayar = computed(() => items.value.length > 0 && (Number(tunai.value) || 0) >= total.value)

  function tambah(produk) {
    const ada = items.value.find((i) => i.produk_id === produk.id)
    if (ada) {
      ada.qty = batasi(ada.qty + 1, produk)
      return
    }
    items.value.push({
      produk_id: produk.id,
      nama: produk.nama,
      satuan: produk.satuan,
      harga: produk.harga_jual,
      qty: 1,
      stok: produk.stok,
      desimal: produk.satuan === 'kg',
      expired: produk.expired,
    })
  }

  function batasi(qty, item) {
    const step = item.desimal ? 0.25 : 1
    let q = Math.max(step, Math.round(qty / step) * step)
    if (q > item.stok) q = item.stok
    return Number(q.toFixed(3))
  }

  function ubahQty(produkId, qty) {
    const it = items.value.find((i) => i.produk_id === produkId)
    if (!it) return
    it.qty = batasi(Number(qty) || 0, it)
  }

  function naik(produkId) {
    const it = items.value.find((i) => i.produk_id === produkId)
    if (!it) return
    const step = it.desimal ? 0.25 : 1
    it.qty = batasi(it.qty + step, it)
  }

  function turun(produkId) {
    const it = items.value.find((i) => i.produk_id === produkId)
    if (!it) return
    const step = it.desimal ? 0.25 : 1
    if (it.qty - step <= 0) return hapus(produkId)
    it.qty = batasi(it.qty - step, it)
  }

  function hapus(produkId) {
    items.value = items.value.filter((i) => i.produk_id !== produkId)
  }

  function kosongkan() {
    items.value = []
    tunai.value = 0
    pelanggan.value = ''
  }

  function setTunai(v) {
    tunai.value = Number(v) || 0
  }

  return {
    items,
    tunai,
    pelanggan,
    jumlahItem,
    totalQty,
    subtotal,
    total,
    kembalian,
    bisaBayar,
    tambah,
    ubahQty,
    naik,
    turun,
    hapus,
    kosongkan,
    setTunai,
  }
})
