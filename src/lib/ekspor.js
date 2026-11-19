// Helper ekspor kecil untuk demo statis. Di aplikasi Laravel, unduhan
// dibuat di server (Excel/PDF) dengan isi yang sama.

const sel = (v) => {
  const teks = v === null || v === undefined ? '' : String(v)
  return `"${teks.replace(/"/g, '""')}"`
}

export function unduhCSV(namaFile, baris) {
  const isi = '\uFEFF' + baris.map((r) => r.map(sel).join(';')).join('\r\n')
  const blob = new Blob([isi], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = namaFile.endsWith('.csv') ? namaFile : `${namaFile}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function nomorWA(hp) {
  const angka = String(hp || '').replace(/\D/g, '')
  if (!angka) return ''
  if (angka.startsWith('62')) return angka
  if (angka.startsWith('0')) return `62${angka.slice(1)}`
  return `62${angka}`
}

export function tautanWA(hp, pesan) {
  const nomor = nomorWA(hp)
  return `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`
}
