<template>
  <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
    <!-- Kolom kiri: pencarian + keranjang -->
    <div class="min-w-0 space-y-4">
      <div class="panel" data-tour="cari">
        <div class="relative p-3">
          <Search
            :size="16"
            :stroke-width="1.6"
            class="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-[#94a3a0]"
          />
          <input
            ref="inputCari"
            v-model="cari"
            type="text"
            class="input h-11 pl-9 pr-3 text-sm sm:pr-24 sm:text-base"
            placeholder="Scan barcode atau ketik produk…"
            autocomplete="off"
            spellcheck="false"
            @keydown.down.prevent="geser(1)"
            @keydown.up.prevent="geser(-1)"
            @keydown.enter.prevent="pilihAktif"
            @keydown.esc="cari = ''"
          />
          <div class="absolute right-5 top-1/2 hidden -translate-y-1/2 items-center gap-1.5 text-2xs text-ink-soft sm:flex">
            <kbd class="rounded border border-line bg-surface px-1.5 py-0.5">Enter</kbd>
            <span>tambah</span>
          </div>

          <!-- hasil pencarian -->
          <div
            v-if="cari && hasil.length"
            class="absolute left-3 right-3 top-[calc(100%-2px)] z-20 overflow-hidden rounded border border-line bg-paper shadow-[0_4px_12px_rgba(15,47,46,0.10)]"
          >
            <button
              v-for="(p, i) in hasil"
              :key="p.id"
              type="button"
              class="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors"
              :class="i === aktifIndex ? 'bg-surface' : 'hover:bg-surface'"
              @mouseenter="aktifIndex = i"
              @click="tambah(p)"
            >
              <div class="min-w-0 flex-1">
                <div class="truncate text-sm text-ink">{{ p.nama }}</div>
                <div class="text-2xs text-ink-soft">
                  {{ p.kode }} · stok {{ qty(p.stok) }} {{ p.satuan }}
                </div>
              </div>
              <div class="tnum shrink-0 text-sm font-medium">{{ rupiah(p.harga_jual) }}</div>
            </button>
          </div>

          <div
            v-else-if="cari && !hasil.length"
            class="absolute left-3 right-3 top-[calc(100%-2px)] z-20 rounded border border-line bg-paper px-3 py-2 text-xs text-ink-soft shadow-[0_4px_12px_rgba(15,47,46,0.10)]"
          >
            Produk tidak ditemukan.
          </div>
        </div>

        <div class="flex items-center justify-between border-t border-line px-3 py-1.5 max-sm:hidden">
          <span class="hidden text-2xs text-ink-soft sm:inline">
            Barcode gun USB langsung menambahkan barang ke keranjang.
          </span>
          <span v-if="pesan" class="text-2xs font-medium text-warn">{{ pesan }}</span>
        </div>
      </div>

      <div class="panel flex min-h-[300px] flex-col lg:min-h-[420px]" data-tour="keranjang">
        <div class="panel-h shrink-0" data-tour="kasir-qty">
          <div class="flex items-center gap-2">
            <span class="panel-title">Keranjang</span>
            <span class="text-xs text-ink-soft">{{ keranjang.jumlahItem }} item</span>
          </div>
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            :disabled="!keranjang.jumlahItem"
            @click="keranjang.kosongkan()"
          >
            <Trash2 :size="14" :stroke-width="1.6" />
            Kosongkan
          </button>
        </div>

        <div v-if="!keranjang.jumlahItem" class="flex flex-1 flex-col items-center justify-center px-4 py-14 text-center">
          <ShoppingCart :size="20" :stroke-width="1.5" class="mx-auto mb-3 text-[#9aa8a5]" />
          <p class="text-sm font-medium text-ink">Belum ada item</p>
          <p class="mt-1 text-xs text-ink-soft">Scan barcode atau ketik nama produk di kolom atas.</p>
        </div>

        <div v-else class="flex-1 overflow-auto">
          <table class="tbl table-fixed">
            <thead>
              <tr>
                <th>Produk</th>
                <th class="w-[112px] text-center">Qty</th>
                <th class="num hidden w-24 sm:table-cell">Harga</th>
                <th class="num hidden w-24 sm:table-cell sm:w-28">Subtotal</th>
                <th class="w-9"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in keranjang.items" :key="i.produk_id">
                <td>
                  <div class="flex items-center gap-2">
                    <span class="truncate font-medium" :title="i.nama">{{ i.nama }}</span>
                    <span
                      v-if="peringatanExpired(i)"
                      class="hidden shrink-0 rounded border border-[#e3c9a8] px-1 text-[10px] text-warn sm:inline"
                    >
                      {{ peringatanExpired(i) }}
                    </span>
                  </div>
                  <div class="flex flex-wrap items-center gap-x-1.5 text-2xs text-ink-soft">
                    <span class="hidden sm:inline">per {{ i.satuan }}</span>
                    <span class="sm:hidden">{{ rupiah(i.qty * i.harga) }}</span>
                    <span
                      v-if="peringatanExpired(i)"
                      class="rounded border border-[#e3c9a8] px-1 text-[10px] text-warn sm:hidden"
                    >
                      {{ peringatanExpired(i) }}
                    </span>
                  </div>
                </td>
                <td>
                  <div class="flex items-center">
                    <button
                      type="button"
                      class="h-7 w-6 rounded-l border border-line text-ink-soft transition-colors hover:bg-surface sm:w-7"
                      @click="keranjang.turun(i.produk_id)"
                    >
                      <Minus :size="13" :stroke-width="1.8" class="mx-auto" />
                    </button>
                    <input
                      :value="i.qty"
                      type="number"
                      :step="i.desimal ? 0.25 : 1"
                      min="0"
                      class="h-7 w-10 border-y border-line text-center text-sm tnum focus:outline-none sm:w-12"
                      @change="keranjang.ubahQty(i.produk_id, $event.target.value)"
                    />
                    <button
                      type="button"
                      class="h-7 w-6 rounded-r border border-line text-ink-soft transition-colors hover:bg-surface sm:w-7"
                      @click="keranjang.naik(i.produk_id)"
                    >
                      <Plus :size="13" :stroke-width="1.8" class="mx-auto" />
                    </button>
                  </div>
                </td>
                <td class="num hidden text-ink-soft sm:table-cell">{{ rupiah(i.harga) }}</td>
                <td class="num hidden font-medium sm:table-cell">{{ rupiah(i.qty * i.harga) }}</td>
                <td class="text-right">
                  <button
                    type="button"
                    class="text-ink-soft transition-colors hover:text-bad"
                    title="Hapus"
                    @click="keranjang.hapus(i.produk_id)"
                  >
                    <X :size="15" :stroke-width="1.6" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Kolom kanan: ringkasan pembayaran -->
    <aside class="min-w-0 space-y-4 lg:sticky lg:top-[68px]">
      <div class="panel" data-tour="bayar">
        <div class="panel-h">
          <span class="panel-title">Pembayaran</span>
          <div class="flex rounded border border-line p-0.5" data-tour="kasir-metode">
            <button
              type="button"
              class="rounded px-2.5 py-0.5 text-2xs transition-colors"
              :class="keranjang.metode === 'tunai' ? 'bg-accent text-white' : 'text-ink-soft hover:bg-surface'"
              @click="keranjang.setMetode('tunai')"
            >
              Tunai
            </button>
            <button
              type="button"
              class="flex items-center gap-1 rounded px-2.5 py-0.5 text-2xs transition-colors"
              :class="keranjang.metode === 'bon' ? 'bg-accent text-white' : 'text-ink-soft hover:bg-surface'"
              @click="keranjang.setMetode('bon')"
            >
              Bon
              <span
                class="rounded border px-1 text-[9px] uppercase tracking-wide"
                :class="keranjang.metode === 'bon' ? 'border-white/40 text-white/80' : 'border-accent-2/40 text-accent-2'"
              >
                add-on
              </span>
            </button>
          </div>
        </div>

        <div class="space-y-2.5 px-4 py-4">
          <div class="flex items-center justify-between text-sm">
            <span class="text-ink-soft">Jumlah item</span>
            <span class="tnum">{{ keranjang.jumlahItem }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-ink-soft">Subtotal</span>
            <span class="tnum">{{ rupiah(keranjang.subtotal) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-ink-soft">Pajak (0%)</span>
            <span class="tnum text-ink-soft">Rp 0</span>
          </div>

          <div class="!mt-3 flex items-end justify-between border-t border-line pt-3" data-tour="kasir-total">
            <span class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Total</span>
            <span class="text-3xl font-semibold leading-none tnum">{{ rupiah(keranjang.total) }}</span>
          </div>

          <div class="border-t border-line pt-2.5">
            <div class="flex flex-wrap items-center justify-between gap-2" data-tour="kasir-kanal">
              <span class="text-2xs uppercase tracking-[0.04em] text-ink-soft">
                {{ keranjang.metode === 'bon' ? 'Uang muka lewat' : 'Uang masuk lewat' }}
              </span>
              <div class="flex rounded border border-line p-0.5">
                <button
                  type="button"
                  class="inline-flex items-center gap-1 rounded px-2 py-0.5 text-2xs transition-colors"
                  :class="keranjang.kanal === 'tunai' ? 'bg-ink text-white' : 'text-ink-soft hover:bg-surface'"
                  @click="keranjang.setKanal('tunai')"
                >
                  <Banknote :size="12" :stroke-width="1.8" />
                  Tunai
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-1 rounded px-2 py-0.5 text-2xs transition-colors"
                  :class="keranjang.kanal === 'qris' ? 'bg-ink text-white' : 'text-ink-soft hover:bg-surface'"
                  @click="keranjang.setKanal('qris')"
                >
                  <QrCode :size="12" :stroke-width="1.8" />
                  QRIS toko
                </button>
              </div>
            </div>
            <p v-if="keranjang.kanal === 'qris'" class="mt-1.5 text-2xs leading-relaxed text-ink-soft">
              QRIS statis toko. Nominal mengikuti total; pastikan notifikasi speaker berbunyi
              sebelum menyimpan.
            </p>
          </div>

          <template v-if="keranjang.metode === 'tunai' && keranjang.kanal === 'qris'">
            <div class="rounded border border-line bg-surface p-3 text-center">
              <QrCode :size="22" :stroke-width="1.5" class="mx-auto text-accent-2" />
              <div class="mt-1.5 text-2xs uppercase tracking-[0.04em] text-ink-soft">Nominal QRIS</div>
              <div class="mt-0.5 text-2xl font-semibold tnum">{{ rupiah(keranjang.total) }}</div>
            </div>

            <label class="flex cursor-pointer items-start gap-2 text-xs text-ink-soft">
              <input
                v-model="qrisMasuk"
                type="checkbox"
                class="mt-0.5 h-4 w-4 shrink-0 accent-[#0f3d3e]"
              />
              <span>Notifikasi QRIS sudah masuk di HP/speaker toko.</span>
            </label>

            <button
              type="button"
              class="btn btn-primary btn-lg mt-1 w-full"
              :disabled="!keranjang.bisaBayar || !qrisMasuk"
              @click="bayar"
            >
              Simpan bayar QRIS {{ rupiah(keranjang.total) }}
            </button>
          </template>

          <template v-else-if="keranjang.metode === 'tunai'">
            <div class="pt-1" data-tour="kasir-uang">
              <label class="label" for="tunai">Uang diterima</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-soft">Rp</span>
                <input
                  id="tunai"
                  v-model="tunaiTeks"
                  type="text"
                  inputmode="numeric"
                  class="input h-11 pl-9 text-base tnum"
                  placeholder="0"
                />
              </div>
              <div class="mt-2 flex gap-1.5">
                <button type="button" class="btn btn-sm flex-1" @click="keranjang.setTunai(keranjang.total)">
                  Uang pas
                </button>
                <button type="button" class="btn btn-sm flex-1" @click="tambahUang(50000)">+50 rb</button>
                <button type="button" class="btn btn-sm flex-1" @click="tambahUang(100000)">+100 rb</button>
              </div>
            </div>

            <div class="flex items-center justify-between pt-1 text-sm">
              <span class="text-ink-soft">Kembalian</span>
              <span class="tnum font-medium" :class="keranjang.kembalian > 0 ? 'text-ok' : 'text-ink-soft'">
                {{ rupiah(keranjang.kembalian) }}
              </span>
            </div>

            <button
              type="button"
              class="btn btn-primary btn-lg mt-1 w-full"
              data-tour="kasir-aksi"
              :disabled="!keranjang.bisaBayar"
              @click="bayar"
            >
              Bayar {{ rupiah(keranjang.total) }}
            </button>

            <p v-if="keranjang.jumlahItem && Number(keranjang.tunai) < keranjang.total" class="text-center text-2xs text-ink-soft">
              Uang diterima kurang {{ rupiah(keranjang.total - keranjang.tunai) }}
            </p>
          </template>

          <template v-else>
            <div class="space-y-2.5 border-t border-line pt-3">
              <div class="flex flex-wrap items-center gap-2">
                <AddonTag />
                <span class="text-2xs leading-relaxed text-ink-soft">
                  Bon pelanggan: barang diambil dulu, dibayar kemudian.
                </span>
              </div>

              <div>
                <label class="label" for="bon-pelanggan">Nama pelanggan</label>
                <input
                  id="bon-pelanggan"
                  v-model="keranjang.pelanggan"
                  class="input"
                  placeholder="cth. Bu Ani / Warung Sari"
                />
              </div>

              <div>
                <label class="label" for="bon-hp">No. WhatsApp <span class="normal-case text-[#94a3a0]">(opsional)</span></label>
                <input
                  id="bon-hp"
                  v-model="keranjang.noHp"
                  type="tel"
                  inputmode="tel"
                  class="input tnum"
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="label" for="bon-dp">Uang muka</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-soft">Rp</span>
                    <input
                      id="bon-dp"
                      v-model="dpTeks"
                      type="text"
                      inputmode="numeric"
                      class="input pl-9 tnum"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label class="label" for="bon-tempo">Jatuh tempo</label>
                  <input id="bon-tempo" v-model="keranjang.jatuhTempo" type="date" class="input tnum" />
                </div>
              </div>

              <div class="flex items-center justify-between border-t border-line pt-2 text-sm">
                <span class="text-ink-soft">Sisa bon</span>
                <span class="tnum font-semibold" :class="keranjang.sisaBon > 0 ? 'text-warn' : 'text-ok'">
                  {{ rupiah(keranjang.sisaBon) }}
                </span>
              </div>
            </div>

            <button
              type="button"
              class="btn btn-primary btn-lg mt-1 w-full"
              :disabled="!keranjang.bisaBayar"
              @click="bayar"
            >
              Simpan bon {{ rupiah(keranjang.total) }}
            </button>

            <p
              v-if="keranjang.jumlahItem && !keranjang.pelanggan.trim()"
              class="text-center text-2xs text-warn"
            >
              Nama pelanggan wajib diisi untuk bon.
            </p>
          </template>
        </div>
      </div>

      <div class="panel px-4 py-3" data-tour="pintasan">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Pintasan</div>
        <ul class="mt-1.5 space-y-1 text-xs text-ink-soft">
          <li class="flex justify-between gap-3"><span>Fokus pencarian</span><kbd class="rounded border border-line bg-surface px-1.5">/</kbd></li>
          <li class="flex justify-between gap-3"><span>Tambah barang</span><kbd class="rounded border border-line bg-surface px-1.5">Enter</kbd></li>
          <li class="flex justify-between gap-3"><span>Batalkan pencarian</span><kbd class="rounded border border-line bg-surface px-1.5">Esc</kbd></li>
        </ul>
      </div>
    </aside>

    <!-- Modal struk -->
    <Modal
      :open="!!struk"
      title="Transaksi selesai"
      :subtitle="struk ? struk.nomor : ''"
      lebar="max-w-md"
      @close="tutupStruk"
    >
      <div class="flex items-center justify-between border-b border-line px-4 py-2">
        <span class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Lebar struk</span>
        <div class="flex rounded border border-line p-0.5">
          <button
            type="button"
            class="rounded px-2.5 py-1 text-xs transition-colors"
            :class="lebar === 58 ? 'bg-accent text-white' : 'text-ink-soft hover:bg-surface'"
            @click="lebar = 58"
          >
            58 mm
          </button>
          <button
            type="button"
            class="rounded px-2.5 py-1 text-xs transition-colors"
            :class="lebar === 80 ? 'bg-accent text-white' : 'text-ink-soft hover:bg-surface'"
            @click="lebar = 80"
          >
            80 mm
          </button>
        </div>
      </div>

      <div class="flex justify-center bg-surface px-4 py-5">
        <StrukPreview
          :toko="toko"
          :nomor="struk.nomor"
          :tanggal="tanggalPendek(struk.tanggal)"
          :jam="struk.jam"
          :kasir="struk.kasir"
          :pelanggan="struk.pelanggan"
          :no-hp="struk.no_hp"
          :metode="struk.metode"
          :kanal="struk.kanal"
          :dibayar="struk.dibayar"
          :sisa="Math.max(0, struk.total - struk.dibayar)"
          :jatuh-tempo="struk.jatuh_tempo ? tanggalPendek(struk.jatuh_tempo) : ''"
          :items="struk.items"
          :total="struk.total"
          :tunai="struk.tunai"
          :kembalian="struk.kembalian"
          :lebar="lebar"
          class="border border-line px-3 py-3"
        />
      </div>

      <div class="flex flex-wrap items-center gap-2 border-t border-line px-4 py-2">
        <AddonTag class="!px-1.5 !py-0 !text-[9px]" />
        <span class="min-w-0 flex-1 truncate font-mono text-2xs text-ink-soft">
          {{ tautanStruk }}
        </span>
        <button type="button" class="btn btn-sm shrink-0" @click="salinTautan">
          Salin tautan
        </button>
      </div>

      <template #footer>
        <span class="text-2xs text-ink-soft">Prototipe — tidak tersimpan.</span>
        <div class="flex flex-wrap shrink-0 gap-2">
          <button type="button" class="btn whitespace-nowrap" @click="cetak">
            <Printer :size="15" :stroke-width="1.6" />
            Cetak
          </button>
          <button type="button" class="btn whitespace-nowrap" @click="kirimWA">
            <MessageCircle :size="15" :stroke-width="1.6" />
            WA
            <span class="rounded border border-accent-2/40 px-1 text-[9px] uppercase tracking-wide text-accent-2">
              add-on
            </span>
          </button>
          <button type="button" class="btn btn-primary whitespace-nowrap" @click="transaksiBaru">
            Transaksi baru
          </button>
        </div>
      </template>
    </Modal>

    <KirimWA
      :open="waOpen"
      :nomor="struk ? struk.no_hp : ''"
      :pesan="pesanWA"
      :subjudul="struk ? struk.nomor : ''"
      @close="waOpen = false"
    />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  Search,
  ShoppingCart,
  Minus,
  Plus,
  X,
  Trash2,
  Printer,
  MessageCircle,
  Banknote,
  QrCode,
} from 'lucide-vue-next'
import StrukPreview from '../components/StrukPreview.vue'
import Modal from '../components/Modal.vue'
import KirimWA from '../components/KirimWA.vue'
import AddonTag from '../components/AddonTag.vue'
import { useKeranjang } from '../stores/keranjang'
import { useToko } from '../stores/toko'
import { useCetak } from '../stores/cetak'
import { useSesi } from '../stores/sesi'
import { useUi } from '../stores/ui'
import {
  getProduk,
  HARI_INI,
  jamDemo,
  nomorInvoiceBerikutnya,
  tambahPenjualan,
  kurangiStok,
  potongBatchFEFO,
  tautanPublik,
} from '../data/adapter'
import { pesanInvoice } from '../lib/pesan'
import { rupiah, qty, selisihHari, tanggalPendek } from '../lib/format'

const keranjang = useKeranjang()
const tokoStore = useToko()
const cetakStore = useCetak()
const sesi = useSesi()
const ui = useUi()
const route = useRoute()
const toko = computed(() => tokoStore.data)
const semuaProduk = getProduk()

const inputCari = ref(null)
const cari = ref('')
const aktifIndex = ref(0)
const pesan = ref('')
const struk = ref(null)
const waOpen = ref(false)
const lebar = ref(tokoStore.data.lebar_struk || 80)
const qrisMasuk = ref(false)

watch(
  () => [keranjang.kanal, keranjang.metode],
  () => (qrisMasuk.value = false),
)

let pesanTimer = null

const hasil = computed(() => {
  const q = cari.value.trim().toLowerCase()
  if (!q) return []
  return semuaProduk
    .filter(
      (p) =>
        p.nama.toLowerCase().includes(q) ||
        p.barcode === q ||
        p.kode.toLowerCase() === q,
    )
    .slice(0, 6)
})

onMounted(() => {
  if (route.query.bon === '1') keranjang.setMetode('bon')
  inputCari.value?.focus()
  document.addEventListener('keydown', pintasanGlobal)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', pintasanGlobal)
})

function pintasanGlobal(e) {
  if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
    e.preventDefault()
    inputCari.value?.focus()
  }
}

function geser(arah) {
  if (!hasil.value.length) return
  aktifIndex.value = (aktifIndex.value + arah + hasil.value.length) % hasil.value.length
}

function pilihAktif() {
  if (hasil.value.length) return tambah(hasil.value[Math.min(aktifIndex.value, hasil.value.length - 1)])
  if (cari.value.trim()) tampilPesan('Produk tidak ditemukan.')
}

function tambah(p) {
  if (p.stok <= 0) return tampilPesan(`Stok ${p.nama} habis.`)
  keranjang.tambah(p)
  cari.value = ''
  aktifIndex.value = 0
  pesan.value = ''
  inputCari.value?.focus()
}

function tampilPesan(t) {
  pesan.value = t
  clearTimeout(pesanTimer)
  pesanTimer = setTimeout(() => (pesan.value = ''), 2400)
}

function peringatanExpired(item) {
  if (!item.expired) return ''
  const sisa = selisihHari(item.expired, HARI_INI)
  if (sisa < 0) return 'expired'
  if (sisa <= 30) return `exp ${sisa} hari`
  return ''
}

const tunaiTeks = computed({
  get: () => (keranjang.tunai ? keranjang.tunai.toLocaleString('id-ID') : ''),
  set: (v) => keranjang.setTunai(String(v).replace(/\D/g, '')),
})

const dpTeks = computed({
  get: () => (keranjang.dp ? keranjang.dp.toLocaleString('id-ID') : ''),
  set: (v) => keranjang.setDp(String(v).replace(/\D/g, '')),
})

function tambahUang(nominal) {
  keranjang.setTunai((Number(keranjang.tunai) || 0) + nominal)
}

const tautanStruk = computed(() => (struk.value ? tautanPublik(struk.value.nomor) : ''))
const pesanWA = computed(() =>
  struk.value ? pesanInvoice(struk.value, toko.value, tautanStruk.value) : '',
)

function bayar() {
  if (!keranjang.bisaBayar) return
  const metode = keranjang.metode
  const kanal = keranjang.kanal
  if (metode === 'bon' && !keranjang.pelanggan.trim()) {
    return tampilPesan('Nama pelanggan wajib diisi untuk bon.')
  }
  if (metode === 'tunai' && kanal === 'qris' && !qrisMasuk.value) {
    return tampilPesan('Konfirmasi notifikasi QRIS dulu.')
  }

  const nomor = nomorInvoiceBerikutnya()
  const items = keranjang.items.map((i) => {
    // FEFO: potong batch terdekat lalu kurangi stok produk.
    const fefo = potongBatchFEFO(i.produk_id, i.qty)
    kurangiStok(i.produk_id, i.qty)
    return {
      produk_id: i.produk_id,
      nama: i.nama,
      satuan: i.satuan,
      qty: i.qty,
      harga: i.harga,
      subtotal: Math.round(i.qty * i.harga),
      batch: fefo.terpakai,
      batch_lewat: fefo.lewat,
    }
  })

  const total = keranjang.total
  const dibayar =
    metode === 'bon'
      ? Number(keranjang.dp) || 0
      : kanal === 'qris'
        ? total
        : Number(keranjang.tunai) || 0
  const batchTerpakai = items.flatMap((i) => i.batch || [])

  const transaksi = {
    id: Date.now(),
    nomor,
    tanggal: HARI_INI,
    jam: jamDemo(),
    kasir: sesi.aktif.nama,
    pelanggan: keranjang.pelanggan.trim(),
    no_hp: keranjang.noHp.trim(),
    items,
    subtotal: keranjang.subtotal,
    total,
    tunai: metode === 'tunai' && kanal === 'tunai' ? dibayar : 0,
    kembalian: metode === 'tunai' && kanal === 'tunai' ? keranjang.kembalian : 0,
    metode,
    kanal,
    status_bayar:
      metode === 'bon' ? (dibayar >= total ? 'lunas' : dibayar > 0 ? 'sebagian' : 'belum') : 'lunas',
    dibayar,
    jatuh_tempo: metode === 'bon' ? keranjang.jatuhTempo : null,
    pembayaran:
      dibayar > 0 ? [{ tanggal: HARI_INI, nominal: dibayar, kanal }] : [],
    batch_terpakai: batchTerpakai,
    status: 'selesai',
    void_alasan: null,
  }

  tambahPenjualan(transaksi)
  struk.value = transaksi
  qrisMasuk.value = false

  const adaLewat = items.some((i) => i.batch_lewat > 0)
  if (adaLewat) ui.kabari('Ada batch yang sudah lewat expired dan ikut terpotong. Cek halaman Kedaluwarsa.', 'warn')
}

function tutupStruk() {
  struk.value = null
  waOpen.value = false
}

function transaksiBaru() {
  keranjang.kosongkan()
  struk.value = null
  waOpen.value = false
  cari.value = ''
  inputCari.value?.focus()
}

function cetak() {
  if (!struk.value) return
  cetakStore.siapkan({
    toko: toko.value,
    nomor: struk.value.nomor,
    tanggal: tanggalPendek(struk.value.tanggal),
    jam: struk.value.jam,
    kasir: struk.value.kasir,
    pelanggan: struk.value.pelanggan,
    noHp: struk.value.no_hp,
    metode: struk.value.metode,
    kanal: struk.value.kanal,
    dibayar: struk.value.dibayar,
    sisa: Math.max(0, struk.value.total - struk.value.dibayar),
    jatuhTempo: struk.value.jatuh_tempo ? tanggalPendek(struk.value.jatuh_tempo) : '',
    items: struk.value.items,
    total: struk.value.total,
    tunai: struk.value.tunai,
    kembalian: struk.value.kembalian,
    lebar: lebar.value,
  })
  window.print()
}

function kirimWA() {
  if (!struk.value) return
  waOpen.value = true
}

async function salinTautan() {
  if (!tautanStruk.value) return
  try {
    await navigator.clipboard.writeText(tautanStruk.value)
    ui.kabari('Tautan invoice publik disalin.', 'ok')
  } catch {
    ui.kabari('Browser menolak akses clipboard. Salin manual dari teks tautan.', 'warn')
  }
}
</script>
