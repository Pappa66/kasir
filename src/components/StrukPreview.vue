<template>
  <div
  class="print-area bg-white"
  :style="{ width: lebar === 58 ? '212px' : '292px', maxWidth: '100%' }"
>
    <div class="font-mono leading-[1.45] text-black" :class="lebar === 58 ? 'text-[9.5px]' : 'text-[11px]'">
      <div class="text-center">
        <div class="font-semibold uppercase tracking-wide">{{ toko.nama_toko }}</div>
        <div class="mx-auto mt-0.5 max-w-[95%] text-[0.92em] leading-tight">{{ toko.alamat }}</div>
        <div class="mt-0.5">{{ toko.telepon }}</div>
      </div>

      <div class="my-1.5 border-t border-dashed border-black" />

      <div v-if="void" class="my-1.5 border-y border-black py-0.5 text-center font-semibold">
        *** VOID ***
      </div>

      <div class="space-y-0.5">
        <div class="flex justify-between gap-2">
          <span>No.</span><span>{{ nomor }}</span>
        </div>
        <div class="flex justify-between gap-2">
          <span>Tanggal</span><span>{{ tanggal }}{{ jam ? ' ' + jam : '' }}</span>
        </div>
        <div class="flex justify-between gap-2">
          <span>Kasir</span><span>{{ kasir }}</span>
        </div>
        <div v-if="pelanggan" class="flex justify-between gap-2">
          <span>Pelanggan</span><span class="truncate text-right">{{ pelanggan }}</span>
        </div>
      </div>

      <div class="my-1.5 border-t border-dashed border-black" />

      <div v-for="(i, idx) in items" :key="idx" class="mb-1">
        <div class="truncate">{{ i.nama }}</div>
        <div class="flex justify-between gap-2">
          <span>{{ qtyLabel(i.qty) }} x {{ ribuan(i.harga) }}</span>
          <span class="tnum">{{ ribuan(Math.round(i.qty * i.harga)) }}</span>
        </div>
      </div>

      <div class="my-1.5 border-t border-dashed border-black" />

      <div class="flex justify-between font-semibold">
        <span>TOTAL</span><span class="tnum">{{ ribuan(total) }}</span>
      </div>
      <template v-if="metode === 'bon'">
        <div class="mt-1 flex justify-between">
          <span>Metode</span><span class="font-semibold">BON</span>
        </div>
        <div v-if="dibayar > 0" class="flex justify-between">
          <span>Dibayar {{ kanal === 'qris' ? 'QRIS' : 'Tunai' }}</span><span class="tnum">{{ ribuan(dibayar) }}</span>
        </div>
        <div class="flex justify-between font-semibold">
          <span>Sisa</span><span class="tnum">{{ ribuan(sisa) }}</span>
        </div>
        <div v-if="jatuhTempo" class="flex justify-between">
          <span>Tempo</span><span>{{ jatuhTempo }}</span>
        </div>
        <div v-if="noHp" class="flex justify-between gap-2">
          <span>HP</span><span class="truncate text-right">{{ noHp }}</span>
        </div>
      </template>
      <template v-else-if="kanal === 'qris'">
        <div class="mt-1 flex justify-between">
          <span>QRIS TOKO</span><span class="tnum">{{ ribuan(total) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Status</span><span class="font-semibold">Lunas</span>
        </div>
      </template>
      <template v-else>
        <div class="mt-1 flex justify-between">
          <span>Tunai</span><span class="tnum">{{ ribuan(tunai) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Kembali</span><span class="tnum">{{ ribuan(kembalian) }}</span>
        </div>
      </template>

      <div class="my-1.5 border-t border-dashed border-black" />

      <div class="text-center text-[0.92em] leading-tight">
        <div>Terima kasih</div>
        <div>Barang yang sudah dibeli</div>
        <div>tidak dapat ditukar</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { qty as fmtQty } from '../lib/format'

const props = defineProps({
  toko: { type: Object, required: true },
  nomor: { type: String, default: '' },
  tanggal: { type: String, default: '' },
  jam: { type: String, default: '' },
  kasir: { type: String, default: '' },
  items: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
  tunai: { type: Number, default: 0 },
  kembalian: { type: Number, default: 0 },
  lebar: { type: Number, default: 80 },
  void: { type: Boolean, default: false },
  pelanggan: { type: String, default: '' },
  noHp: { type: String, default: '' },
  metode: { type: String, default: 'tunai' },
  kanal: { type: String, default: 'tunai' },
  dibayar: { type: Number, default: 0 },
  sisa: { type: Number, default: 0 },
  jatuhTempo: { type: String, default: '' },
})

const ribuan = (n) => Math.round(Number(n) || 0).toLocaleString('id-ID')
const qtyLabel = (n) => fmtQty(n)
</script>
