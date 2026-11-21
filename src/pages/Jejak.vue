<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-ink">Jejak aktivitas</h2>
        <p class="mt-0.5 text-xs text-ink-soft">
          Catatan siapa melakukan apa. Hanya pemilik yang bisa membuka halaman ini.
        </p>
      </div>
      <button type="button" class="btn" @click="ekspor">
        <Download :size="15" :stroke-width="1.6" />
        Ekspor CSV
      </button>
    </div>

    <section class="panel">
      <div class="flex flex-wrap items-center gap-2 border-b border-line p-3" data-tour="jejak-filter">
        <select v-model="aksi" class="input h-9 w-full text-xs sm:w-auto" aria-label="Filter aksi">
          <option value="">Semua aksi</option>
          <option v-for="a in daftarAksi" :key="a" :value="a">{{ a }}</option>
        </select>
        <select v-model="orang" class="input h-9 w-full text-xs sm:w-auto" aria-label="Filter pengguna">
          <option value="">Semua pengguna</option>
          <option v-for="o in daftarOrang" :key="o" :value="o">{{ o }}</option>
        </select>
        <div class="relative w-full min-w-0 sm:ml-auto sm:w-64">
          <Search
            :size="15"
            :stroke-width="1.6"
            class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3a0]"
          />
          <input
            v-model="cari"
            type="text"
            class="input h-9 pl-8 text-xs"
            placeholder="Cari invoice, objek, detail…"
          />
        </div>
      </div>

      <div class="hidden overflow-x-auto md:block" data-tour="jejak-tabel">
        <table class="tbl">
          <thead>
            <tr>
              <th class="w-28">Waktu</th>
              <th class="w-36">Pengguna</th>
              <th class="w-40">Aksi</th>
              <th>Objek</th>
              <th>Detail</th>
              <th>Alasan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="l in hasil" :key="l.id">
              <td class="whitespace-nowrap font-mono text-xs">
                {{ tanggalPendek(l.tanggal) }} {{ l.jam }}
              </td>
              <td>
                <div class="text-sm">{{ l.pengguna }}</div>
                <div class="text-2xs text-ink-soft">{{ l.peran }}</div>
              </td>
              <td class="text-xs font-medium">{{ l.aksi }}</td>
              <td class="font-mono text-xs">{{ l.objek || '—' }}</td>
              <td class="text-xs">{{ l.detail || '—' }}</td>
              <td class="text-xs">{{ l.alasan || '—' }}</td>
            </tr>
            <tr v-if="!hasil.length">
              <td colspan="6" class="py-8 text-center text-xs text-ink-soft">
                Tidak ada catatan yang cocok.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="divide-y divide-line md:hidden">
        <div v-for="l in hasil" :key="l.id" class="p-3">
          <div class="flex items-start justify-between gap-2">
            <span class="text-xs font-medium text-ink">{{ l.aksi }}</span>
            <span class="shrink-0 font-mono text-2xs text-ink-soft">
              {{ tanggalPendek(l.tanggal) }} {{ l.jam }}
            </span>
          </div>
          <div class="mt-0.5 text-2xs text-ink-soft">
            {{ l.pengguna }} · {{ l.peran }}
          </div>
          <div class="mt-1 break-all font-mono text-2xs text-ink">{{ l.objek }}</div>
          <div class="mt-0.5 text-xs">{{ l.detail }}</div>
          <div v-if="l.alasan" class="mt-1 text-2xs text-warn">Alasan: {{ l.alasan }}</div>
        </div>
        <div v-if="!hasil.length" class="p-6 text-center text-xs text-ink-soft">
          Tidak ada catatan yang cocok.
        </div>
      </div>
    </section>

    <p class="text-xs leading-relaxed text-ink-soft">
      Jejak tidak bisa dihapus atau diubah dari dalam aplikasi. Di versi Laravel, tabel ini
      append-only dan hanya bisa dibaca pemilik.
    </p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Download, Search } from 'lucide-vue-next'
import { getLog, HARI_INI } from '../data/adapter'
import { unduhCSV } from '../lib/ekspor'
import { tanggalPendek } from '../lib/format'

const log = ref(getLog().map((x) => ({ ...x })))
const aksi = ref('')
const orang = ref('')
const cari = ref('')

const daftarAksi = computed(() => [...new Set(log.value.map((x) => x.aksi))].sort())
const daftarOrang = computed(() => [...new Set(log.value.map((x) => x.pengguna))].sort())

const hasil = computed(() => {
  const q = cari.value.trim().toLowerCase()
  return log.value.filter((l) => {
    if (aksi.value && l.aksi !== aksi.value) return false
    if (orang.value && l.pengguna !== orang.value) return false
    if (!q) return true
    return [l.objek, l.detail, l.alasan, l.pengguna, l.aksi]
      .join(' ')
      .toLowerCase()
      .includes(q)
  })
})

function ekspor() {
  unduhCSV(`jejak-aktivitas-${HARI_INI}.csv`, [
    ['Waktu', 'Pengguna', 'Peran', 'Aksi', 'Objek', 'Detail', 'Alasan'],
    ...hasil.value.map((l) => [
      `${tanggalPendek(l.tanggal)} ${l.jam}`,
      l.pengguna,
      l.peran,
      l.aksi,
      l.objek,
      l.detail,
      l.alasan,
    ]),
  ])
}
</script>
