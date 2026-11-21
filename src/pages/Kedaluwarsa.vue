<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="text-lg font-semibold text-ink">Kedaluwarsa &amp; FEFO</h2>
          <AddonTag />
        </div>
        <p class="mt-0.5 max-w-2xl text-xs text-ink-soft">
          Pantau batch mendekati kedaluwarsa. Saat kasir menjual, batch dengan tanggal terdekat
          dipotong lebih dulu.
        </p>
      </div>
      <RouterLink to="/kasir" class="btn btn-primary">
        <ShoppingCart :size="15" :stroke-width="1.6" />
        Buka kasir
      </RouterLink>
    </div>

    <div class="panel grid grid-cols-2 overflow-hidden lg:grid-cols-4" data-tour="exp-kpi">
      <div class="border-b border-r border-line p-4 lg:border-b-0">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Sudah expired</div>
        <div class="mt-1.5 text-lg font-semibold tnum sm:text-2xl" :class="ringkas.expired ? 'text-bad' : ''">
          {{ ringkas.expired }}
        </div>
        <div class="mt-0.5 text-xs text-ink-soft">batch, tarik dari rak</div>
      </div>
      <div class="border-b border-line p-4 lg:border-b-0 lg:border-r">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">≤ 30 hari</div>
        <div class="mt-1.5 text-lg font-semibold tnum sm:text-2xl text-warn">{{ ringkas.segera }}</div>
        <div class="mt-0.5 text-xs text-ink-soft">batch mendekati</div>
      </div>
      <div class="border-b border-r border-line p-4 lg:border-b-0">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Nilai berisiko</div>
        <div class="mt-1.5 whitespace-nowrap text-lg font-semibold tnum sm:text-2xl">
          {{ rupiah(ringkas.nilai) }}
        </div>
        <div class="mt-0.5 text-xs text-ink-soft">harga beli batch</div>
      </div>
      <div class="border-b border-line p-4 lg:border-b-0">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Batch aktif</div>
        <div class="mt-1.5 text-lg font-semibold tnum sm:text-2xl">{{ semua.length }}</div>
        <div class="mt-0.5 text-xs text-ink-soft">dilacak di demo</div>
      </div>
    </div>

    <section class="panel border-l-2 border-l-accent-2 p-4" data-tour="exp-fefo">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-semibold text-ink">Cara kerja FEFO</span>
        <span class="rounded border border-line px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-ink-soft">
          First Expired First Out
        </span>
      </div>
      <ol class="mt-2 grid gap-2 text-xs text-ink-soft sm:grid-cols-3">
        <li class="flex gap-2">
          <span class="font-mono text-[#9aa8a5]">01</span>
          <span>Barang masuk dicatat dengan tanggal expired per batch.</span>
        </li>
        <li class="flex gap-2">
          <span class="font-mono text-[#9aa8a5]">02</span>
          <span>Kasir menjual: batch terdekat dipotong lebih dulu, bukan yang terbaru.</span>
        </li>
        <li class="flex gap-2">
          <span class="font-mono text-[#9aa8a5]">03</span>
          <span>Batch expired bisa ditarik dari rak; stok produk ikut berkurang.</span>
        </li>
      </ol>
    </section>

    <section class="panel">
      <div class="flex flex-wrap items-center gap-2 border-b border-line p-3">
        <div class="flex flex-wrap rounded border border-line p-0.5">
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
          <input v-model="cari" class="input h-9 pl-8" placeholder="Produk atau kode batch…" />
        </div>
      </div>

      <div class="hidden overflow-x-auto md:block" data-tour="exp-tabel">
        <table class="tbl">
          <thead>
            <tr>
              <th>Produk</th>
              <th class="w-36">Batch</th>
              <th class="w-28">Expired</th>
              <th class="num w-20">Sisa hari</th>
              <th class="num w-20">Qty</th>
              <th class="num w-32">Nilai</th>
              <th class="w-28">Status</th>
              <th class="w-24"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in tampil" :key="b.id">
              <td>
                <div class="truncate font-medium">{{ b.produk_nama }}</div>
                <div class="text-2xs text-ink-soft">{{ b.kategori }}</div>
              </td>
              <td class="font-mono text-2xs text-ink-soft">{{ b.kode }}</td>
              <td class="tnum" :class="b.status === 'expired' ? 'text-bad' : ''">
                {{ tanggalPendek(b.expired) }}
              </td>
              <td class="num tnum" :class="b.sisa_hari < 0 ? 'text-bad' : b.sisa_hari <= 30 ? 'text-warn' : 'text-ink-soft'">
                {{ b.sisa_hari }}
              </td>
              <td class="num">{{ qty(b.qty) }} <span class="text-2xs text-ink-soft">{{ b.satuan }}</span></td>
              <td class="num text-ink-soft">{{ rupiah(b.nilai) }}</td>
              <td>
                <span class="status" :class="statusKelas(b)">{{ statusTeks(b) }}</span>
              </td>
              <td class="text-right">
                <button type="button" class="btn btn-sm" @click="bukaTarik(b)">Tarik</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="divide-y divide-line md:hidden">
        <div v-for="b in tampil" :key="b.id" class="px-3 py-3">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <div class="truncate text-sm font-medium">{{ b.produk_nama }}</div>
              <div class="font-mono text-2xs text-ink-soft">{{ b.kode }}</div>
            </div>
            <span class="status shrink-0" :class="statusKelas(b)">{{ statusTeks(b) }}</span>
          </div>
          <div class="mt-2 grid grid-cols-3 gap-2 text-xs">
            <div>
              <div class="text-2xs text-ink-soft">Expired</div>
              <div class="tnum">{{ tanggalPendek(b.expired) }}</div>
            </div>
            <div>
              <div class="text-2xs text-ink-soft">Qty</div>
              <div>{{ qty(b.qty) }} {{ b.satuan }}</div>
            </div>
            <div>
              <div class="text-2xs text-ink-soft">Nilai</div>
              <div class="tnum">{{ rupiah(b.nilai) }}</div>
            </div>
          </div>
          <div class="mt-2 flex items-center justify-between gap-2">
            <span class="text-2xs text-ink-soft">
              {{ b.sisa_hari < 0 ? `Lewat ${Math.abs(b.sisa_hari)} hari` : `${b.sisa_hari} hari lagi` }}
            </span>
            <button type="button" class="btn btn-sm" @click="bukaTarik(b)">Tarik dari rak</button>
          </div>
        </div>
      </div>

      <div v-if="!tampil.length" class="px-4 py-10 text-center">
        <p class="text-sm font-medium text-ink">Tidak ada batch pada filter ini</p>
        <p class="mt-1 text-xs text-ink-soft">Batch baru muncul dari penerimaan barang di Stok Masuk.</p>
      </div>
    </section>

    <p class="text-xs text-ink-soft">
      Menarik batch menghapus sisa batch dari rak dan mengurangi stok produk. Tindakan ini tercatat
      di sesi demo dan kembali seperti semula setelah halaman dimuat ulang.
    </p>

    <Modal
      :open="!!pilihan"
      title="Tarik batch dari rak"
      :subtitle="pilihan ? `${pilihan.produk_nama} · ${pilihan.kode}` : ''"
      lebar="max-w-md"
      @close="tutup"
    >
      <div v-if="pilihan" class="space-y-3 px-4 py-4">
        <div class="rounded border border-[#e3c9a8] bg-[#fdf6ec] p-3 text-xs text-warn">
          {{ qty(pilihan.qty) }} {{ pilihan.satuan }} senilai {{ rupiah(pilihan.nilai) }} akan
          dikeluarkan dari stok. Tindakan ini tidak bisa dibatalkan di demo.
        </div>
        <div>
          <label class="label" for="tarik-alasan">Alasan</label>
          <select id="tarik-alasan" v-model="alasan" class="input">
            <option value="Kedaluwarsa">Kedaluwarsa</option>
            <option value="Kemasan rusak">Kemasan rusak</option>
            <option value="Tarik supplier">Tarik supplier</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
      </div>

      <template #footer>
        <span class="text-2xs text-ink-soft">Stok produk ikut berkurang.</span>
        <div class="flex gap-2">
          <button type="button" class="btn" @click="tutup">Batal</button>
          <button type="button" class="btn btn-primary" @click="tarik">Tarik batch</button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Search, ShoppingCart } from 'lucide-vue-next'
