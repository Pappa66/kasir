import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// Keranjang + pembayaran. Mendukung tunai dan bon (add-on piutang).
export const useKeranjang = defineStore('keranjang', () => {
  const items = ref([])
  const tunai = ref(0)
  const pelanggan = ref('')
  const metode = ref('tunai') // tunai | bon
  const noHp = ref('')
  const jatuhTempo = ref('2026-11-26')
  const dp = ref(0)

  const jumlahItem = computed(() => items.value.length)
  const totalQty = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
  const subtotal = computed(() => items.value.reduce((s, i) => s + Math.round(i.qty * i.harga), 0))
  const total = computed(() => subtotal.value)
  const kembalian = computed(() =>
    metode.value === 'tunai' ? Math.max(0, (Number(tunai.value) || 0) - total.value) : 0,
  )
  const sisaBon = computed(() => Math.max(0, total.value - (Number(dp.value) || 0)))
  const bisaBayar = computed(() => {
    if (!items.value.length) return false
    if (metode.value === 'bon') {
      return !!pelanggan.value.trim() && (Number(dp.value) || 0) <= total.value
    }
    return (Number(tunai.value) || 0) >= total.value
  })

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
    metode.value = 'tunai'
    noHp.value = ''
    jatuhTempo.value = '2026-11-26'
    dp.value = 0
  }

  function setTunai(v) {
    tunai.value = Number(v) || 0
  }

  function setMetode(v) {
    metode.value = v === 'bon' ? 'bon' : 'tunai'
  }

  function setDp(v) {
    dp.value = Math.max(0, Number(v) || 0)
  }

  return {
    items,
    tunai,
    pelanggan,
    metode,
    noHp,
    jatuhTempo,
    dp,
    jumlahItem,
    totalQty,
    subtotal,
    total,
    kembalian,
    sisaBon,
    bisaBayar,
    tambah,
    ubahQty,
    naik,
    turun,
    hapus,
    kosongkan,
    setTunai,
    setMetode,
    setDp,
  }
})
