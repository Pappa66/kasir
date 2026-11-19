export const rupiah = (n) => {
  const v = Math.round(Number(n) || 0)
  return 'Rp ' + v.toLocaleString('id-ID')
}

export const angka = (n, desimal = 0) => {
  const v = Number(n) || 0
  return v.toLocaleString('id-ID', {
    minimumFractionDigits: desimal,
    maximumFractionDigits: 3,
  })
}

export const qty = (n) => {
  const v = Number(n) || 0
  return Number.isInteger(v) ? v.toLocaleString('id-ID') : v.toLocaleString('id-ID', { maximumFractionDigits: 3 })
}

export const tanggalPanjang = (iso) => {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const tanggalPendek = (iso) => {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export const selisihHari = (iso, dari) => {
  const a = new Date(iso + 'T00:00:00').getTime()
  const b = new Date(dari + 'T00:00:00').getTime()
  return Math.round((a - b) / 86400000)
}
