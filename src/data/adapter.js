// Satu-satunya pintu akses data.
// Saat aplikasi asli dibuat (Laravel + Inertia), file ini diganti
// pemanggilan API/Inertia. Komponen tidak perlu diubah.
import produkData from './produk.json'
import penjualanData from './penjualan.json'
import pengaturanData from './pengaturan.json'
import supplierData from './supplier.json'
import stokMasukData from './stok_masuk.json'
import opnameData from './opname.json'
import batchData from './batch.json'
import { selisihHari } from '../lib/format'

export const HARI_INI = '2026-11-19'

const bulat = (n) => Math.round((Number(n) || 0) * 1000) / 1000
const salin = (o) => JSON.parse(JSON.stringify(o))

export function getPengaturan() {
  return { ...pengaturanData }
}

// ------------------------------------------------------------------ produk
// Cache sesi: perubahan produk bertahan selama tab terbuka.
let cacheProduk = null

export function getProduk() {
  if (!cacheProduk) cacheProduk = produkData.map((p) => ({ ...p }))
  return cacheProduk
}

export function cariProduk(id) {
  return getProduk().find((p) => p.id === Number(id)) || null
}

export function tambahProduk(data) {
  const produk = getProduk()
  const id = Math.max(0, ...produk.map((p) => p.id)) + 1
  const baru = {
    id,
    kode: `BRG-${String(id).padStart(3, '0')}`,
    barcode: '',
    kategori: 'Lainnya',
    satuan: 'pcs',
    satuan_dasar: 'pcs',
    konversi: 1,
    harga_beli: 0,
    harga_jual: 0,
    stok: 0,
    stok_minimum: 5,
    pakai_batch: false,
    expired: null,
    ...data,
    id,
  }
  produk.unshift(baru)
  return baru
}

export function ubahProduk(id, patch) {
  const p = cariProduk(id)
  if (!p) return null
  Object.assign(p, patch)
  return p
}

export function kurangiStok(id, qty) {
  const p = cariProduk(id)
  if (!p) return null
  p.stok = Math.max(0, bulat(p.stok - Number(qty)))
  return p
}

export function tambahStok(id, qty) {
  const p = cariProduk(id)
  if (!p) return null
  p.stok = bulat(p.stok + Number(qty))
  return p
}

// ------------------------------------------------------------------- batch
// Batch dipakai fitur add-on expired/FEFO. Stok batch selalu mencerminkan
// stok produk untuk produk yang punya batch.
let cacheBatch = null

export function getBatch() {
  if (!cacheBatch) cacheBatch = batchData.map((b) => ({ ...b }))
  return cacheBatch
}

export function batchProduk(produkId) {
  return getBatch().filter((b) => b.produk_id === Number(produkId))
}

function sinkronExpired(produkId) {
  const p = cariProduk(produkId)
  if (!p) return
  const aktif = batchProduk(produkId)
    .filter((b) => b.qty > 0 && b.expired)
    .map((b) => b.expired)
    .sort()
  if (aktif.length) p.expired = aktif[0]
  p.pakai_batch = batchProduk(produkId).length > 0
}

export function tambahBatch(data) {
  const batch = getBatch()
  const baru = {
    id: `B-${data.produk_id}-${Date.now().toString(36)}-${batch.length}`,
    kode: `BATCH-${batch.length + 1}`,
    masuk: HARI_INI,
    harga_beli: 0,
    ...data,
  }
  batch.push(baru)
  sinkronExpired(baru.produk_id)
  return baru
}

// FEFO: potong batch dengan tanggal expired terdekat lebih dulu.
// Batch yang sudah lewat tanggal tetap dipakai paling akhir agar stok
// tidak menggantung, tetapi jumlahnya ditandai untuk peringatan.
export function potongBatchFEFO(produkId, qty) {
  const daftar = batchProduk(produkId)
    .filter((b) => b.qty > 0)
    .sort((a, b) => String(a.expired).localeCompare(String(b.expired)))
  let sisa = bulat(qty)
  const terpakai = []
  let lewat = 0

  const ambil = (b) => {
    if (sisa <= 0 || b.qty <= 0) return
    const jumlah = bulat(Math.min(b.qty, sisa))
    b.qty = bulat(b.qty - jumlah)
    sisa = bulat(sisa - jumlah)
    if (b.expired && b.expired < HARI_INI) lewat += jumlah
    terpakai.push({
      batch_id: b.id,
      kode: b.kode,
      expired: b.expired,
      qty: jumlah,
      produk_id: Number(produkId),
    })
  }

  for (const b of daftar) {
    if (sisa <= 0) break
    if (b.expired && b.expired < HARI_INI) continue
    ambil(b)
  }
  for (const b of daftar) {
    if (sisa <= 0) break
    if (!b.expired || b.expired >= HARI_INI) continue
    ambil(b)
  }

  if (terpakai.length) sinkronExpired(produkId)
  return { terpakai, lewat }
}

