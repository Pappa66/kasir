<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-ink">Penerimaan barang</h2>
        <p class="mt-0.5 text-xs text-ink-soft">
          Barang datang dari supplier, stok bertambah setelah dokumen diterima.
        </p>
      </div>
      <button type="button" class="btn btn-primary" @click="bukaForm" data-tour="stok-aksi">
        <Plus :size="15" :stroke-width="1.8" />
        Penerimaan baru
      </button>
    </div>

    <div class="panel grid grid-cols-1 overflow-hidden sm:grid-cols-3">
      <div class="border-b border-line p-4 sm:border-b-0 sm:border-r">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Dokumen</div>
        <div class="mt-1.5 text-xl font-semibold tnum sm:text-2xl">{{ dokumen.length }}</div>
        <div class="mt-0.5 text-xs text-ink-soft">{{ draft }} masih draft</div>
      </div>
      <div class="border-b border-line p-4 sm:border-b-0 sm:border-r">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Nilai penerimaan</div>
        <div class="mt-1.5 whitespace-nowrap text-lg font-semibold tnum sm:text-2xl">
          {{ rupiah(nilaiTotal) }}
        </div>
        <div class="mt-0.5 text-xs text-ink-soft">dokumen diterima</div>
      </div>
      <div class="p-4">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Supplier</div>
        <div class="mt-1.5 text-xl font-semibold tnum sm:text-2xl">{{ supplier.length }}</div>
        <div class="mt-0.5 text-xs text-ink-soft">tercatat di demo</div>
      </div>
    </div>

    <section class="panel" data-tour="stok-dokumen">
      <div class="panel-h">
        <span class="panel-title">Dokumen penerimaan</span>
        <span class="text-xs text-ink-soft">terbaru di atas</span>
      </div>

      <div class="hidden overflow-x-auto md:block">
        <table class="tbl">
          <thead>
            <tr>
              <th>Nomor</th>
              <th class="hidden w-48 md:table-cell">Supplier</th>
              <th class="hidden w-24 sm:table-cell">Tanggal</th>
              <th class="num hidden w-16 lg:table-cell">Baris</th>
              <th class="num w-32">Total</th>
              <th class="w-24">Status</th>
              <th class="w-28"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in dokumen" :key="d.id">
              <td>
                <div class="whitespace-nowrap font-mono text-xs text-ink">{{ d.nomor }}</div>
                <div class="text-2xs text-ink-soft md:hidden">{{ d.supplier }}</div>
              </td>
              <td class="hidden truncate text-ink-soft md:table-cell">{{ d.supplier }}</td>
              <td class="hidden text-ink-soft sm:table-cell">{{ tanggalPendek(d.tanggal) }}</td>
              <td class="num hidden text-ink-soft lg:table-cell">{{ d.items.length }}</td>
              <td class="num font-medium">{{ rupiah(d.total) }}</td>
              <td>
                <span class="status" :class="d.status === 'draft' ? 'text-warn' : 'text-ok'">
                  {{ d.status === 'draft' ? 'Draft' : 'Diterima' }}
                </span>
              </td>
              <td class="text-right">
                <button type="button" class="btn btn-sm" @click="lihat(d)">Lihat</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="divide-y divide-line md:hidden">
        <button
          v-for="d in dokumen"
          :key="d.id"
          type="button"
          class="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-surface"
          @click="lihat(d)"
        >
          <div class="min-w-0 flex-1">
            <div class="font-mono text-xs text-ink">{{ d.nomor }}</div>
            <div class="mt-0.5 truncate text-2xs text-ink-soft">
              {{ tanggalPendek(d.tanggal) }} · {{ d.supplier }}
            </div>
          </div>
          <div class="shrink-0 text-right">
            <div class="text-sm font-medium tnum">{{ rupiah(d.total) }}</div>
            <span class="status" :class="d.status === 'draft' ? 'text-warn' : 'text-ok'">
              {{ d.status === 'draft' ? 'Draft' : 'Diterima' }}
            </span>
          </div>
          <ChevronRight :size="16" :stroke-width="1.6" class="shrink-0 text-[#9aa8a5]" />
        </button>
      </div>
    </section>

    <p class="text-xs text-ink-soft">
      Menerima dokumen langsung menambah stok produk dan membuat batch baru bila tanggal expired
      diisi. Perubahan bertahan selama sesi demo dan kembali seperti semula setelah halaman dimuat
      ulang.
    </p>

    <!-- Detail dokumen -->
    <Modal
      :open="!!detail"
      title="Detail penerimaan"
      :subtitle="detail ? detail.nomor : ''"
      lebar="max-w-2xl"
      @close="detail = null"
    >
      <div v-if="detail" class="px-4 py-4">
        <div class="grid grid-cols-1 gap-3 border-b border-line pb-4 sm:grid-cols-3">
          <div>
            <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Supplier</div>
            <div class="mt-0.5 text-sm text-ink">{{ detail.supplier }}</div>
          </div>
          <div>
            <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Tanggal</div>
            <div class="mt-0.5 text-sm text-ink">{{ tanggalPendek(detail.tanggal) }}</div>
          </div>
          <div>
            <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Status</div>
            <div class="mt-0.5 text-sm" :class="detail.status === 'draft' ? 'text-warn' : 'text-ok'">
              {{ detail.status === 'draft' ? 'Draft — belum menambah stok' : 'Diterima' }}
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="tbl">
            <thead>
              <tr>
                <th>Produk</th>
                <th class="num w-24">Qty</th>
                <th class="num w-32">Harga beli</th>
                <th class="hidden w-28 sm:table-cell">Expired</th>
                <th class="num w-32">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in detail.items" :key="i.produk_id">
                <td class="font-medium">{{ i.nama }}</td>
                <td class="num text-ink-soft">{{ qty(i.qty) }} {{ i.satuan }}</td>
                <td class="num text-ink-soft">{{ rupiah(i.harga_beli) }}</td>
                <td class="hidden text-ink-soft tnum sm:table-cell">
                  {{ i.expired ? tanggalPendek(i.expired) : '—' }}
                </td>
                <td class="num font-medium">{{ rupiah(i.subtotal) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-3 flex items-center justify-between border-t border-line pt-3">
          <span class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Total</span>
          <span class="text-lg font-semibold tnum">{{ rupiah(detail.total) }}</span>
        </div>
      </div>

      <template #footer>
        <span class="text-2xs text-ink-soft">Stok dan batch bertambah di sesi demo.</span>
        <div class="flex gap-2">
          <button type="button" class="btn" @click="detail = null">Tutup</button>
          <button
            v-if="detail && detail.status === 'draft'"
            type="button"
            class="btn btn-primary"
            @click="terima(detail)"
          >
            <Check :size="15" :stroke-width="1.8" />
            Terima barang
          </button>
        </div>
      </template>
    </Modal>

    <!-- Form penerimaan baru -->
    <Modal
      :open="formOpen"
      title="Penerimaan barang baru"
      subtitle="Nomor dibuat otomatis saat disimpan"
      lebar="max-w-2xl"
      @close="formOpen = false"
    >
      <div class="space-y-4 px-4 py-4">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label class="label" for="sm-supplier">Supplier</label>
            <select id="sm-supplier" v-model="supplierId" class="input">
              <option v-for="s in supplier" :key="s.id" :value="s.id">{{ s.nama }}</option>
            </select>
          </div>
          <div>
            <label class="label" for="sm-tanggal">Tanggal terima</label>
            <input id="sm-tanggal" :value="tanggalPendek(HARI_INI)" class="input tnum" readonly />
          </div>
        </div>

        <div class="rounded border border-line bg-surface p-3">
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_80px_120px_140px_auto]">
            <div class="min-w-0">
              <label class="label" for="sm-produk">Produk</label>
              <select id="sm-produk" v-model="pilih" class="input" @change="pilihProduk">
                <option value="">Pilih produk…</option>
                <option v-for="p in produk" :key="p.id" :value="p.id">
                  {{ p.nama }}
                </option>
              </select>
            </div>
            <div>
              <label class="label" for="sm-qty">Qty</label>
              <input
                id="sm-qty"
                v-model="qtyMasuk"
                type="number"
                min="0"
                step="any"
                class="input tnum"
              />
            </div>
            <div>
              <label class="label" for="sm-harga">Harga beli</label>
              <input
                id="sm-harga"
                v-model="hargaMasuk"
                type="number"
                min="0"
                class="input tnum"
              />
            </div>
            <div>
              <label class="label" for="sm-expired">Expired</label>
              <input id="sm-expired" v-model="expiredMasuk" type="date" class="input tnum" />
            </div>
            <div class="flex items-end">
              <button type="button" class="btn w-full" @click="tambahBaris">
                <Plus :size="15" :stroke-width="1.8" />
                Tambah
              </button>
            </div>
          </div>
          <p v-if="produkDipilih" class="mt-1.5 text-2xs text-ink-soft">
            Stok sekarang {{ qty(produkDipilih.stok) }} {{ produkDipilih.satuan }} · harga beli
            terakhir {{ rupiah(produkDipilih.harga_beli) }}. Isi tanggal expired untuk membuat batch
            FEFO.
          </p>
        </div>

        <div class="overflow-x-auto rounded border border-line">
          <table class="tbl">
            <thead>
              <tr>
                <th>Produk</th>
                <th class="num w-20">Qty</th>
                <th class="num w-28">Harga beli</th>
                <th class="hidden w-28 sm:table-cell">Expired</th>
                <th class="num w-28">Subtotal</th>
                <th class="w-10"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(b, i) in baris" :key="`${b.produk_id}-${b.harga_beli}-${b.expired}`">
                <td class="font-medium">{{ b.nama }}</td>
                <td class="num text-ink-soft">{{ qty(b.qty) }} {{ b.satuan }}</td>
                <td class="num text-ink-soft">{{ rupiah(b.harga_beli) }}</td>
                <td class="hidden text-ink-soft tnum sm:table-cell">
                  {{ b.expired ? tanggalPendek(b.expired) : '—' }}
                </td>
                <td class="num font-medium">{{ rupiah(b.qty * b.harga_beli) }}</td>
                <td class="text-right">
                  <button
                    type="button"
                    class="text-ink-soft transition-colors hover:text-bad"
                    title="Hapus baris"
                    @click="baris.splice(i, 1)"
                  >
                    <X :size="15" :stroke-width="1.6" />
                  </button>
                </td>
              </tr>
              <tr v-if="!baris.length">
                <td colspan="6" class="py-6 text-center text-xs text-ink-soft">
                  Belum ada baris. Pilih produk lalu tekan Tambah.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Total</span>
          <span class="text-lg font-semibold tnum">{{ rupiah(totalBaris) }}</span>
        </div>
      </div>

      <template #footer>
        <span class="text-2xs text-ink-soft">Dokumen disimpan sebagai draft.</span>
        <div class="flex gap-2">
          <button type="button" class="btn" @click="formOpen = false">Batal</button>
          <button type="button" class="btn btn-primary" :disabled="!baris.length" @click="simpan">
            Simpan draft
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Check, ChevronRight, Plus, X } from 'lucide-vue-next'
import Modal from '../components/Modal.vue'
import {
  getProduk,
  getStokMasuk,
  getSupplier,
  HARI_INI,
  nomorStokMasukBerikutnya,
  tambahStokMasuk,
  terimaStokMasuk,
} from '../data/adapter'
import { rupiah, qty, tanggalPendek } from '../lib/format'
import { useUi } from '../stores/ui'

