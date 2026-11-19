<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-ink">Ringkasan hari ini</h2>
        <p class="mt-0.5 text-xs text-ink-soft">{{ tanggalPanjang(HARI_INI) }}</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="hidden items-center gap-1.5 text-xs text-ink-soft sm:flex">
          <span class="h-1.5 w-1.5 rounded-full bg-ok" />
          Data contoh
        </span>
        <RouterLink to="/kasir" class="btn btn-primary">
          <ShoppingCart :size="16" :stroke-width="1.6" />
          Buka kasir
        </RouterLink>
      </div>
    </div>

    <div class="panel grid grid-cols-2 overflow-hidden lg:grid-cols-4">
      <div class="border-b border-r border-line p-4 lg:border-b-0">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Penjualan hari ini</div>
        <div class="mt-1.5 whitespace-nowrap text-lg font-semibold tnum sm:text-2xl">{{ rupiah(d.total) }}</div>
        <div class="mt-0.5 text-xs text-ink-soft">{{ d.jumlahTransaksi }} transaksi sah</div>
      </div>
      <div class="border-b border-line p-4 lg:border-b-0 lg:border-r">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Transaksi</div>
        <div class="mt-1.5 whitespace-nowrap text-lg font-semibold tnum sm:text-2xl">{{ angka(d.jumlahTransaksi) }}</div>
        <div class="mt-0.5 text-xs text-ink-soft">{{ d.jumlahVoid }} transaksi di-void</div>
      </div>
      <div class="border-b border-r border-line p-4 lg:border-b-0">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Rata-rata</div>
        <div class="mt-1.5 whitespace-nowrap text-lg font-semibold tnum sm:text-2xl">{{ rupiah(d.rataRata) }}</div>
        <div class="mt-0.5 text-xs text-ink-soft">per transaksi</div>
      </div>
      <div class="border-b border-line p-4 lg:border-b-0">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Item terjual</div>
        <div class="mt-1.5 whitespace-nowrap text-lg font-semibold tnum sm:text-2xl">{{ angka(d.itemTerjual) }}</div>
        <div class="mt-0.5 text-xs text-ink-soft">unit dan kg</div>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <div class="panel border-l-2 border-l-warn p-4">
        <div class="flex items-baseline justify-between">
          <span class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Stok kritis</span>
          <span class="text-xl font-semibold tnum">{{ d.stokKritis.length }}</span>
        </div>
        <p class="mt-1 truncate text-xs text-ink-soft">
          {{ d.stokKritis.map((p) => p.nama).slice(0, 2).join(', ') }}
        </p>
      </div>
      <RouterLink to="/kedaluwarsa" class="panel border-l-2 border-l-warn p-4 transition-colors hover:bg-surface">
        <div class="flex items-baseline justify-between">
          <span class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Kadaluarsa &lt; 30 hari</span>
          <div class="flex items-center gap-2">
            <AddonTag />
            <span class="text-xl font-semibold tnum">{{ d.mendekatiExpired.length }}</span>
          </div>
        </div>
        <p class="mt-1 truncate text-xs text-ink-soft">
          {{ namaExpired || 'Tidak ada batch mendekati' }}
        </p>
      </RouterLink>
      <RouterLink to="/piutang" class="panel border-l-2 border-l-[#9aa8a5] p-4 transition-colors hover:bg-surface">
        <div class="flex items-baseline justify-between">
          <span class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Bon berjalan</span>
          <div class="flex items-center gap-2">
            <AddonTag />
            <span class="text-xl font-semibold tnum">{{ d.piutang.jumlah }}</span>
          </div>
        </div>
        <p class="mt-1 truncate text-xs text-ink-soft">
          {{ rupiah(d.piutang.total) }} belum lunas<span v-if="d.piutang.lewat"> · {{ d.piutang.lewat }} lewat tempo</span>
        </p>
      </RouterLink>
    </div>

    <div class="grid gap-4 lg:grid-cols-5">
      <section class="panel min-w-0 lg:col-span-3">
        <div class="panel-h">
          <span class="panel-title">Produk terlaris</span>
          <span class="text-xs text-ink-soft">7 hari terakhir</span>
        </div>
        <div class="overflow-x-auto">
          <table class="tbl table-fixed">
            <thead>
              <tr>
                <th class="w-8">#</th>
                <th>Produk</th>
                <th class="num hidden w-24 sm:table-cell">Qty</th>
                <th class="num w-28 sm:w-32">Nilai</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, i) in d.terlaris" :key="p.produk_id">
                <td class="text-ink-soft tnum">{{ i + 1 }}</td>
                <td class="truncate font-medium" title="{{ p.nama }}">{{ p.nama }}</td>
                <td class="num hidden text-ink-soft sm:table-cell">{{ qty(p.qty) }}</td>
                <td class="num font-medium">{{ rupiah(p.nilai) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel min-w-0 lg:col-span-2">
        <div class="panel-h">
          <span class="panel-title">Transaksi terakhir</span>
          <RouterLink to="/invoice" class="text-xs text-accent-2 hover:underline">Semua</RouterLink>
        </div>
        <div class="overflow-x-auto">
          <table class="tbl table-fixed">
            <thead>
              <tr>
                <th class="w-20">Nomor</th>
                <th class="hidden w-16 sm:table-cell">Jam</th>
                <th class="num w-28">Total</th>
                <th class="w-16">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in d.terakhir" :key="t.id">
                <td class="font-mono text-xs">{{ t.nomor.slice(-4) }}</td>
                <td class="hidden text-ink-soft tnum sm:table-cell">{{ t.jam }}</td>
                <td class="num">{{ rupiah(t.total) }}</td>
                <td>
                  <span
                    class="status"
                    :class="
                      t.status === 'void'
                        ? 'text-bad'
                        : t.metode === 'bon' && t.total > t.dibayar
                          ? 'text-warn'
                          : 'text-ok'
                    "
                  >
                    {{ t.status === 'void' ? 'Void' : t.metode === 'bon' && t.total > t.dibayar ? 'Bon' : 'Lunas' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <section class="panel">
      <div class="panel-h">
        <span class="panel-title">Perlu dipesan</span>
        <span class="text-xs text-ink-soft">stok sama atau di bawah minimum</span>
      </div>
      <div class="overflow-x-auto">
        <table class="tbl table-fixed">
          <thead>
            <tr>
              <th>Produk</th>
              <th class="hidden w-40 sm:table-cell">Kategori</th>
              <th class="num w-20">Stok</th>
              <th class="num hidden w-24 sm:table-cell">Minimum</th>
              <th class="w-24">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in d.stokKritis" :key="p.id">
              <td class="truncate font-medium" title="{{ p.nama }}">{{ p.nama }}</td>
              <td class="hidden text-ink-soft sm:table-cell">{{ p.kategori }}</td>
              <td class="num">{{ qty(p.stok) }} {{ p.satuan }}</td>
              <td class="num hidden text-ink-soft sm:table-cell">{{ qty(p.stok_minimum) }}</td>
              <td>
                <span class="status text-warn">{{ p.stok <= 0 ? 'Habis' : 'Menipis' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <p class="text-xs text-ink-soft">
      Angka di atas dihitung dari data contoh tanggal 19/11/2026. Aplikasi belum menyimpan data permanen.
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ShoppingCart } from 'lucide-vue-next'
import AddonTag from '../components/AddonTag.vue'
import { getDashboard, HARI_INI } from '../data/adapter'
import { rupiah, angka, qty, tanggalPanjang } from '../lib/format'

const d = getDashboard()
const namaExpired = computed(() => {
  const unik = [...new Set(d.mendekatiExpired.map((b) => b.produk_nama))]
  return unik.slice(0, 2).join(', ') + (unik.length > 2 ? ` +${unik.length - 2}` : '')
})
</script>