export function kembalikanBatch(daftar) {
  for (const t of daftar || []) {
    const b = getBatch().find((x) => x.id === t.batch_id)
    if (!b) continue
    b.qty = bulat(b.qty + Number(t.qty))
    sinkronExpired(b.produk_id)
  }
}

export function getKedaluwarsa() {
  const produk = new Map(getProduk().map((p) => [p.id, p]))
  return getBatch()
    .filter((b) => b.qty > 0)
    .map((b) => {
      const p = produk.get(b.produk_id)
      const sisa = selisihHari(b.expired, HARI_INI)
      return {
        ...b,
        produk_nama: p?.nama || `Produk #${b.produk_id}`,
        satuan: p?.satuan || 'pcs',
        kategori: p?.kategori || 'Lainnya',
        sisa_hari: sisa,
        nilai: Math.round(b.qty * (b.harga_beli || p?.harga_beli || 0)),
        status: sisa < 0 ? 'expired' : sisa <= 30 ? 'segera' : 'aman',
      }
    })
    .sort((a, b) => String(a.expired).localeCompare(String(b.expired)))
}

export function getKedaluwarsaRingkas() {
  const daftar = getKedaluwarsa()
  const kena = daftar.filter((b) => b.sisa_hari <= 30)
  return {
    daftar,
    expired: kena.filter((b) => b.sisa_hari < 0).length,
    segera: kena.filter((b) => b.sisa_hari >= 0).length,
    nilai: kena.reduce((s, b) => s + b.nilai, 0),
  }
}

export function tarikBatch(batchId, alasan = '') {
  const b = getBatch().find((x) => x.id === batchId)
  if (!b || b.qty <= 0) return null
  const qty = b.qty
  b.qty = 0
  b.ditarik = HARI_INI
  b.alasan = alasan
  kurangiStok(b.produk_id, qty)
  sinkronExpired(b.produk_id)
  return { ...b, qty_ditarik: qty }
}

// --------------------------------------------------------------- penjualan
// Salinan sesi: transaksi baru / void / pelunasan bon ikut terlihat di
// halaman lain selama tab terbuka. Di aplikasi asli, ini tugas database.
let cachePenjualan = null