const ui = useUi()
const produk = getProduk()
const supplier = getSupplier()

const dokumen = ref(getStokMasuk())
const detail = ref(null)
const formOpen = ref(false)

const supplierId = ref(supplier[0].id)
const pilih = ref('')
const qtyMasuk = ref(1)
const hargaMasuk = ref(0)
const expiredMasuk = ref('')
const baris = ref([])

const nilaiTotal = computed(() =>
  dokumen.value.filter((d) => d.status === 'diterima').reduce((s, d) => s + d.total, 0),
)
const draft = computed(() => dokumen.value.filter((d) => d.status === 'draft').length)
const produkDipilih = computed(() => produk.find((p) => p.id === Number(pilih.value)) || null)
const totalBaris = computed(() => baris.value.reduce((s, b) => s + b.qty * b.harga_beli, 0))

function segarkan() {
  dokumen.value = getStokMasuk()
  if (detail.value) {
    detail.value = dokumen.value.find((d) => d.nomor === detail.value.nomor) || null
  }
}

function bukaForm() {
  supplierId.value = supplier[0].id
  pilih.value = ''
  qtyMasuk.value = 1
  hargaMasuk.value = 0
  expiredMasuk.value = ''
  baris.value = []
  formOpen.value = true
}

function pilihProduk() {
  const p = produkDipilih.value
  if (!p) return
  hargaMasuk.value = p.harga_beli
  qtyMasuk.value = 1
  expiredMasuk.value = p.expired || ''
}

