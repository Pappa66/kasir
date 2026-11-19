import { rupiah, tanggalPendek } from './format'

// Pesan WhatsApp singkat. Tautan publik memakai token agar invoice bisa
// dibuka pelanggan tanpa login.
export function pesanInvoice(trx, toko, tautan) {
  if (!trx) return ''
  const baris = []
  baris.push(`*${toko?.nama_toko || 'Toko'}*`)
  baris.push(`Invoice ${trx.nomor}`)
  baris.push(`${tanggalPendek(trx.tanggal)} ${trx.jam || ''}`.trim())
  if (trx.pelanggan) baris.push(`Pelanggan: ${trx.pelanggan}`)
  baris.push('')
  for (const i of trx.items || []) {
    baris.push(`${i.nama} ${i.qty} ${i.satuan || ''} = ${rupiah(i.subtotal ?? i.qty * i.harga)}`)
  }
  baris.push('')
  baris.push(`Total: ${rupiah(trx.total)}`)
  if (trx.metode === 'bon') {
    baris.push(`Dibayar: ${rupiah(trx.dibayar)}`)
    baris.push(`Sisa bon: ${rupiah(Math.max(0, trx.total - trx.dibayar))}`)
    if (trx.jatuh_tempo) baris.push(`Jatuh tempo: ${tanggalPendek(trx.jatuh_tempo)}`)
  } else {
    baris.push('Status: Lunas (tunai)')
  }
  if (tautan) {
    baris.push('')
    baris.push(`Rincian invoice: ${tautan}`)
  }
  baris.push('')
  baris.push('Terima kasih.')
  return baris.join('\n')
}