// Token publik deterministik supaya tautan invoice bisa dibagikan tanpa
// menyimpan kolom tambahan di data contoh.
export function tokenPublik(nomor) {
  let h = 0
  for (const c of String(nomor)) h = (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0
  return h.toString(36).padStart(8, '0').slice(-8)
}

export function tautanPublik(nomor) {
  const asal = typeof location !== 'undefined' ? location.origin : ''
  return `${asal}/#/publik/${nomor}?token=${tokenPublik(nomor)}`
}

function normalisasiPenjualan(t) {
  const metode = t.metode || 'tunai'
  const statusBayar =
    t.status === 'void' ? 'batal' : t.status_bayar || (metode === 'bon' ? 'belum' : 'lunas')
  return {
    ...t,
    items: t.items.map((i) => ({ ...i, batch: (i.batch || []).map((b) => ({ ...b })) })),
    metode,
    status_bayar: statusBayar,
    dibayar: t.dibayar ?? (metode === 'tunai' ? t.total : 0),
    jatuh_tempo: t.jatuh_tempo ?? null,
    no_hp: t.no_hp || '',
    pembayaran: (t.pembayaran || []).map((p) => ({ ...p })),
    batch_terpakai: (t.batch_terpakai || []).map((b) => ({ ...b })),
    token: tokenPublik(t.nomor),
  }
}

export function getPenjualan() {
  if (!cachePenjualan) cachePenjualan = penjualanData.map(normalisasiPenjualan)
  return cachePenjualan
}

export function tambahPenjualan(transaksi) {
  getPenjualan().unshift(normalisasiPenjualan(transaksi))
}

export function batalkanPenjualan(nomor, alasan) {
  const t = getPenjualan().find((x) => x.nomor === nomor)
  if (!t) return null
  if (t.status === 'void') return t
  t.status = 'void'
  t.void_alasan = alasan
  t.status_bayar = 'batal'
  // Kembalikan stok dan batch supaya angka konsisten setelah void.
  for (const i of t.items) tambahStok(i.produk_id, i.qty)
  kembalikanBatch(t.batch_terpakai)
  return t
}

// ------------------------------------------------------------------ piutang
export function getPiutang() {
  return getPenjualan()
    .filter((t) => t.status === 'selesai' && t.metode === 'bon')
    .map((t) => {
      const sisa = Math.max(0, t.total - t.dibayar)
      const lewat = t.jatuh_tempo ? selisihHari(t.jatuh_tempo, HARI_INI) : null
      return { ...t, sisa, lewat, lunas: sisa <= 0 }
    })
}

export function getPiutangRingkas() {
  const daftar = getPiutang()
  const belum = daftar.filter((t) => t.sisa > 0)
  return {
    daftar,
    jumlah: belum.length,
    total: belum.reduce((s, t) => s + t.sisa, 0),
    lewat: belum.filter((t) => t.lewat !== null && t.lewat < 0).length,
    lunas: daftar.length - belum.length,
  }
}

export function bayarPiutang(nomor, nominal, metode = 'tunai') {
  const t = getPenjualan().find((x) => x.nomor === nomor)
  if (!t || t.metode !== 'bon' || t.status === 'void') return null
  const sisa = Math.max(0, t.total - t.dibayar)
  const bayar = Math.min(bulat(nominal), sisa)
  if (bayar <= 0) return null
  t.dibayar = bulat(t.dibayar + bayar)
  t.pembayaran.push({ tanggal: HARI_INI, nominal: bayar, metode })
  t.status_bayar = t.dibayar >= t.total ? 'lunas' : 'sebagian'
  return t
}

// ------------------------------------------------------------ invoice publik
export function getInvoicePublik(nomor, token) {
  const t = getPenjualan().find((x) => x.nomor === nomor)
  if (!t) return { error: 'notfound' }
  if (!token || token !== tokenPublik(nomor)) return { error: 'token' }
  return { transaksi: t }
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
    .sort((a, b) => a.stok / Math.max(1, a.stok_minimum) - b.stok / Math.max(1, b.stok_minimum))

  const mendekatiExpired = getKedaluwarsa().filter((b) => b.sisa_hari <= 30)
  const piutang = getPiutangRingkas()

  return {
    total,
    jumlahTransaksi: sah.length,
    jumlahVoid: semua.length - sah.length,
    rataRata: sah.length ? Math.round(total / sah.length) : 0,
    itemTerjual,
    terlaris,
    stokKritis,
    mendekatiExpired,
    piutang,
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
let cacheDokumen = null

function dokumenMentah() {
  if (!cacheDokumen) {
    cacheDokumen = stokMasukData.map((d) => ({
      ...d,
      items: d.items.map((i) => ({ ...i })),
    }))
  }
  return cacheDokumen
}

export function getStokMasuk() {
  const produk = new Map(getProduk().map((p) => [p.id, p]))
  const supplier = new Map(getSupplier().map((s) => [s.id, s]))

  return dokumenMentah().map((d) => {
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

export function tambahStokMasuk(doc) {
  const baru = {
    ...doc,
    items: doc.items.map((i) => ({ ...i })),
  }
  dokumenMentah().unshift(baru)
  return baru
}

export function terimaStokMasuk(nomor) {
  const d = dokumenMentah().find((x) => x.nomor === nomor)
  if (!d || d.status === 'diterima') return null
  d.status = 'diterima'
  d.diterima = HARI_INI

  for (const i of d.items) {
    tambahStok(i.produk_id, i.qty)
    ubahProduk(i.produk_id, { harga_beli: i.harga_beli })
    const p = cariProduk(i.produk_id)
    const expired = i.expired || p?.expired || null
    if (expired) {
      tambahBatch({
        produk_id: i.produk_id,
        kode: `${nomor}-${i.produk_id}`,
        expired,
        qty: i.qty,
        harga_beli: i.harga_beli,
        masuk: HARI_INI,
      })
    }
  }
  return d
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

  const piutang = getPiutangRingkas()

  return {
    omzet,
    transaksi: sah.length,
    item,
    laba,
    perJam,
    perKasir,
    perKategori,
    terlaris,
    piutang,
    nilaiStokBeli: produk.reduce((s, p) => s + p.stok * p.harga_beli, 0),
    nilaiStokJual: produk.reduce((s, p) => s + p.stok * p.harga_jual, 0),
    jumlahSku: produk.length,
  }
}

// Ekspor siap pakai untuk komponen (memakai salinan agar aman).
export function snapshotProduk() {
  return salin(getProduk())
}
