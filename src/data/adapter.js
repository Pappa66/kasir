// Satu-satunya pintu akses data.
// Saat aplikasi asli dibuat (Laravel + Inertia), file ini diganti
// pemanggilan API/Inertia. Komponen tidak perlu diubah.
import produkData from './produk.json'
import penjualanData from './penjualan.json'
import pengaturanData from './pengaturan.json'
import supplierData from './supplier.json'
import stokMasukData from './stok_masuk.json'
import opnameData from './opname.json'
import { selisihHari } from '../lib/format'

export const HARI_INI = '2026-11-19'

export function getPengaturan() {
  return { ...pengaturanData }
}

export function getProduk() {
  return produkData.map((p) => ({ ...p }))
}

// Salinan sesi: transaksi baru / void ikut terlihat di halaman lain
// selama tab terbuka. Di aplikasi asli, ini tugas database.
let cachePenjualan = null

export function getPenjualan() {
  if (!cachePenjualan) {
    cachePenjualan = penjualanData.map((t) => ({
      ...t,
      items: t.items.map((i) => ({ ...i })),
    }))
  }
  return cachePenjualan
}

export function tambahPenjualan(transaksi) {
  getPenjualan().unshift(transaksi)
}

export function batalkanPenjualan(nomor, alasan) {
  const t = getPenjualan().find((x) => x.nomor === nomor)
  if (!t) return null
  t.status = 'void'
  t.void_alasan = alasan
  return t
}

// ---------------------------------------------------------------- dashboard
export function getDashboard() {
  const produk = getProduk()
  const semua = getPenjualan()
  const sah = semua.filter((t) => t.status === 'selesai')

  const total = sah.reduce((s, t) => s + t.total, 0)
  const itemTerjual = Math.round(sah.reduce((s, t) => s + t.items.reduce((a, i) => a + i.qty, 0), 0))

  const peta = new Map()
  for (const t of sah) {
    for (const i of t.items) {
      const cur = peta.get(i.produk_id) || { produk_id: i.produk_id, nama: i.nama, qty: 0, nilai: 0 }
      cur.qty += i.qty
      cur.nilai += i.subtotal
      peta.set(i.produk_id, cur)
    }
  }
  const terlaris = [...peta.values()].sort((a, b) => b.nilai - a.nilai).slice(0, 6)

  const stokKritis = produk
    .filter((p) => p.stok <= p.stok_minimum)
    .sort((a, b) => a.stok / a.stok_minimum - b.stok / b.stok_minimum)

  const mendekatiExpired = produk
    .filter((p) => p.expired && selisihHari(p.expired, HARI_INI) <= 30)
    .map((p) => ({ ...p, sisa_hari: selisihHari(p.expired, HARI_INI) }))
    .sort((a, b) => a.sisa_hari - b.sisa_hari)

  return {
    total,
    jumlahTransaksi: sah.length,
    jumlahVoid: semua.length - sah.length,
    rataRata: sah.length ? Math.round(total / sah.length) : 0,
    itemTerjual,
    terlaris,
    stokKritis,
    mendekatiExpired,
    terakhir: semua.slice(0, 6),
  }
}

export function nomorInvoiceBerikutnya() {
  const semua = getPenjualan()
  const nomorTerakhir = semua.reduce((maks, t) => {
    const n = Number(t.nomor.split('-').pop())
    return Number.isFinite(n) && n > maks ? n : maks
  }, 0)
  return `INV-20261119-${String(nomorTerakhir + 1).padStart(4, '0')}`
}

// ---------------------------------------------------------------- supplier
export function getSupplier() {
  return supplierData.map((s) => ({ ...s }))
}

// --------------------------------------------------------------- stok masuk
export function getStokMasuk() {
  const produk = new Map(getProduk().map((p) => [p.id, p]))
  const supplier = new Map(getSupplier().map((s) => [s.id, s]))

  return stokMasukData.map((d) => {
    const items = d.items.map((i) => {
      const p = produk.get(i.produk_id)
      return {
        ...i,
        nama: p ? p.nama : `Produk #${i.produk_id}`,
        satuan: p ? p.satuan : 'pcs',
        subtotal: i.qty * i.harga_beli,
      }
    })
    return {
      ...d,
      supplier: supplier.get(d.supplier_id)?.nama || '-',
      items,
      total: items.reduce((s, i) => s + i.subtotal, 0),
    }
  })
}