import Modal from '../components/Modal.vue'
import AddonTag from '../components/AddonTag.vue'
import { getKedaluwarsa, tarikBatch } from '../data/adapter'
import { qty, rupiah, tanggalPendek } from '../lib/format'
import { useUi } from '../stores/ui'

const ui = useUi()
const semua = ref(getKedaluwarsa())
const tab = ref('semua')
const cari = ref('')
const pilihan = ref(null)
const alasan = ref('Kedaluwarsa')

const ringkas = computed(() => {
  const kena = semua.value.filter((b) => b.sisa_hari <= 30)
  return {
    expired: kena.filter((b) => b.sisa_hari < 0).length,
    segera: kena.filter((b) => b.sisa_hari >= 0).length,
    nilai: kena.reduce((s, b) => s + b.nilai, 0),
  }
})

const jumlah = (id) => {
  if (id === 'semua') return semua.value.length
  if (id === 'expired') return semua.value.filter((b) => b.sisa_hari < 0).length
  if (id === 'segera') return semua.value.filter((b) => b.sisa_hari >= 0 && b.sisa_hari <= 30).length
  if (id === 'aman') return semua.value.filter((b) => b.sisa_hari > 30).length
  return 0
}

const tabs = computed(() => [
  { id: 'semua', label: 'Semua', jumlah: jumlah('semua') },
  { id: 'expired', label: 'Expired', jumlah: jumlah('expired') },
  { id: 'segera', label: '≤ 30 hari', jumlah: jumlah('segera') },
  { id: 'aman', label: 'Aman', jumlah: jumlah('aman') },
])

