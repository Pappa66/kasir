<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-ink">Riwayat transaksi</h2>
        <p class="mt-0.5 text-xs text-ink-soft">
          {{ tanggalPanjang(HARI_INI) }} · {{ semua.length }} transaksi
        </p>
      </div>
      <div class="flex flex-wrap gap-2" data-tour="invoice-aksi">
        <button type="button" class="btn" @click="ekspor">
          <Download :size="15" :stroke-width="1.6" />
          Ekspor CSV
          <AddonTag class="!px-1.5 !py-0 !text-[9px]" />
        </button>
        <RouterLink to="/kasir" class="btn btn-primary">
          <ShoppingCart :size="15" :stroke-width="1.6" />
          Transaksi baru
        </RouterLink>
      </div>
    </div>

    <section class="panel">
      <div class="flex flex-wrap items-center gap-2 border-b border-line p-3" data-tour="invoice-cari">
        <div class="flex rounded border border-line p-0.5">
          <button
            v-for="t in tabs"
            :key="t.id"
            type="button"
            class="rounded px-2.5 py-1 text-xs transition-colors"
            :class="tab === t.id ? 'bg-accent text-white' : 'text-ink-soft hover:bg-surface'"
            @click="tab = t.id"
          >
            {{ t.label }}
            <span :class="tab === t.id ? 'text-white/70' : 'text-ink-soft'">{{ t.jumlah }}</span>
          </button>
        </div>

        <div class="relative w-full min-w-0 sm:ml-auto sm:w-auto sm:max-w-[240px] sm:flex-1">
          <Search
            :size="15"
            :stroke-width="1.6"
            class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3a0]"
          />
          <input v-model="cari" class="input h-9 pl-8" placeholder="Nomor, kasir, pelanggan…" />
        </div>
      </div>

      <div class="hidden overflow-x-auto md:block" data-tour="invoice-tabel">
        <table class="tbl">
          <thead>
            <tr>
              <th>Nomor</th>
              <th class="hidden w-20 sm:table-cell">Jam</th>
              <th class="hidden w-24 md:table-cell">Kasir</th>
              <th class="hidden w-40 lg:table-cell">Pelanggan</th>
              <th class="num hidden w-16 md:table-cell">Item</th>
              <th class="num w-32">Total</th>
              <th class="w-24">Status</th>
              <th class="w-8"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="t in tampil"
              :key="t.nomor"
              class="cursor-pointer"
              @click="buka(t)"
            >
              <td>
                <div class="whitespace-nowrap font-mono text-xs text-ink">{{ t.nomor }}</div>
                <div class="text-2xs text-ink-soft sm:hidden">
                  {{ t.jam }} · {{ t.kasir }}
                </div>
              </td>
              <td class="hidden text-ink-soft tnum sm:table-cell">{{ t.jam }}</td>
              <td class="hidden text-ink-soft md:table-cell">{{ t.kasir }}</td>
              <td class="hidden truncate text-ink-soft lg:table-cell">
                {{ t.pelanggan || '—' }}
              </td>
              <td class="num hidden text-ink-soft md:table-cell">{{ t.items.length }}</td>
              <td class="num font-medium">
                {{ rupiah(t.total) }}
                <div
                  v-if="t.metode === 'bon' && t.status !== 'void' && t.total > t.dibayar"
                  class="text-2xs font-normal text-warn"
                >
                  sisa {{ rupiah(t.total - t.dibayar) }}
                </div>
                <div
                  v-else-if="t.metode !== 'bon' && t.kanal === 'qris'"
                  class="text-2xs font-normal text-accent-2"
                >
                  QRIS
                </div>
              </td>
              <td>
                <span class="status" :class="statusClass(t)">
                  {{ labelStatus(t) }}
                </span>
              </td>
              <td class="text-right text-[#9aa8a5]">
                <ChevronRight :size="15" :stroke-width="1.6" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="divide-y divide-line md:hidden">
        <button
          v-for="t in tampil"
          :key="t.nomor"
          type="button"
          class="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-surface"
          @click="buka(t)"
        >
          <div class="min-w-0 flex-1">
            <div class="font-mono text-xs text-ink">{{ t.nomor }}</div>
            <div class="mt-0.5 truncate text-2xs text-ink-soft">
              {{ t.jam }} · {{ t.kasir }}<template v-if="t.pelanggan"> · {{ t.pelanggan }}</template>
            </div>
          </div>
          <div class="shrink-0 text-right">
            <div class="text-sm font-medium tnum">{{ rupiah(t.total) }}</div>
            <span class="status" :class="statusClass(t)">
              {{ labelStatus(t) }}
            </span>
          </div>
          <ChevronRight :size="16" :stroke-width="1.6" class="shrink-0 text-[#9aa8a5]" />
        </button>
      </div>

      <div v-if="!tampil.length" class="px-4 py-10 text-center">
        <p class="text-sm font-medium text-ink">Tidak ada transaksi</p>
        <p class="mt-1 text-xs text-ink-soft">Ubah filter atau kata kunci pencarian.</p>
      </div>

      <div
        v-if="hasil.length"
        class="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2.5"
      >
        <span class="text-xs text-ink-soft">
          Menampilkan {{ tampil.length }} dari {{ hasil.length }} transaksi
        </span>
        <button
          v-if="tampil.length < hasil.length"
          type="button"
          class="btn btn-sm"
          @click="limit += 12"
        >
          Muat 12 lagi
        </button>
      </div>
    </section>

    <p class="text-xs text-ink-soft">
      Klik baris untuk melihat rincian, mencetak ulang struk, atau membatalkan transaksi.
    </p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronRight, Download, Search, ShoppingCart } from 'lucide-vue-next'
