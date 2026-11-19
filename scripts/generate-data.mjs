// Generator data contoh deterministik (dijalankan sekali, hasil disimpan ke JSON)
import { readFileSync, writeFileSync } from 'node:fs'

const produk = JSON.parse(readFileSync(new URL('../src/data/produk.json', import.meta.url)))
let seed = 20261119
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
const int = (a, b) => a + Math.floor(rnd() * (b - a + 1))

// produk murah lebih sering dibeli, seperti pola toko kelontong
const bobot = produk.map((p) => 1 / Math.pow(p.harga_jual, 0.57))
const totalBobot = bobot.reduce((a, b) => a + b, 0)
const pickProduk = () => {
  let r = rnd() * totalBobot
  for (let i = 0; i < produk.length; i++) {
    r -= bobot[i]
    if (r <= 0) return produk[i]
  }
  return produk[produk.length - 1]
}

const kasir = ['Siti', 'Siti', 'Siti', 'Rina']
const pembeli = ['', '', '', '', 'Bu Ani', 'Pak Budi', 'Warung Sari', 'Bu Rina', '']

const transaksi = []
let menit = 8 * 60 + 4

for (let i = 0; i < 68; i++) {
  const jumlahItem = int(2, 4)
  const dipakai = new Set()
  const items = []

  for (let k = 0; k < jumlahItem; k++) {
    let p = pickProduk()
    let guard = 0
    while (dipakai.has(p.id) && guard++ < 25) p = pickProduk()
    dipakai.add(p.id)

    const desimal = p.satuan === 'kg'
    const qty = desimal ? [0.5, 0.75, 1, 1.25, 1.5, 2][int(0, 5)] : int(1, 2)
    items.push({
      produk_id: p.id,
      nama: p.nama,
      satuan: p.satuan,
      qty,
      harga: p.harga_jual,
      subtotal: Math.round(qty * p.harga_jual),
    })
  }

  const subtotal = items.reduce((s, it) => s + it.subtotal, 0)
  const tunai = Math.ceil(subtotal / 5000) * 5000
  menit += int(7, 13)

  transaksi.push({
    id: i + 1,
    nomor: `INV-20261119-${String(i + 1).padStart(4, '0')}`,
    tanggal: '2026-11-19',
    jam: `${String(Math.floor(menit / 60)).padStart(2, '0')}:${String(menit % 60).padStart(2, '0')}`,
    kasir: kasir[int(0, kasir.length - 1)],
    pelanggan: pembeli[int(0, pembeli.length - 1)],
    items,
    subtotal,
    total: subtotal,
    tunai,
    kembalian: tunai - subtotal,
    status: i === 54 ? 'void' : 'selesai',
    void_alasan: i === 54 ? 'Salah input qty' : null,
  })
}

transaksi.sort((a, b) => (a.jam < b.jam ? 1 : -1))
writeFileSync(new URL('../src/data/penjualan.json', import.meta.url), JSON.stringify(transaksi, null, 2))

const sah = transaksi.filter((t) => t.status === 'selesai')
const total = sah.reduce((s, t) => s + t.total, 0)
const baris = sah.reduce((s, t) => s + t.items.length, 0)
console.log('transaksi sah:', sah.length)
console.log('total: Rp', total.toLocaleString('id-ID'))
console.log('rata-rata: Rp', Math.round(total / sah.length).toLocaleString('id-ID'))
console.log('baris item:', baris)
console.log('jam terakhir:', sah[0].jam)
