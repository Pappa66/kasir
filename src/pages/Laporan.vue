<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-ink">Penjualan &amp; stok</h2>
        <p class="mt-0.5 text-xs text-ink-soft">{{ tanggalPanjang(HARI_INI) }} · data contoh</p>
      </div>
      <div class="flex gap-2">
        <button type="button" class="btn" @click="ekspor">
          <Download :size="15" :stroke-width="1.6" />
          Ekspor CSV
          <span class="rounded border border-line px-1 text-[10px] text-ink-soft">add-on</span>
        </button>
      </div>
    </div>

    <div class="panel grid grid-cols-2 overflow-hidden lg:grid-cols-4">
      <div class="border-b border-r border-line p-4 lg:border-b-0">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Omzet</div>
        <div class="mt-1.5 whitespace-nowrap text-lg font-semibold tnum sm:text-2xl">
          {{ rupiah(l.omzet) }}
        </div>
        <div class="mt-0.5 text-xs text-ink-soft">{{ l.transaksi }} transaksi</div>
      </div>
      <div class="border-b border-line p-4 lg:border-b-0 lg:border-r">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Laba kotor</div>
        <div class="mt-1.5 whitespace-nowrap text-lg font-semibold tnum sm:text-2xl">
          {{ rupiah(l.laba) }}
        </div>
        <div class="mt-0.5 text-xs text-ink-soft">estimasi dari harga beli</div>
      </div>
      <div class="border-b border-r border-line p-4 lg:border-b-0">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Item terjual</div>
        <div class="mt-1.5 text-lg font-semibold tnum sm:text-2xl">{{ angka(l.item) }}</div>
        <div class="mt-0.5 text-xs text-ink-soft">unit, karung, dan kg</div>
      </div>
      <div class="border-b border-line p-4 lg:border-b-0">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Rata-rata / transaksi</div>
        <div class="mt-1.5 whitespace-nowrap text-lg font-semibold tnum sm:text-2xl">
          {{ rupiah(Math.round(l.omzet / l.transaksi)) }}
        </div>
        <div class="mt-0.5 text-xs text-ink-soft">per transaksi</div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <div class="flex rounded border border-line p-0.5">
        <button
          v-for="t in tabs"
          :key="t.id"
          type="button"
          class="rounded px-3 py-1 text-xs transition-colors"
          :class="tab === t.id ? 'bg-accent text-white' : 'text-ink-soft hover:bg-surface'"
          @click="tab = t.id"
        >
          {{ t.label }}
        </button>
      </div>
      <span v-if="tab === 'stok'" class="ml-auto flex items-center gap-2 text-xs text-ink-soft">
        <input id="kritis" v-model="hanyaKritis" type="checkbox" class="h-3.5 w-3.5 accent-[#0f3d3e]" />
        <label for="kritis">Hanya stok menipis</label>
      </span>
    </div>

    <section v-if="tab === 'penjualan'" class="grid gap-4 lg:grid-cols-3">
      <div class="panel min-w-0 lg:col-span-2">
        <div class="panel-h">
          <span class="panel-title">Penjualan per jam</span>
          <span class="text-xs text-ink-soft">jam operasional</span>
        </div>
        <div class="overflow-x-auto">
          <table class="tbl">
            <thead>
              <tr>
                <th class="w-16">Jam</th>
                <th class="num w-24">Transaksi</th>
                <th class="num hidden w-20 sm:table-cell">Item</th>
                <th class="num w-32">Omzet</th>
                <th class="hidden w-32 md:table-cell"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in l.perJam" :key="r.jam">
                <td class="tnum">{{ r.jam }}</td>
                <td class="num text-ink-soft">{{ r.transaksi }}</td>
                <td class="num hidden text-ink-soft sm:table-cell">{{ qty(r.item) }}</td>
                <td class="num font-medium">{{ rupiah(r.total) }}</td>
                <td class="hidden md:table-cell">
                  <div class="h-1.5 w-full overflow-hidden rounded-full bg-[#e8edeb]">
                    <div class="h-full bg-accent-2" :style="{ width: (r.total / maksJam) * 100 + '%' }" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel min-w-0">
        <div class="panel-h">
          <span class="panel-title">Per kasir</span>
        </div>
        <div class="p-4">
          <div v-for="k in l.perKasir" :key="k.kasir" class="mb-3 last:mb-0">
            <div class="flex items-baseline justify-between text-sm">
              <span>{{ k.kasir }}</span>
              <span class="tnum font-medium">{{ rupiah(k.total) }}</span>
            </div>
            <div class="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#e8edeb]">
              <div class="h-full bg-accent-2" :style="{ width: (k.total / l.omzet) * 100 + '%' }" />
            </div>
            <div class="mt-1 text-2xs text-ink-soft">{{ k.transaksi }} transaksi</div>
          </div>

          <div class="mt-4 border-t border-line pt-3">
            <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Kategori</div>
            <div v-for="k in l.perKategori" :key="k.kategori" class="mt-2">
              <div class="flex items-baseline justify-between text-xs">
                <span class="truncate text-ink">{{ k.kategori }}</span>
                <span class="tnum text-ink-soft">{{ rupiah(k.nilai) }}</span>
              </div>
              <div class="mt-1 h-1 w-full overflow-hidden rounded-full bg-[#e8edeb]">
                <div class="h-full bg-accent-2" :style="{ width: (k.nilai / l.perKategori[0].nilai) * 100 + '%' }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="tab === 'stok'" class="space-y-4">
      <div class="panel grid grid-cols-2 overflow-hidden lg:grid-cols-4">
        <div class="border-b border-r border-line p-4 lg:border-b-0">
          <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Jumlah SKU</div>
          <div class="mt-1.5 text-lg font-semibold tnum sm:text-2xl">{{ l.jumlahSku }}</div>
          <div class="mt-0.5 text-xs text-ink-soft">produk aktif</div>
        </div>
        <div class="border-b border-line p-4 lg:border-b-0 lg:border-r">
          <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Nilai stok (beli)</div>
          <div class="mt-1.5 whitespace-nowrap text-lg font-semibold tnum sm:text-2xl">
            {{ rupiah(l.nilaiStokBeli) }}
          </div>
          <div class="mt-0.5 text-xs text-ink-soft">modal tertahan</div>
        </div>
        <div class="border-b border-r border-line p-4 lg:border-b-0">
          <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Nilai stok (jual)</div>
          <div class="mt-1.5 whitespace-nowrap text-lg font-semibold tnum sm:text-2xl">
            {{ rupiah(l.nilaiStokJual) }}
          </div>
          <div class="mt-0.5 text-xs text-ink-soft">potensi omzet</div>
        </div>
        <div class="border-b border-line p-4 lg:border-b-0">
          <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Potensi margin</div>
          <div class="mt-1.5 whitespace-nowrap text-lg font-semibold tnum sm:text-2xl">
            {{ rupiah(l.nilaiStokJual - l.nilaiStokBeli) }}
          </div>
          <div class="mt-0.5 text-xs text-ink-soft">selisih jual − beli</div>
        </div>
      </div>

      <div class="panel min-w-0">
        <div class="panel-h">
          <span class="panel-title">Nilai stok per produk</span>
          <span class="text-xs text-ink-soft">{{ stokTampil.length }} produk</span>
        </div>
        <div class="overflow-x-auto">
          <table class="tbl">
            <thead>
              <tr>
                <th>Produk</th>
                <th class="hidden w-36 md:table-cell">Kategori</th>
                <th class="num w-24">Stok</th>
                <th class="num hidden w-32 sm:table-cell">Harga beli</th>
                <th class="num w-32">Nilai beli</th>
                <th class="num hidden w-32 lg:table-cell">Nilai jual</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in stokTampil" :key="p.id">
                <td>
                  <div class="truncate font-medium">{{ p.nama }}</div>
                  <div class="text-2xs text-ink-soft md:hidden">{{ p.kategori }}</div>
                </td>
                <td class="hidden text-ink-soft md:table-cell">{{ p.kategori }}</td>
                <td class="num" :class="p.stok <= p.stok_minimum ? 'text-warn' : ''">
                  {{ qty(p.stok) }} <span class="text-2xs text-ink-soft">{{ p.satuan }}</span>
                </td>
                <td class="num hidden text-ink-soft sm:table-cell">{{ rupiah(p.harga_beli) }}</td>
                <td class="num font-medium">{{ rupiah(p.stok * p.harga_beli) }}</td>
                <td class="num hidden text-ink-soft lg:table-cell">
                  {{ rupiah(p.stok * p.harga_jual) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="border-t border-line bg-surface">
                <td class="font-medium" colspan="4">Total</td>
                <td class="num font-semibold">{{ rupiah(nilaiBeliTampil) }}</td>
                <td class="num hidden font-semibold lg:table-cell">{{ rupiah(nilaiJualTampil) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>

    <section v-if="tab === 'terlaris'" class="panel min-w-0">
      <div class="panel-h">
        <span class="panel-title">Produk terlaris</span>
        <span class="text-xs text-ink-soft">berdasarkan nilai penjualan</span>
      </div>
      <div class="overflow-x-auto">
        <table class="tbl">
          <thead>
            <tr>
              <th class="w-10">#</th>
              <th>Produk</th>
              <th class="num w-24">Qty</th>
              <th class="num w-32">Nilai</th>
              <th class="hidden w-40 md:table-cell">Porsi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, i) in l.terlaris" :key="p.produk_id">
              <td class="text-ink-soft tnum">{{ i + 1 }}</td>
              <td class="truncate font-medium">{{ p.nama }}</td>
              <td class="num text-ink-soft">{{ qty(p.qty) }}</td>
              <td class="num font-medium">{{ rupiah(p.nilai) }}</td>
              <td class="hidden md:table-cell">
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-[#e8edeb]">
                  <div class="h-full bg-accent-2" :style="{ width: (p.nilai / l.terlaris[0].nilai) * 100 + '%' }" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <p class="text-xs text-ink-soft">
      Laporan dihitung dari transaksi contoh 19/11/2026. Ekspor CSV dan laporan periode lain
      termasuk add-on.
    </p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Download } from 'lucide-vue-next'
import { getLaporan, getProduk, HARI_INI } from '../data/adapter'
import { angka, qty, rupiah, tanggalPanjang } from '../lib/format'
import { useUi } from '../stores/ui'

const ui = useUi()
const l = getLaporan()
const produk = getProduk()

const tab = ref('penjualan')
const hanyaKritis = ref(false)
const tabs = [
  { id: 'penjualan', label: 'Penjualan' },
  { id: 'stok', label: 'Stok' },
  { id: 'terlaris', label: 'Terlaris' },
]

const maksJam = computed(() => Math.max(...l.perJam.map((r) => r.total), 1))
const stokTampil = computed(() =>
  produk.filter((p) => !hanyaKritis.value || p.stok <= p.stok_minimum),
)
const nilaiBeliTampil = computed(() => stokTampil.value.reduce((s, p) => s + p.stok * p.harga_beli, 0))
const nilaiJualTampil = computed(() => stokTampil.value.reduce((s, p) => s + p.stok * p.harga_jual, 0))

function ekspor() {
  ui.kabari('Ekspor CSV adalah add-on (Rp 500.000). Demo hanya menampilkan pratinjau.', 'warn')
}
</script>