function tambahBaris() {
  const p = produkDipilih.value
  if (!p) return ui.kabari('Pilih produk terlebih dahulu.', 'warn')
  const q = Number(qtyMasuk.value) || 0
  if (q <= 0) return ui.kabari('Qty harus lebih dari nol.', 'warn')
  const h = Number(hargaMasuk.value) || 0
  if (h <= 0) return ui.kabari('Harga beli harus lebih dari nol.', 'warn')

  const expired = expiredMasuk.value || null
  const ada = baris.value.find(
    (b) => b.produk_id === p.id && b.harga_beli === h && b.expired === expired,
  )
  if (ada) {
    ada.qty = Number((ada.qty + q).toFixed(3))
  } else {
    baris.value.push({
      produk_id: p.id,
      nama: p.nama,
      satuan: p.satuan,
      qty: Number(q.toFixed(3)),
      harga_beli: h,
      expired,
    })
  }
  pilih.value = ''
  qtyMasuk.value = 1
  hargaMasuk.value = 0
  expiredMasuk.value = ''
}

function simpan() {
  if (!baris.value.length) return
  const nomor = nomorStokMasukBerikutnya()
  tambahStokMasuk({
    id: Date.now(),
    nomor,
    tanggal: HARI_INI,
    supplier_id: supplierId.value,
    status: 'draft',
    items: baris.value.map((b) => ({
      produk_id: b.produk_id,
      qty: b.qty,
      harga_beli: b.harga_beli,
      expired: b.expired,
    })),
  })
  segarkan()
  formOpen.value = false
  ui.kabari(`Draft ${nomor} dibuat. Tekan "Terima barang" untuk menambah stok & batch.`, 'ok')
}

function lihat(d) {
  detail.value = d
}

function terima(d) {
  const hasil = terimaStokMasuk(d.nomor)
  if (!hasil) return ui.kabari('Dokumen tidak dapat diterima.', 'warn')
  segarkan()
  const batchBaru = hasil.items.filter((i) => i.expired).length
  ui.kabari(
    `${hasil.nomor} diterima. Stok bertambah${batchBaru ? ` dan ${batchBaru} batch baru dibuat` : ''}.`,
    'ok',
  )
}
</script>