const tampil = computed(() => {
  const q = cari.value.trim().toLowerCase()
  return semua.value.filter((b) => {
    const cocokTab =
      tab.value === 'semua' ||
      (tab.value === 'expired' && b.sisa_hari < 0) ||
      (tab.value === 'segera' && b.sisa_hari >= 0 && b.sisa_hari <= 30) ||
      (tab.value === 'aman' && b.sisa_hari > 30)
    const cocokCari =
      !q ||
      b.produk_nama.toLowerCase().includes(q) ||
      b.kode.toLowerCase().includes(q) ||
      b.kategori.toLowerCase().includes(q)
    return cocokTab && cocokCari
  })
})

const statusTeks = (b) => {
  if (b.sisa_hari < 0) return 'Expired'
  if (b.sisa_hari <= 30) return `≤ ${b.sisa_hari} hari`
  return 'Aman'
}
const statusKelas = (b) =>
  b.sisa_hari < 0 ? 'text-bad' : b.sisa_hari <= 30 ? 'text-warn' : 'text-ok'

function bukaTarik(b) {
  pilihan.value = b
  alasan.value = b.sisa_hari < 0 ? 'Kedaluwarsa' : 'Tarik supplier'
}
function tutup() {
  pilihan.value = null
}
function tarik() {
  if (!pilihan.value) return
  const nama = pilihan.value.produk_nama
  const hasil = tarikBatch(pilihan.value.id, alasan.value)
  if (!hasil) return ui.kabari('Batch tidak dapat ditarik.', 'warn')
  semua.value = getKedaluwarsa()
  tutup()
  ui.kabari(`${qty(hasil.qty_ditarik)} ${nama} ditarik dari rak. Stok berkurang.`, 'ok')
}
</script>