let nomorStokTerakhir = stokMasukData.length
export function nomorStokMasukBerikutnya() {
  nomorStokTerakhir += 1
  return `SM-20261119-${String(nomorStokTerakhir).padStart(3, '0')}`
}

// ------------------------------------------------------------------ opname
export function getOpname() {
  const produk = getProduk()

  return opnameData.map((s) => {
    const terisi = new Map((s.items || []).map((i) => [i.produk_id, i]))
    const items = produk.map((p) => {
      const c = terisi.get(p.id)
      return {
        produk_id: p.id,
        nama: p.nama,
        satuan: p.satuan,
        harga_beli: p.harga_beli,
        stok_sistem: p.stok,
        hitung: c && c.hitung !== null && c.hitung !== undefined ? c.hitung : null,
        alasan: c?.alasan || '',
      }
    })
    const dihitung = items.filter((i) => i.hitung !== null).length
    const selisih = items.filter((i) => i.hitung !== null && i.hitung !== i.stok_sistem).length
    const sudahSelesai = s.status === 'selesai'

    return {
      ...s,
      items,
      dihitung: sudahSelesai ? produk.length : dihitung,
      selisih: sudahSelesai ? s.selisih ?? 0 : selisih,
      total_item: produk.length,
    }
  })
}

// ----------------------------------------------------------------- laporan
export function getLaporan() {
  const produk = getProduk()
  const hargaBeli = new Map(produk.map((p) => [p.id, p.harga_beli]))
  const sah = getPenjualan().filter((t) => t.status === 'selesai')

  const omzet = sah.reduce((s, t) => s + t.total, 0)
  const item = Math.round(sah.reduce((s, t) => s + t.items.reduce((a, i) => a + i.qty, 0), 0))
  const laba = Math.round(
    sah.reduce(
      (s, t) =>
        s + t.items.reduce((a, i) => a + (i.harga - (hargaBeli.get(i.produk_id) || 0)) * i.qty, 0),
      0,
    ),
  )

  const jamMap = new Map()
  for (const t of sah) {
    const jam = t.jam.slice(0, 2) + ':00'
    const cur = jamMap.get(jam) || { jam, transaksi: 0, item: 0, total: 0 }
    cur.transaksi += 1
    cur.item += t.items.reduce((a, i) => a + i.qty, 0)
    cur.total += t.total
    jamMap.set(jam, cur)
  }
  const perJam = [...jamMap.values()].sort((a, b) => a.jam.localeCompare(b.jam))

  const kasirMap = new Map()
  for (const t of sah) {
    const cur = kasirMap.get(t.kasir) || { kasir: t.kasir, transaksi: 0, total: 0 }
    cur.transaksi += 1
    cur.total += t.total
    kasirMap.set(t.kasir, cur)
  }
  const perKasir = [...kasirMap.values()].sort((a, b) => b.total - a.total)

  const produkMap = new Map()
  for (const t of sah) {
    for (const i of t.items) {
      const cur = produkMap.get(i.produk_id) || { produk_id: i.produk_id, nama: i.nama, qty: 0, nilai: 0 }
      cur.qty += i.qty
      cur.nilai += i.subtotal
      produkMap.set(i.produk_id, cur)
    }
  }
  const terlaris = [...produkMap.values()].sort((a, b) => b.nilai - a.nilai)

  const kategoriProduk = new Map(produk.map((p) => [p.id, p.kategori]))
  const kategoriMap = new Map()
  for (const t of sah) {
    for (const i of t.items) {
      const nama = kategoriProduk.get(i.produk_id) || 'Lainnya'
      const cur = kategoriMap.get(nama) || { kategori: nama, nilai: 0, qty: 0 }
      cur.nilai += i.subtotal
      cur.qty += i.qty
      kategoriMap.set(nama, cur)
    }
  }
  const perKategori = [...kategoriMap.values()].sort((a, b) => b.nilai - a.nilai)

  return {
    omzet,
    transaksi: sah.length,
    item,
    laba,
    perJam,
    perKasir,
    perKategori,
    terlaris,
    nilaiStokBeli: produk.reduce((s, p) => s + p.stok * p.harga_beli, 0),
    nilaiStokJual: produk.reduce((s, p) => s + p.stok * p.harga_jual, 0),
    jumlahSku: produk.length,
  }
}
