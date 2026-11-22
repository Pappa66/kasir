<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-ink">Penjualan &amp; stok</h2>
        <p class="mt-0.5 text-xs text-ink-soft">{{ tanggalPanjang(HARI_INI) }} · data contoh</p>
      </div>
      <div class="flex flex-wrap gap-2" data-no-print data-tour="lap-aksi">
        <button type="button" class="btn" @click="ekspor">
          <Download :size="15" :stroke-width="1.6" />
          Ekspor CSV
          <AddonTag class="!px-1.5 !py-0 !text-[9px]" />
        </button>
        <button type="button" class="btn" @click="cetakPDF">
          <Printer :size="15" :stroke-width="1.6" />
          Cetak PDF
          <AddonTag class="!px-1.5 !py-0 !text-[9px]" />
        </button>
      </div>
    </div>

    <div class="panel grid grid-cols-2 gap-px overflow-hidden bg-line lg:grid-cols-3" data-tour="lap-kpi">
      <div class="min-w-0 bg-paper p-4">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Omzet</div>
        <div class="mt-1.5 whitespace-nowrap text-lg font-semibold tnum sm:text-2xl">
          {{ rupiah(l.omzet) }}
        </div>
        <div class="mt-0.5 text-xs text-ink-soft">
          {{ l.transaksi }} transaksi · rata-rata {{ rupiah(Math.round(l.omzet / l.transaksi)) }}
        </div>
      </div>
      <div class="min-w-0 bg-paper p-4">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">HPP</div>
        <div class="mt-1.5 whitespace-nowrap text-lg font-semibold tnum sm:text-2xl">
          {{ rupiah(l.hpp) }}
        </div>
        <div class="mt-0.5 text-xs text-ink-soft">modal barang terjual</div>
      </div>
      <div class="min-w-0 bg-paper p-4">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Laba kotor</div>
        <div class="mt-1.5 whitespace-nowrap text-lg font-semibold tnum sm:text-2xl">
          {{ rupiah(l.labaKotor) }}
        </div>
        <div class="mt-0.5 text-xs text-ink-soft">{{ persenMargin }}% dari omzet</div>
      </div>
      <div class="min-w-0 bg-paper p-4">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Biaya operasional</div>
        <div class="relative mt-1.5">
          <span class="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-ink-soft">Rp</span>
          <input
            :value="biayaTeks"
            type="text"
            inputmode="numeric"
            aria-label="Biaya operasional hari ini"
            class="input h-8 w-full pl-7 text-sm tnum"
            @input="ubahBiaya"
          />
        </div>
        <div class="mt-0.5 text-xs text-ink-soft">isi manual · demo</div>
      </div>
      <div class="min-w-0 bg-paper p-4">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Laba bersih</div>
        <div
          class="mt-1.5 whitespace-nowrap text-lg font-semibold tnum sm:text-2xl"
          :class="labaBersih >= 0 ? 'text-ok' : 'text-bad'"
        >
          {{ rupiah(labaBersih) }}
        </div>
        <div class="mt-0.5 text-xs text-ink-soft">laba kotor − biaya</div>
      </div>
      <div class="min-w-0 bg-paper p-4">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Item terjual</div>
        <div class="mt-1.5 text-lg font-semibold tnum sm:text-2xl">{{ angka(l.item) }}</div>
        <div class="mt-0.5 text-xs text-ink-soft">unit, karung, dan kg</div>
      </div>
    </div>

    <p class="text-xs leading-relaxed text-ink-soft" data-no-print>
      Laba kotor = omzet − HPP. Laba bersih = laba kotor − biaya operasional. Biaya operasional
      diisi manual di demo ini; di aplikasi final bisa dicatat per periode.
    </p>

    <section class="panel" data-tour="lap-void">
      <div class="panel-h">
        <span class="panel-title">Void hari ini</span>
        <span class="text-xs" :class="l.void.jumlah ? 'text-bad' : 'text-ink-soft'">
          {{ l.void.jumlah }} transaksi · {{ rupiah(l.void.nilai) }}
          <template v-if="l.void.tinjau"> · {{ l.void.tinjau }} perlu tinjauan</template>
        </span>
      </div>
      <div v-if="!l.void.daftar.length" class="px-4 py-3 text-xs text-ink-soft">
        Tidak ada transaksi void hari ini.
      </div>
      <div v-else>
        <div class="divide-y divide-line sm:hidden">
        <div v-for="v in l.void.daftar" :key="v.nomor" class="px-4 py-3">
          <div class="flex items-baseline justify-between gap-3">
            <RouterLink :to="`/invoice/${v.nomor}`" class="min-w-0 truncate font-mono text-xs text-accent-2">
              {{ v.nomor }}
            </RouterLink>
            <span class="shrink-0 text-sm font-semibold tnum">{{ rupiah(v.total) }}</span>
          </div>
          <div class="mt-1 text-2xs text-ink-soft">{{ v.jam }} · {{ v.kasir }}</div>
          <div class="mt-1.5 text-xs text-ink">{{ v.alasan || '—' }}</div>
          <span v-if="v.tinjau" class="status mt-2 text-warn">Perlu tinjauan</span>
        </div>
        </div>
        <div class="hidden overflow-x-auto sm:block">
        <table class="tbl">
          <thead>
            <tr>
              <th class="w-16">Jam</th>
              <th>Invoice</th>
              <th>Kasir</th>
              <th class="num w-28">Nilai</th>
              <th>Alasan</th>
              <th class="w-24">Tinjau</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in l.void.daftar" :key="v.nomor">
              <td class="font-mono text-xs">{{ v.jam }}</td>
              <td>
                <RouterLink :to="`/invoice/${v.nomor}`" class="font-mono text-xs text-accent-2">
                  {{ v.nomor }}
                </RouterLink>
              </td>
              <td>{{ v.kasir }}</td>
              <td class="num">{{ rupiah(v.total) }}</td>
              <td class="text-xs">{{ v.alasan || '—' }}</td>
              <td>
                <span v-if="v.tinjau" class="status text-warn">Perlu tinjauan</span>
                <span v-else class="text-2xs text-ink-soft">—</span>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </section>

    <div class="flex flex-wrap items-center gap-2" data-no-print data-tour="lap-tab">
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

    <section v-if="tab === 'penjualan'" class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div class="panel min-w-0 lg:col-span-2" data-tour="lap-jam">
        <div class="panel-h">
          <div class="flex min-w-0 items-baseline gap-2">
            <span class="panel-title">Penjualan per jam</span>
            <span class="text-xs text-ink-soft">klik baris untuk rincian</span>
          </div>
          <ChevronRight :size="15" :stroke-width="1.6" class="shrink-0 text-[#9aa8a5]" />
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
                <th class="w-8"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="r in l.perJam"
                :key="r.jam"
                class="cursor-pointer transition-colors hover:bg-surface"
                tabindex="0"
                role="button"
                :aria-label="`Lihat rincian jam ${r.jam}`"
                @click="bukaRincian(r.jam)"
                @keydown.enter.prevent="bukaRincian(r.jam)"
                @keydown.space.prevent="bukaRincian(r.jam)"
              >
                <td class="tnum font-medium text-accent-2">{{ r.jam }}</td>
                <td class="num text-ink-soft">{{ r.transaksi }}</td>
                <td class="num hidden text-ink-soft sm:table-cell">{{ qty(r.item) }}</td>
                <td class="num font-medium">{{ rupiah(r.total) }}</td>
                <td class="hidden md:table-cell">
                  <div class="h-1.5 w-full overflow-hidden rounded-full bg-[#e8edeb]">
                    <div class="h-full bg-accent-2" :style="{ width: (r.total / maksJam) * 100 + '%' }" />
                  </div>
                </td>
                <td class="text-right text-[#9aa8a5]">
                  <ChevronRight :size="14" :stroke-width="1.8" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="border-t border-line bg-surface px-4 py-2 text-2xs text-ink-soft" data-no-print>
          Klik jam mana pun untuk melihat transaksi dan item di jam tersebut.
        </div>
      </div>

      <div class="panel min-w-0" data-tour="lap-kasir">
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
            <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Uang masuk</div>
            <div class="mt-2 flex items-baseline justify-between text-xs">
              <span class="text-ink-soft">Tunai</span>
              <span class="tnum font-medium text-ink">{{ rupiah(l.uangMasuk.tunai) }}</span>
            </div>
            <div class="mt-1 flex items-baseline justify-between text-xs">
              <span class="text-ink-soft">QRIS toko</span>
              <span class="tnum font-medium text-ink">{{ rupiah(l.uangMasuk.qris) }}</span>
            </div>
            <p class="mt-1.5 text-2xs leading-relaxed text-ink-soft">
              Sisa bon yang belum dibayar tidak dihitung.
            </p>
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

    <section v-if="tab === 'stok'" class="space-y-4" data-tour="lap-stok">
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

    <section v-if="tab === 'terlaris'" class="panel min-w-0" data-tour="lap-produk">
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

    <p class="text-xs text-ink-soft" data-no-print>
      Laporan dihitung dari transaksi contoh 19/11/2026. Ekspor CSV dan cetak PDF tersedia sebagai
      add-on; tombolnya bekerja penuh di demo ini.
    </p>

    <Modal
      :open="!!rincian"
      :title="rincian ? `Penjualan jam ${rincian.jam}` : 'Rincian jam'"
      :subtitle="rincian ? `${rincian.transaksi} transaksi · ${qty(rincian.item)} item` : ''"
      lebar="max-w-3xl"
      @close="rincian = null"
    >
      <div v-if="rincian" class="space-y-3 px-4 py-4">
        <div class="grid grid-cols-3 gap-2 rounded border border-line bg-surface p-3 text-center">
          <div>
            <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Transaksi</div>
            <div class="mt-1 text-sm font-semibold tnum">{{ rincian.transaksi }}</div>
          </div>
          <div>
            <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Item</div>
            <div class="mt-1 text-sm font-semibold tnum">{{ qty(rincian.item) }}</div>
          </div>
          <div>
            <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Omzet</div>
            <div class="mt-1 text-sm font-semibold tnum">{{ rupiah(rincian.total) }}</div>
          </div>
        </div>

        <div v-if="!rincian.daftar.length" class="rounded border border-line p-4 text-xs text-ink-soft">
          Tidak ada transaksi selesai pada jam ini.
        </div>

        <div v-for="t in rincian.daftar" :key="t.nomor" class="rounded border border-line">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface px-3 py-2">
            <div class="min-w-0">
              <RouterLink
                :to="`/invoice/${t.nomor}`"
                class="font-mono text-xs font-semibold text-accent-2 hover:underline"
              >
                {{ t.nomor }}
              </RouterLink>
              <div class="text-2xs text-ink-soft">
                {{ t.jam }} · {{ t.kasir }}
                <template v-if="t.pelanggan"> · {{ t.pelanggan }}</template>
                <template v-if="t.metode === 'bon'"> · bon</template>
                <template v-else-if="t.kanal === 'qris'"> · QRIS</template>
              </div>
            </div>
            <span class="tnum text-sm font-semibold">{{ rupiah(t.total) }}</span>
          </div>
          <div class="overflow-x-auto">
            <table class="tbl">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th class="num w-20">Qty</th>
                  <th class="num w-28">Harga</th>
                  <th class="num w-32">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(i, idx) in t.items" :key="idx">
                  <td class="truncate">{{ i.nama }}</td>
                  <td class="num text-ink-soft">{{ qty(i.qty) }}</td>
                  <td class="num text-ink-soft">{{ rupiah(i.harga) }}</td>
                  <td class="num font-medium">{{ rupiah(i.subtotal ?? i.harga * i.qty) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="text-2xs text-ink-soft">Data contoh 19/11/2026</span>
        <button type="button" class="btn" @click="rincian = null">Tutup</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { ChevronRight, Download, Printer } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import AddonTag from '../components/AddonTag.vue'
import Modal from '../components/Modal.vue'
import { getLaporan, getProduk, getRincianJam, HARI_INI } from '../data/adapter'
import { unduhCSV } from '../lib/ekspor'
import { angka, qty, rupiah, tanggalPanjang, tanggalPendek } from '../lib/format'
import { useUi } from '../stores/ui'

const ui = useUi()
const l = getLaporan()
const produk = getProduk()

const tab = ref('penjualan')
const hanyaKritis = ref(false)
const rincian = ref(null)

// Biaya operasional diisi manual di demo. Di aplikasi final, biaya dicatat
// per periode dan laba bersih dihitung dari situ.
const biaya = ref(0)
const biayaTeks = computed(() => angka(biaya.value))
const persenMargin = computed(() =>
  l.omzet ? Math.round((l.labaKotor / l.omzet) * 100) : 0,
)
const labaBersih = computed(() => l.labaKotor - biaya.value)

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

function ubahBiaya(e) {
  const n = Number(String(e.target.value).replace(/\D/g, '')) || 0
  biaya.value = n
  e.target.value = angka(n)
}

function bukaRincian(jam) {
  rincian.value = getRincianJam(jam)
}

function ekspor() {
  const baris = [
    ['Laporan Toko Putra Nusantara 18'],
    ['Tanggal', tanggalPendek(HARI_INI)],
    [],
    ['Ringkasan', 'Nilai'],
    ['Omzet', l.omzet],
    ['HPP', l.hpp],
    ['Laba kotor', l.labaKotor],
    ['Margin kotor (%)', persenMargin.value],
    ['Biaya operasional', biaya.value],
    ['Laba bersih', labaBersih.value],
    ['Transaksi', l.transaksi],
    ['Item terjual', l.item],
    ['Uang masuk tunai', l.uangMasuk.tunai],
    ['Uang masuk QRIS toko', l.uangMasuk.qris],
    ['Void hari ini', l.void.jumlah],
    ['Nilai void', l.void.nilai],
    [],
    ['Void', 'Jam', 'Kasir', 'Nilai', 'Alasan', 'Tinjau'],
    ...l.void.daftar.map((v) => [
      v.nomor,
      v.jam,
      v.kasir,
      v.total,
      v.alasan,
      v.tinjau ? 'Perlu tinjauan' : '-',
    ]),
    [],
    ['Penjualan per jam', 'Transaksi', 'Item', 'Omzet'],
    ...l.perJam.map((r) => [r.jam, r.transaksi, r.item, r.total]),
    [],
    ['Rincian item per jam', 'Invoice', 'Jam', 'Kasir', 'Kanal', 'Produk', 'Qty', 'Harga', 'Subtotal'],
    ...l.perJam.flatMap((r) =>
      getRincianJam(r.jam).daftar.flatMap((t) =>
        t.items.map((i) => [
          r.jam,
          t.nomor,
          t.jam,
          t.kasir,
          t.metode === 'bon' ? 'Bon' : t.kanal === 'qris' ? 'QRIS toko' : 'Tunai',
          i.nama,
          i.qty,
          i.harga,
          i.subtotal ?? i.harga * i.qty,
        ]),
      ),
    ),
    [],
    ['Per kasir', 'Transaksi', 'Omzet'],
    ...l.perKasir.map((r) => [r.kasir, r.transaksi, r.total]),
    [],
    ['Per kategori', 'Qty', 'Nilai'],
    ...l.perKategori.map((r) => [r.kategori, r.qty, r.nilai]),
    [],
    ['Produk terlaris', 'Qty', 'Nilai'],
    ...l.terlaris.map((r) => [r.nama, r.qty, r.nilai]),
    [],
    ['Stok produk', 'Kategori', 'Stok', 'Satuan', 'Harga beli', 'Nilai beli', 'Nilai jual'],
    ...stokTampil.value.map((p) => [
      p.nama,
      p.kategori,
      p.stok,
      p.satuan,
      p.harga_beli,
      p.stok * p.harga_beli,
      p.stok * p.harga_jual,
    ]),
    [],
    ['Total nilai beli', nilaiBeliTampil.value],
    ['Total nilai jual', nilaiJualTampil.value],
  ]
  unduhCSV('laporan-20261119.csv', baris)
  ui.kabari('Laporan diekspor ke CSV. Buka di Excel atau Sheets.', 'ok')
}

function cetakPDF() {
  document.body.classList.add('cetak-laporan')
  const bersih = () => {
    document.body.classList.remove('cetak-laporan')
    window.removeEventListener('afterprint', bersih)
  }
  window.addEventListener('afterprint', bersih)
  window.print()
  setTimeout(() => {
    if (document.body.classList.contains('cetak-laporan')) bersih()
  }, 1500)
}
onBeforeUnmount(() => document.body.classList.remove('cetak-laporan'))
</script>
