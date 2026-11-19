import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getOpname, getProduk, HARI_INI } from '../data/adapter'

export const useOpname = defineStore('opname', () => {
  const sesi = ref(getOpname())

  const berjalan = computed(() => sesi.value.filter((s) => s.status === 'berjalan'))

  const cari = (id) => sesi.value.find((s) => s.id === Number(id)) || null

  function hitungUlang(s) {
    s.dihitung = s.items.filter((i) => i.hitung !== null).length
    s.selisih = s.items.filter((i) => i.hitung !== null && i.hitung !== i.stok_sistem).length
  }

  function setHitung(id, produkId, nilai) {
    const s = cari(id)
    if (!s) return
    const it = s.items.find((i) => i.produk_id === produkId)
    if (!it) return
    if (nilai === '' || nilai === null || nilai === undefined) {
      it.hitung = null
    } else {
      const v = Number(nilai)
      it.hitung = Number.isNaN(v) || v < 0 ? null : Number(v.toFixed(3))
    }
    hitungUlang(s)
  }

  function setAlasan(id, produkId, teks) {
    const s = cari(id)
    const it = s?.items.find((i) => i.produk_id === produkId)
    if (it) it.alasan = teks
  }

  function isiSisa(id) {
    const s = cari(id)
    if (!s) return
    for (const i of s.items) {
      if (i.hitung === null) i.hitung = i.stok_sistem
    }
    hitungUlang(s)
  }

  function sisaAlasan(s) {
    return s.items.filter((i) => i.hitung !== null && i.hitung !== i.stok_sistem && !i.alasan.trim()).length
  }

  function posting(id) {
    const s = cari(id)
    if (!s) return
    s.status = 'selesai'
    hitungUlang(s)
  }

  function baru(petugas = 'Siti') {
    const id = Math.max(0, ...sesi.value.map((s) => s.id)) + 1
    const urut = String(sesi.value.filter((s) => s.tanggal === HARI_INI).length + 1).padStart(2, '0')
    const items = getProduk().map((p) => ({
      produk_id: p.id,
      nama: p.nama,
      satuan: p.satuan,
      harga_beli: p.harga_beli,
      stok_sistem: p.stok,
      hitung: null,
      alasan: '',
    }))
    const s = {
      id,
      nomor: `OPN-20261119-${urut}`,
      tanggal: HARI_INI,
      petugas,
      status: 'berjalan',
      catatan: '',
      items,
      dihitung: 0,
      selisih: 0,
      total_item: items.length,
    }
    sesi.value.unshift(s)
    return s
  }

  return { sesi, berjalan, cari, setHitung, setAlasan, isiSisa, sisaAlasan, posting, baru }
})