import AddonTag from '../components/AddonTag.vue'
import { getPenjualan, HARI_INI } from '../data/adapter'
import { unduhCSV } from '../lib/ekspor'
import { rupiah, tanggalPanjang, tanggalPendek } from '../lib/format'
import { useUi } from '../stores/ui'

const router = useRouter()
const ui = useUi()
const semua = getPenjualan()
const tab = ref('semua')
const cari = ref('')
const limit = ref(12)

const sisaBon = (t) => Math.max(0, t.total - t.dibayar)
const adalahBon = (t) => t.metode === 'bon' && t.status === 'selesai' && sisaBon(t) > 0

const jumlah = (id) => {
  if (id === 'semua') return semua.length
  if (id === 'selesai') return semua.filter((t) => t.status === 'selesai').length
  if (id === 'bon') return semua.filter(adalahBon).length
  if (id === 'void') return semua.filter((t) => t.status === 'void').length
  return 0
}

const tabs = computed(() => [
  { id: 'semua', label: 'Semua', jumlah: jumlah('semua') },
  { id: 'selesai', label: 'Lunas', jumlah: jumlah('selesai') },
  { id: 'bon', label: 'Bon', jumlah: jumlah('bon') },
  { id: 'void', label: 'Void', jumlah: jumlah('void') },
])

const labelStatus = (t) => {
  if (t.status === 'void') return 'Void'
  if (t.metode === 'bon') return sisaBon(t) > 0 ? `Bon ${rupiah(sisaBon(t))}` : 'Bon lunas'
  return 'Lunas'
}
const statusClass = (t) =>
  t.status === 'void'
    ? 'text-bad'
    : t.metode === 'bon' && sisaBon(t) > 0
      ? 'text-warn'
      : 'text-ok'

const hasil = computed(() => {
  const q = cari.value.trim().toLowerCase()
  return semua.filter((t) => {
    const cocokTab =
      tab.value === 'semua' ||
      (tab.value === 'bon' ? adalahBon(t) : t.status === tab.value)
    const cocokCari =
      !q ||
      t.nomor.toLowerCase().includes(q) ||
      t.kasir.toLowerCase().includes(q) ||
      (t.pelanggan || '').toLowerCase().includes(q) ||
      (t.no_hp || '').toLowerCase().includes(q)
    return cocokTab && cocokCari
  })
})

const tampil = computed(() => hasil.value.slice(0, limit.value))

function buka(t) {
  router.push(`/invoice/${t.nomor}`)
}

function ekspor() {
  if (!hasil.value.length) return ui.kabari('Tidak ada transaksi untuk diekspor.', 'warn')
  const baris = [
    ['Nomor', 'Tanggal', 'Jam', 'Kasir', 'Pelanggan', 'No. HP', 'Metode', 'Kanal', 'Status bayar', 'Total', 'Dibayar', 'Sisa', 'Status'],
    ...hasil.value.map((t) => [
      t.nomor,
      tanggalPendek(t.tanggal),
      t.jam,
      t.kasir,
      t.pelanggan || '',
      t.no_hp || '',
      t.metode === 'bon' ? 'Bon' : 'Lunas',
      t.kanal === 'qris' ? 'QRIS toko' : 'Tunai',
      t.status_bayar,
      t.total,
      t.dibayar,
      t.status === 'void' ? 0 : sisaBon(t),
      t.status === 'void' ? 'Void' : 'Selesai',
    ]),
  ]
  unduhCSV('invoice-20261119.csv', baris)
  ui.kabari(`${hasil.value.length} transaksi diekspor ke CSV.`, 'ok')
}
</script>
