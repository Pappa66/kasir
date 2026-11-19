<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-ink">Daftar produk</h2>
        <p class="mt-0.5 text-xs text-ink-soft">
          {{ daftar.length }} produk · {{ kritis }} menipis · nilai stok
          {{ rupiah(nilaiStok) }}
        </p>
      </div>
      <div class="flex gap-2">
        <button type="button" class="btn" @click="impor">
          <Upload :size="15" :stroke-width="1.6" />
          <span class="hidden sm:inline">Import</span>
        </button>
        <button type="button" class="btn btn-primary" @click="bukaBaru">
          <Plus :size="15" :stroke-width="1.8" />
          Tambah produk
        </button>
      </div>
    </div>

    <section class="panel">
      <div class="flex flex-wrap items-center gap-2 border-b border-line p-3">
        <div class="relative w-full min-w-0 sm:max-w-xs">
          <Search
            :size="15"
            :stroke-width="1.6"
            class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3a0]"
          />
          <input v-model="cari" class="input h-9 pl-8" placeholder="Cari nama, kode, barcode…" />
        </div>
        <select v-model="kategori" class="input h-9 w-full text-xs sm:w-auto sm:max-w-[180px]">
          <option value="">Semua kategori</option>
          <option v-for="k in kategoriList" :key="k" :value="k">{{ k }}</option>
        </select>
        <span class="ml-auto text-xs text-ink-soft">{{ hasil.length }} hasil</span>
      </div>

      <div class="hidden overflow-x-auto md:block">
        <table class="tbl">
          <thead>
            <tr>
              <th class="hidden w-24 sm:table-cell">Kode</th>
              <th>Produk</th>
              <th class="hidden w-36 md:table-cell">Kategori</th>
              <th class="num w-28">Harga jual</th>
              <th class="num w-28">Stok</th>
              <th class="num hidden w-20 sm:table-cell">Minimum</th>
              <th class="w-24">Status</th>
              <th class="hidden w-20 sm:table-cell"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in hasil" :key="p.id" class="cursor-pointer" @click="bukaEdit(p)">
              <td class="hidden font-mono text-xs text-ink-soft sm:table-cell">{{ p.kode }}</td>
              <td>
                <div class="font-medium text-ink">{{ p.nama }}</div>
                <div class="font-mono text-2xs text-ink-soft">
                  {{ p.barcode || 'tanpa barcode' }}
                </div>
              </td>
              <td class="hidden text-ink-soft md:table-cell">{{ p.kategori }}</td>
              <td class="num">{{ rupiah(p.harga_jual) }}</td>
              <td class="num">
                <span :class="p.stok <= p.stok_minimum ? 'font-medium text-warn' : ''">
                  {{ qty(p.stok) }}
                </span>
                <span class="text-2xs text-ink-soft">&nbsp;{{ p.satuan }}</span>
              </td>
              <td class="num hidden text-ink-soft sm:table-cell">{{ qty(p.stok_minimum) }}</td>
              <td>
                <span class="status" :class="statusWarna(p)">{{ statusTeks(p) }}</span>
              </td>
              <td class="hidden text-right sm:table-cell">
                <button type="button" class="btn btn-sm btn-ghost" @click.stop="bukaEdit(p)">
                  Ubah
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="divide-y divide-line md:hidden">
        <button
          v-for="p in hasil"
          :key="p.id"
          type="button"
          class="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-surface"
          @click="bukaEdit(p)"
        >
          <div class="min-w-0 flex-1">
            <div class="truncate text-sm font-medium text-ink">{{ p.nama }}</div>
            <div class="mt-0.5 text-2xs text-ink-soft">{{ p.kode }} · {{ p.kategori }}</div>
            <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
              <span class="tnum">{{ rupiah(p.harga_jual) }}</span>
              <span class="text-ink-soft">·</span>
              <span :class="p.stok <= p.stok_minimum ? 'font-medium text-warn' : 'text-ink-soft'">
                stok {{ qty(p.stok) }} {{ p.satuan }}
              </span>
              <span class="status" :class="statusWarna(p)">{{ statusTeks(p) }}</span>
            </div>
          </div>
          <ChevronRight :size="16" :stroke-width="1.6" class="shrink-0 text-[#9aa8a5]" />
        </button>
      </div>

      <div v-if="!hasil.length" class="px-4 py-10 text-center">
        <p class="text-sm font-medium text-ink">Produk tidak ditemukan</p>
        <p class="mt-1 text-xs text-ink-soft">Coba kata kunci lain atau ganti kategori.</p>
      </div>
    </section>

    <p class="text-xs text-ink-soft">
      Perubahan produk pada prototipe ini hanya tersimpan selama tab terbuka.
    </p>

    <Modal
      :open="formOpen"
      :title="mode === 'baru' ? 'Tambah produk' : 'Ubah produk'"
      :subtitle="mode === 'baru' ? 'Produk baru untuk daftar jual' : form.kode"
      lebar="max-w-xl"
      @close="formOpen = false"
    >
      <div class="grid gap-3 px-4 py-4 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label class="label" for="p-nama">Nama produk</label>
          <input id="p-nama" v-model="form.nama" class="input" placeholder="cth. Beras Pandan Wangi 5kg" />
        </div>
        <div>
          <label class="label" for="p-kategori">Kategori</label>
          <select id="p-kategori" v-model="form.kategori" class="input">
            <option v-for="k in kategoriList" :key="k" :value="k">{{ k }}</option>
          </select>
        </div>
        <div>
          <label class="label" for="p-satuan">Satuan</label>
          <select id="p-satuan" v-model="form.satuan" class="input">
            <option v-for="s in satuanList" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div>
          <label class="label" for="p-barcode">Barcode</label>
          <input id="p-barcode" v-model="form.barcode" class="input font-mono text-xs" placeholder="opsional" />
        </div>
        <div>
          <label class="label" for="p-stok">Stok saat ini</label>
          <input id="p-stok" v-model="form.stok" type="number" min="0" class="input tnum" />
        </div>
        <div>
          <label class="label" for="p-beli">Harga beli</label>
          <input id="p-beli" v-model="form.harga_beli" type="number" min="0" class="input tnum" />
        </div>
        <div>
          <label class="label" for="p-jual">Harga jual</label>
          <input id="p-jual" v-model="form.harga_jual" type="number" min="0" class="input tnum" />
        </div>
        <div>
          <label class="label" for="p-min">Stok minimum</label>
          <input id="p-min" v-model="form.stok_minimum" type="number" min="0" class="input tnum" />
        </div>
        <div class="flex items-end pb-2">
          <p class="text-xs text-ink-soft">
            Margin kotor
            <span class="font-medium text-ink">{{ margin }}%</span>
          </p>
        </div>
      </div>

      <template #footer>
        <span class="text-2xs text-ink-soft">Data contoh — tidak tersimpan permanen.</span>
        <div class="flex gap-2">
          <button type="button" class="btn" @click="formOpen = false">Batal</button>
          <button type="button" class="btn btn-primary" @click="simpan">Simpan produk</button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ChevronRight, Plus, Search, Upload } from 'lucide-vue-next'
