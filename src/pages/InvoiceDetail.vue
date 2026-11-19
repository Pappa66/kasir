<template>
  <div v-if="!trx" class="panel">
    <EmptyState
      :icon="FileQuestion"
      title="Transaksi tidak ditemukan"
      desc="Nomor invoice mungkin salah atau data contoh sudah dimuat ulang."
    >
      <template #action>
        <RouterLink to="/invoice" class="btn btn-primary">
          <ArrowLeft :size="15" :stroke-width="1.6" />
          Kembali ke daftar
        </RouterLink>
      </template>
    </EmptyState>
  </div>

  <div v-else class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex min-w-0 items-center gap-3">
        <RouterLink to="/invoice" class="btn btn-sm shrink-0" title="Kembali ke daftar invoice">
          <ArrowLeft :size="15" :stroke-width="1.6" />
        </RouterLink>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 class="font-mono text-sm font-semibold text-ink">{{ trx.nomor }}</h2>
            <span class="status shrink-0" :class="trx.status === 'void' ? 'text-bad' : 'text-ok'">
              {{ trx.status === 'void' ? 'Void' : 'Selesai' }}
            </span>
          </div>
          <p class="truncate text-xs text-ink-soft">
            {{ tanggalPendek(trx.tanggal) }} · {{ trx.jam }} · kasir {{ trx.kasir }}
          </p>
        </div>
      </div>
      <div class="flex shrink-0 gap-2">
        <button type="button" class="btn" @click="cetak">
          <Printer :size="15" :stroke-width="1.6" />
          Cetak struk
        </button>
        <button
          v-if="trx.status === 'selesai' && sesi.pemilik"
          type="button"
          class="btn text-bad"
          @click="voidOpen = true"
        >
          <Ban :size="15" :stroke-width="1.6" />
          Void
        </button>
        <span
          v-else-if="trx.status === 'selesai'"
          class="self-center text-2xs text-ink-soft"
          title="Void hanya dapat dilakukan pemilik"
        >
          Void hanya pemilik
        </span>
      </div>
    </div>

    <div
      v-if="trx.status === 'void'"
      class="panel flex items-start gap-2 border-l-2 border-l-bad p-3"
    >
      <AlertTriangle :size="16" :stroke-width="1.6" class="mt-0.5 shrink-0 text-bad" />
      <div class="min-w-0 text-xs">
        <p class="font-medium text-bad">Transaksi dibatalkan (void)</p>
        <p class="mt-0.5 text-ink-soft">
          Alasan: {{ trx.void_alasan || 'tidak dicatat' }}. Stok pada aplikasi asli akan dikembalikan.
        </p>
      </div>
    </div>

    <div class="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div class="min-w-0 space-y-4">
        <section class="panel">
          <div class="panel-h">
            <span class="panel-title">Rincian transaksi</span>
            <span class="text-xs text-ink-soft">
              {{ trx.items.length }} baris · {{ qty(totalQty) }} item
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="tbl">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th class="num w-16 sm:w-24">Qty</th>
                  <th class="num hidden w-32 sm:table-cell">Harga</th>
                  <th class="num w-24 sm:w-32">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(i, idx) in trx.items" :key="idx">
                  <td>
                    <div class="font-medium">{{ i.nama }}</div>
                    <div class="whitespace-nowrap text-2xs text-ink-soft sm:hidden">
                      {{ rupiah(i.harga) }}/{{ i.satuan }}
                    </div>
                  </td>
                  <td class="num text-ink-soft">{{ qty(i.qty) }} {{ i.satuan }}</td>
                  <td class="num hidden text-ink-soft sm:table-cell">{{ rupiah(i.harga) }}</td>
                  <td class="num font-medium">{{ rupiah(i.subtotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="border-t border-line px-4 py-3">
            <div class="ml-auto max-w-xs space-y-1.5 text-sm">
              <div class="flex justify-between">
                <span class="text-ink-soft">Subtotal</span>
                <span class="tnum">{{ rupiah(trx.subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-ink-soft">Pajak</span>
                <span class="tnum text-ink-soft">Rp 0</span>
              </div>
              <div class="flex justify-between border-t border-line pt-1.5">
                <span class="font-medium">Total</span>
                <span class="text-base font-semibold tnum">{{ rupiah(trx.total) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-ink-soft">Tunai</span>
                <span class="tnum">{{ rupiah(trx.tunai) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-ink-soft">Kembalian</span>
                <span class="tnum text-ok">{{ rupiah(trx.kembalian) }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-h">
            <span class="panel-title">Informasi</span>
          </div>
          <dl class="grid gap-3 p-4 text-sm sm:grid-cols-2">
            <div>
              <dt class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Pelanggan</dt>
              <dd class="mt-0.5">{{ trx.pelanggan || 'Tanpa nama (walk-in)' }}</dd>
            </div>
            <div>
              <dt class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Metode bayar</dt>
              <dd class="mt-0.5">Tunai</dd>
            </div>
            <div>
              <dt class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Kasir</dt>
              <dd class="mt-0.5">{{ trx.kasir }}</dd>
            </div>
            <div>
              <dt class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Waktu</dt>
              <dd class="mt-0.5 tnum">{{ tanggalPendek(trx.tanggal) }} {{ trx.jam }}</dd>
            </div>
          </dl>
        </section>
      </div>

      <aside class="min-w-0 space-y-4 lg:sticky lg:top-[68px]">
        <section class="panel">
          <div class="panel-h">
            <span class="panel-title">Struk</span>
            <div class="flex rounded border border-line p-0.5">
              <button
                type="button"
                class="rounded px-2 py-0.5 text-2xs transition-colors"
                :class="lebar === 58 ? 'bg-accent text-white' : 'text-ink-soft hover:bg-surface'"
                @click="lebar = 58"
              >
                58
              </button>
              <button
                type="button"
                class="rounded px-2 py-0.5 text-2xs transition-colors"
                :class="lebar === 80 ? 'bg-accent text-white' : 'text-ink-soft hover:bg-surface'"
                @click="lebar = 80"
              >
                80
              </button>
            </div>
          </div>

          <div class="flex justify-center overflow-x-auto bg-surface p-4">
            <StrukPreview
              :toko="toko"
              :nomor="trx.nomor"
              :tanggal="tanggalPendek(trx.tanggal)"
              :jam="trx.jam"
              :kasir="trx.kasir"
              :items="trx.items"
              :total="trx.total"
              :tunai="trx.tunai"
              :kembalian="trx.kembalian"
              :lebar="lebar"
              :void="trx.status === 'void'"
              class="border border-line px-3 py-3"
            />
          </div>

          <div class="border-t border-line px-3 py-2 text-center text-2xs text-ink-soft">
            Cetak ulang memakai ukuran {{ lebar }} mm
          </div>
        </section>
      </aside>
    </div>

    <Modal
      :open="voidOpen"
      title="Batalkan transaksi"
      :subtitle="trx.nomor"
      @close="voidOpen = false"
    >
      <div class="space-y-3 px-4 py-4">
        <div class="rounded border border-[#e3c9a8] bg-[#fdf6ec] p-3 text-xs text-warn">
          Void tidak menghapus riwayat. Stok dikembalikan dan transaksi ditandai batal.
        </div>
        <div>
          <label class="label" for="void-alasan">Alasan void</label>
          <input
            id="void-alasan"
            v-model="alasan"
            class="input"
            placeholder="cth. Salah input qty"
          />
        </div>
      </div>

      <template #footer>
        <span class="text-2xs text-ink-soft">Wajib diisi.</span>
        <div class="flex gap-2">
          <button type="button" class="btn" @click="voidOpen = false">Batal</button>
          <button type="button" class="btn btn-primary" :disabled="!alasan.trim()" @click="voidkan">
            Void transaksi
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { AlertTriangle, ArrowLeft, Ban, FileQuestion, Printer } from 'lucide-vue-next'
import EmptyState from '../components/EmptyState.vue'
import Modal from '../components/Modal.vue'
import StrukPreview from '../components/StrukPreview.vue'
import { batalkanPenjualan, getPenjualan } from '../data/adapter'
import { qty, rupiah, tanggalPendek } from '../lib/format'
import { useToko } from '../stores/toko'
import { useCetak } from '../stores/cetak'
import { useUi } from '../stores/ui'
import { useSesi } from '../stores/sesi'

const route = useRoute()
const tokoStore = useToko()
const ui = useUi()
const cetakStore = useCetak()
const sesi = useSesi()

const toko = computed(() => tokoStore.data)
const trx = getPenjualan().find((t) => t.nomor === route.params.nomor) || null
const lebar = ref(tokoStore.data.lebar_struk === 58 ? 58 : 80)
const voidOpen = ref(false)
const alasan = ref('')

const totalQty = computed(() => (trx ? trx.items.reduce((s, i) => s + i.qty, 0) : 0))

function cetak() {
  cetakStore.siapkan({
    toko: toko.value,
    nomor: trx.nomor,
    tanggal: tanggalPendek(trx.tanggal),
    jam: trx.jam,
    kasir: trx.kasir,
    items: trx.items,
    total: trx.total,
    tunai: trx.tunai,
    kembalian: trx.kembalian,
    lebar: lebar.value,
    void: trx.status === 'void',
  })
  window.print()
}

function voidkan() {
  if (!sesi.pemilik) return ui.kabari('Void hanya dapat dilakukan pemilik.', 'warn')
  if (!alasan.value.trim()) return ui.kabari('Alasan void wajib diisi.', 'warn')
  batalkanPenjualan(trx.nomor, alasan.value.trim())
  voidOpen.value = false
  alasan.value = ''
  ui.kabari(`${trx.nomor} dibatalkan. Stok dikembalikan di aplikasi asli.`, 'ok')
}
</script>
