<template>
  <div class="min-h-screen bg-surface pb-14">
    <header class="border-b border-line bg-paper">
      <div class="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-ink text-[12px] font-semibold text-white">
          {{ inisial }}
        </div>
        <div class="min-w-0">
          <div class="truncate text-sm font-semibold text-ink">{{ toko.nama_toko }}</div>
          <div class="truncate text-2xs text-ink-soft">{{ toko.alamat }}</div>
        </div>
        <span class="ml-auto hidden shrink-0 text-2xs text-ink-soft sm:block">{{ toko.telepon }}</span>
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-4 py-5">
      <div v-if="galat === 'notfound'" class="panel p-8 text-center">
        <FileQuestion :size="22" :stroke-width="1.5" class="mx-auto mb-3 text-[#9aa8a5]" />
        <h1 class="text-base font-semibold text-ink">Invoice tidak ditemukan</h1>
        <p class="mx-auto mt-1 max-w-md text-xs text-ink-soft">
          Nomor invoice tidak ada pada data contoh. Periksa kembali tautan yang diberikan kasir.
        </p>
      </div>

      <div v-else-if="galat === 'token'" class="panel p-8 text-center">
        <ShieldAlert :size="22" :stroke-width="1.5" class="mx-auto mb-3 text-warn" />
        <h1 class="text-base font-semibold text-ink">Tautan tidak valid</h1>
        <p class="mx-auto mt-1 max-w-md text-xs text-ink-soft">
          Token pada tautan tidak cocok. Minta kasir menyalin ulang tautan invoice dari aplikasi.
        </p>
      </div>

      <template v-else-if="trx">
        <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div class="text-2xs uppercase tracking-[0.06em] text-ink-soft">Invoice</div>
            <h1 class="font-mono text-lg font-semibold text-ink">{{ trx.nomor }}</h1>
            <p class="mt-0.5 text-xs text-ink-soft">
              {{ tanggalPanjang(trx.tanggal) }} · {{ trx.jam }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="status" :class="statusKelas">{{ labelStatus }}</span>
            <button type="button" class="btn btn-sm" @click="cetak">
              <Printer :size="14" :stroke-width="1.6" />
              Cetak
            </button>
          </div>
        </div>

        <section class="panel overflow-hidden">
          <div class="grid gap-3 border-b border-line p-4 text-sm sm:grid-cols-3">
            <div>
              <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Pelanggan</div>
              <div class="mt-0.5">{{ trx.pelanggan || 'Tanpa nama (walk-in)' }}</div>
            </div>
            <div>
              <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Metode</div>
              <div class="mt-0.5">{{ trx.metode === 'bon' ? 'Bon (bayar kemudian)' : 'Tunai' }}</div>
            </div>
            <div>
              <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Kasir</div>
              <div class="mt-0.5">{{ trx.kasir }}</div>
            </div>
          </div>

          <table class="tbl">
            <thead>
              <tr>
                <th>Produk</th>
                <th class="num w-20">Qty</th>
                <th class="num w-28">Harga</th>
                <th class="num w-28">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(i, idx) in trx.items" :key="idx">
                <td>
                  <div class="font-medium">{{ i.nama }}</div>
                  <div class="text-2xs text-ink-soft">{{ i.satuan }}</div>
                </td>
                <td class="num">{{ qty(i.qty) }}</td>
                <td class="num">{{ rupiah(i.harga) }}</td>
                <td class="num font-medium">{{ rupiah(i.subtotal) }}</td>
              </tr>
            </tbody>
          </table>

          <div class="flex justify-end border-t border-line p-4">
            <dl class="w-full max-w-xs space-y-1.5 text-sm">
              <div class="flex justify-between">
                <dt class="text-ink-soft">Subtotal</dt>
                <dd class="tnum">{{ rupiah(trx.subtotal) }}</dd>
              </div>
              <div class="flex justify-between border-t border-line pt-1.5">
                <dt class="font-medium">Total</dt>
                <dd class="text-base font-semibold tnum">{{ rupiah(trx.total) }}</dd>
              </div>
              <template v-if="trx.metode === 'bon'">
                <div class="flex justify-between">
                  <dt class="text-ink-soft">Dibayar / DP</dt>
                  <dd class="tnum">{{ rupiah(trx.dibayar) }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="font-medium">Sisa bon</dt>
                  <dd class="tnum font-medium" :class="sisa > 0 ? 'text-warn' : 'text-ok'">
                    {{ rupiah(sisa) }}
                  </dd>
                </div>
                <div v-if="trx.jatuh_tempo" class="flex justify-between">
                  <dt class="text-ink-soft">Jatuh tempo</dt>
                  <dd class="tnum">{{ tanggalPendek(trx.jatuh_tempo) }}</dd>
                </div>
              </template>
              <template v-else>
                <div class="flex justify-between">
                  <dt class="text-ink-soft">Tunai</dt>
                  <dd class="tnum">{{ rupiah(trx.tunai) }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-ink-soft">Kembalian</dt>
                  <dd class="tnum text-ok">{{ rupiah(trx.kembalian) }}</dd>
                </div>
              </template>
              <div
                v-if="trx.status === 'void'"
                class="rounded border border-bad/30 bg-[#fdf0ee] px-2 py-1.5 text-center text-2xs text-bad"
              >
                Transaksi ini dibatalkan (void).
              </div>
            </dl>
          </div>
        </section>

        <div class="mt-3 flex flex-wrap items-center justify-between gap-2 text-2xs text-ink-soft">
          <span>Halaman publik tanpa login. Tautan memakai token demo.</span>
          <RouterLink to="/panduan" class="underline decoration-line underline-offset-2 hover:text-ink">
            Tentang aplikasi
          </RouterLink>
        </div>
      </template>
    </main>

    <PrototypeBanner penuh />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { FileQuestion, Printer, ShieldAlert } from 'lucide-vue-next'
import PrototypeBanner from '../components/PrototypeBanner.vue'
import { getInvoicePublik } from '../data/adapter'
import { qty, rupiah, tanggalPanjang, tanggalPendek } from '../lib/format'
import { useToko } from '../stores/toko'
import { useCetak } from '../stores/cetak'

const route = useRoute()
const tokoStore = useToko()
const cetakStore = useCetak()
const toko = computed(() => tokoStore.data)

const hasil = computed(() =>
  getInvoicePublik(String(route.params.nomor), String(route.query.token || '')),
)
const galat = computed(() => hasil.value.error || '')
const trx = computed(() => hasil.value.transaksi || null)

const sisa = computed(() => (trx.value ? Math.max(0, trx.value.total - trx.value.dibayar) : 0))
const labelStatus = computed(() => {
  if (!trx.value) return ''
  if (trx.value.status === 'void') return 'Void'
  if (trx.value.metode === 'bon') return sisa.value > 0 ? 'Bon · belum lunas' : 'Bon lunas'
  return 'Lunas'
})
const statusKelas = computed(() =>
  trx.value?.status === 'void'
    ? 'text-bad'
    : trx.value?.metode === 'bon' && sisa.value > 0
      ? 'text-warn'
      : 'text-ok',
)
const inisial = computed(() => {
  const kata = toko.value.nama_toko.split(/\s+/).filter((w) => w.toLowerCase() !== 'toko')
  return kata
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
})

function cetak() {
  if (!trx.value) return
  const t = trx.value
  cetakStore.siapkan({
    toko: toko.value,
    nomor: t.nomor,
    tanggal: tanggalPendek(t.tanggal),
    jam: t.jam,
    kasir: t.kasir,
    pelanggan: t.pelanggan,
    noHp: t.no_hp,
    metode: t.metode,
    dibayar: t.dibayar,
    sisa: sisa.value,
    jatuhTempo: t.jatuh_tempo ? tanggalPendek(t.jatuh_tempo) : '',
    items: t.items,
    total: t.total,
    tunai: t.tunai,
    kembalian: t.kembalian,
    lebar: tokoStore.data.lebar_struk === 58 ? 58 : 80,
    void: t.status === 'void',
  })
  window.print()
}
</script>