import Modal from '../components/Modal.vue'
import { getProduk } from '../data/adapter'
import { rupiah, qty } from '../lib/format'
import { useUi } from '../stores/ui'

const ui = useUi()
const daftar = ref(getProduk())
const cari = ref('')
const kategori = ref('')
const formOpen = ref(false)
const mode = ref('baru')
const form = ref({})

const kategoriList = computed(() => [...new Set(daftar.value.map((p) => p.kategori))])
const satuanList = ['pcs', 'kg', 'karung', 'rak', 'kotak', 'tabung', 'botol', 'pack']

const hasil = computed(() => {
  const q = cari.value.trim().toLowerCase()
  return daftar.value.filter((p) => {
    const cocokKategori = !kategori.value || p.kategori === kategori.value
    const cocokCari =
      !q || p.nama.toLowerCase().includes(q) || p.kode.toLowerCase().includes(q) || p.barcode === q
    return cocokKategori && cocokCari
  })
})

const kritis = computed(() => daftar.value.filter((p) => p.stok <= p.stok_minimum).length)
const nilaiStok = computed(() => daftar.value.reduce((s, p) => s + p.stok * p.harga_beli, 0))
const margin = computed(() => {
  const jual = Number(form.value.harga_jual) || 0
  const beli = Number(form.value.harga_beli) || 0
  return jual > 0 ? Math.round(((jual - beli) / jual) * 100) : 0
})

const statusTeks = (p) => (p.stok <= 0 ? 'Habis' : p.stok <= p.stok_minimum ? 'Menipis' : 'Aman')
const statusWarna = (p) => (p.stok <= 0 ? 'text-bad' : p.stok <= p.stok_minimum ? 'text-warn' : 'text-ok')

function bukaBaru() {
  mode.value = 'baru'
  form.value = {
    nama: '',
    kategori: kategoriList.value[0] || 'Lainnya',
    satuan: 'pcs',
    barcode: '',
    harga_beli: 0,
    harga_jual: 0,
    stok: 0,
    stok_minimum: 5,
  }
  formOpen.value = true
}

function bukaEdit(p) {
  mode.value = 'ubah'
  form.value = { ...p }
  formOpen.value = true
}

function simpan() {
  const f = form.value
  if (!String(f.nama).trim()) return ui.kabari('Nama produk wajib diisi.', 'warn')
  if (Number(f.harga_jual) <= 0) return ui.kabari('Harga jual harus lebih dari nol.', 'warn')
  if (Number(f.harga_jual) < Number(f.harga_beli))
    return ui.kabari('Harga jual lebih kecil dari harga beli.', 'warn')

  if (mode.value === 'baru') {
    const id = Math.max(0, ...daftar.value.map((p) => p.id)) + 1
    daftar.value.unshift({
      id,
      kode: `BRG-${String(id).padStart(3, '0')}`,
      barcode: String(f.barcode || ''),
      nama: String(f.nama).trim(),
      kategori: f.kategori,
      satuan: f.satuan,
      satuan_dasar: f.satuan,
      konversi: 1,
      harga_beli: Number(f.harga_beli) || 0,
      harga_jual: Number(f.harga_jual) || 0,
      stok: Number(f.stok) || 0,
      stok_minimum: Number(f.stok_minimum) || 0,
      pakai_batch: false,
      expired: null,
    })
    ui.kabari('Produk baru ditambahkan (demo, belum tersimpan).', 'ok')
  } else {
    const i = daftar.value.findIndex((p) => p.id === f.id)
    if (i >= 0) {
      daftar.value[i] = {
        ...daftar.value[i],
        ...f,
        nama: String(f.nama).trim(),
        harga_beli: Number(f.harga_beli) || 0,
        harga_jual: Number(f.harga_jual) || 0,
        stok: Number(f.stok) || 0,
        stok_minimum: Number(f.stok_minimum) || 0,
      }
    }
    ui.kabari('Perubahan produk disimpan di sesi ini.', 'ok')
  }
  formOpen.value = false
}

function impor() {
  ui.kabari('Import Excel tersedia di aplikasi asli. Demo memakai 25 produk contoh.', 'info')
}
</script>
