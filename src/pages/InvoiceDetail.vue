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
            <span class="status shrink-0" :class="statusKelas">
              {{ labelStatus }}
            </span>
          </div>
          <p class="truncate text-xs text-ink-soft">
            {{ tanggalPendek(trx.tanggal) }} · {{ trx.jam }} · kasir {{ trx.kasir }}
          </p>
        </div>
      </div>
      <div class="flex w-full flex-wrap gap-2 sm:w-auto sm:shrink-0" data-tour="detail-aksi">
        <button type="button" class="btn" @click="cetak">
          <Printer :size="15" :stroke-width="1.6" />
          Cetak struk
        </button>
        <button type="button" class="btn" @click="waOpen = true">
          <MessageCircle :size="15" :stroke-width="1.6" />
          WA
          <AddonTag class="!px-1.5 !py-0 !text-[9px]" />
        </button>
        <button type="button" class="btn" @click="ekspor">
          <Download :size="15" :stroke-width="1.6" />
          CSV
          <AddonTag class="!px-1.5 !py-0 !text-[9px]" />
        </button>
        <button
          v-if="bisaBayar"
          type="button"
          class="btn btn-primary"
          @click="bayarOpen = true"
        >
          <Wallet :size="15" :stroke-width="1.6" />
          Bayar bon
        </button>
        <button
          v-if="trx.status === 'selesai' && aturanVoid.boleh"
          data-tour="detail-void"
          type="button"
          class="btn text-bad"
          @click="voidOpen = true"
        >
          <Ban :size="15" :stroke-width="1.6" />
          Void
        </button>
        <span
          v-else-if="trx.status === 'selesai'"
          data-tour="detail-void"
          class="self-center text-2xs text-ink-soft"
          :title="aturanVoid.alasan"
        >
          Void: {{ aturanVoid.alasan }}
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
          Alasan: {{ trx.void_alasan || 'tidak dicatat' }}. Stok produk dan batch sudah dikembalikan
          di sesi demo ini.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div class="min-w-0 space-y-4">
        <section class="panel" data-tour="detail-rincian">
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
              <template v-if="trx.metode === 'bon'">
                <div class="flex justify-between">
                  <span class="text-ink-soft">Dibayar / DP</span>
                  <span class="tnum">{{ rupiah(trx.dibayar) }}</span>
                </div>
                <div class="flex justify-between font-medium">
                  <span>Sisa bon</span>
                  <span class="tnum" :class="sisa > 0 ? 'text-warn' : 'text-ok'">{{ rupiah(sisa) }}</span>
                </div>
                <div v-if="trx.jatuh_tempo" class="flex justify-between">
                  <span class="text-ink-soft">Jatuh tempo</span>
                  <span class="tnum">{{ tanggalPendek(trx.jatuh_tempo) }}</span>
                </div>
              </template>
              <template v-else>
                <div class="flex justify-between">
                  <span class="text-ink-soft">Tunai</span>
                  <span class="tnum">{{ rupiah(trx.tunai) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-ink-soft">Kembalian</span>
                  <span class="tnum text-ok">{{ rupiah(trx.kembalian) }}</span>
                </div>
              </template>
            </div>
          </div>

          <div
            v-if="trx.metode === 'bon' && trx.pembayaran.length"
            class="border-t border-line px-4 py-3"
          >
            <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">
              Riwayat uang masuk
            </div>
            <ul class="mt-1.5 space-y-1">
              <li
                v-for="(p, i) in trx.pembayaran"
                :key="i"
                class="flex items-baseline justify-between gap-2 text-xs"
              >
                <span class="text-ink-soft">
                  {{ tanggalPendek(p.tanggal) }} ·
                  {{ p.kanal === 'qris' ? 'QRIS toko' : 'Tunai' }}
                </span>
                <span class="tnum font-medium">{{ rupiah(p.nominal) }}</span>
              </li>
            </ul>
          </div>
        </section>

        <section class="panel" data-tour="detail-info">
          <div class="panel-h">
            <span class="panel-title">Informasi</span>
          </div>
          <dl class="grid gap-3 p-4 text-sm sm:grid-cols-2">
            <div>
              <dt class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Pelanggan</dt>
              <dd class="mt-0.5">{{ trx.pelanggan || 'Tanpa nama (walk-in)' }}</dd>
            </div>
            <div>
              <dt class="text-2xs uppercase tracking-[0.04em] text-ink-soft">No. WhatsApp</dt>
              <dd class="mt-0.5 tnum">{{ trx.no_hp || '—' }}</dd>
            </div>
            <div>
              <dt class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Metode bayar</dt>
              <dd class="mt-0.5">
                {{ trx.metode === 'bon' ? 'Bon (bayar kemudian)' : trx.kanal === 'qris' ? 'QRIS toko' : 'Tunai' }}
              </dd>
            </div>
            <div>
              <dt class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Status bayar</dt>
              <dd class="mt-0.5 capitalize">{{ labelBayar }}</dd>
            </div>
            <div v-if="trx.metode === 'bon'">
              <dt class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Jatuh tempo</dt>
              <dd class="mt-0.5 tnum">
                {{ trx.jatuh_tempo ? tanggalPendek(trx.jatuh_tempo) : '—' }}
                <span v-if="trx.jatuh_tempo && trx.status === 'selesai'" :class="lewat ? 'text-bad' : 'text-ink-soft'">
                  · {{ teksTempo }}
                </span>
              </dd>
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
              :pelanggan="trx.pelanggan"
              :no-hp="trx.no_hp"
              :metode="trx.metode"
              :kanal="trx.kanal"
              :dibayar="trx.dibayar"
              :sisa="sisa"
              :jatuh-tempo="trx.jatuh_tempo ? tanggalPendek(trx.jatuh_tempo) : ''"
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

          <div class="space-y-2 border-t border-line px-3 py-3" data-tour="detail-publik">
            <div class="flex items-center gap-2">
              <span class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Tautan publik</span>
              <AddonTag class="!px-1.5 !py-0 !text-[9px]" />
            </div>
            <p class="break-all font-mono text-[10px] leading-relaxed text-ink-soft">
              {{ tautan }}
            </p>
            <button type="button" class="btn btn-sm w-full" @click="salinTautan">
              Salin tautan invoice
            </button>
            <p class="text-2xs leading-relaxed text-ink-soft">
              Pelanggan dapat membuka rincian tanpa login. Tautan memakai token demo.
            </p>
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

        <div class="rounded border border-line bg-surface p-3 text-2xs leading-relaxed text-ink-soft">
          <template v-if="sesi.pemilik">
            Sebagai pemilik, void tidak dibatasi. Tetap isi alasan agar jejak audit lengkap.
          </template>
          <template v-else>
            Batas kasir: hanya transaksi hari ini, maks {{ BATAS_VOID.menit }} menit setelah
            transaksi, maks {{ BATAS_VOID.maks }} void per hari, dan bukan bon yang sudah dibayar.
            Void di atas {{ rupiah(BATAS_VOID.nominal) }} tetap bisa, tetapi ditandai untuk ditinjau
            pemilik.
          </template>
        </div>

        <div>
          <span class="label">Alasan cepat</span>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="a in alasanCepat"
              :key="a"
              type="button"
              class="btn btn-sm"
              :class="alasan === a ? 'btn-primary' : ''"
              @click="alasan = a"
            >
              {{ a }}
            </button>
          </div>
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

        <label
          v-if="aturanVoid.perluTinjauan"
          class="flex cursor-pointer items-start gap-2 rounded border border-[#e3c9a8] bg-[#fdf6ec] p-2.5 text-xs text-warn"
        >
          <input v-model="konfirmasiVoid" type="checkbox" class="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Saya sudah memeriksa. Void ini di atas {{ rupiah(BATAS_VOID.nominal) }} dan akan masuk
            daftar tinjauan pemilik.
          </span>
        </label>
      </div>

      <template #footer>
        <span class="text-2xs text-ink-soft">Wajib diisi.</span>
        <div class="flex flex-wrap gap-2">
          <button type="button" class="btn" @click="voidOpen = false">Batal</button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="!alasan.trim() || (aturanVoid.perluTinjauan && !konfirmasiVoid)"
            @click="voidkan"
          >
            Void transaksi
          </button>
        </div>
      </template>
    </Modal>

    <Modal
      :open="bayarOpen"
      title="Pelunasan bon"
      :subtitle="trx.nomor"
      lebar="max-w-md"
      @close="bayarOpen = false"
    >
      <div class="space-y-3 px-4 py-4">
        <div class="grid grid-cols-3 gap-2 rounded border border-line bg-surface p-3 text-center">
          <div>
            <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Total</div>
            <div class="mt-1 text-sm font-semibold tnum">{{ rupiah(trx.total) }}</div>
          </div>
          <div>
            <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Dibayar</div>
            <div class="mt-1 text-sm font-semibold tnum">{{ rupiah(trx.dibayar) }}</div>
          </div>
          <div>
            <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Sisa</div>
            <div class="mt-1 text-sm font-semibold tnum text-warn">{{ rupiah(sisa) }}</div>
          </div>
        </div>

        <div>
          <label class="label" for="bayar-nominal">Jumlah dibayar</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-soft">Rp</span>
            <input
              id="bayar-nominal"
              v-model="bayarTeks"
              type="text"
              inputmode="numeric"
              class="input pl-9 text-base tnum"
              placeholder="0"
            />
          </div>
          <div class="mt-2 flex gap-1.5">
            <button type="button" class="btn btn-sm" @click="isiLunas">Lunasi sisa</button>
            <button type="button" class="btn btn-sm" @click="isiSetengah">Setengah</button>
          </div>
        </div>

        <div>
          <span class="label">Uang masuk lewat</span>
          <div class="flex rounded border border-line p-0.5">
            <button
              type="button"
              class="inline-flex flex-1 items-center justify-center gap-1.5 rounded px-2 py-1 text-xs transition-colors"
              :class="bayarKanal === 'tunai' ? 'bg-ink text-white' : 'text-ink-soft hover:bg-surface'"
              @click="bayarKanal = 'tunai'"
            >
              <Banknote :size="13" :stroke-width="1.8" />
              Tunai
            </button>
            <button
              type="button"
              class="inline-flex flex-1 items-center justify-center gap-1.5 rounded px-2 py-1 text-xs transition-colors"
              :class="bayarKanal === 'qris' ? 'bg-ink text-white' : 'text-ink-soft hover:bg-surface'"
              @click="bayarKanal = 'qris'"
            >
              <QrCode :size="13" :stroke-width="1.8" />
              QRIS toko
            </button>
          </div>
          <p v-if="bayarKanal === 'qris'" class="mt-1.5 text-2xs leading-relaxed text-ink-soft">
            QRIS statis toko. Cek notifikasi speaker sebelum menyimpan.
          </p>
        </div>

        <p v-if="nominalBayar > sisa" class="text-xs text-warn">
          Jumlah melebihi sisa bon. Maksimal {{ rupiah(sisa) }}.
        </p>
        <p v-else class="text-xs text-ink-soft">
          Pembayaran mengurangi sisa bon dan tercatat sebagai riwayat pelunasan.
        </p>
      </div>

      <template #footer>
        <span class="text-2xs text-ink-soft">
          Pembayaran {{ bayarKanal === 'qris' ? 'QRIS toko' : 'tunai' }} · {{ HARI_INI }}
        </span>
        <div class="flex gap-2">
          <button type="button" class="btn" @click="bayarOpen = false">Batal</button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="!bisaBayarNominal"
            @click="bayarBon"
          >
            Simpan pembayaran
          </button>
        </div>
      </template>
    </Modal>

    <KirimWA
      :open="waOpen"
      :nomor="trx.no_hp"
      :pesan="pesanWA"
      :subjudul="trx.nomor"
      @close="waOpen = false"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  Banknote,
  Download,
  FileQuestion,
  MessageCircle,
  Printer,
  QrCode,
  Wallet,
} from 'lucide-vue-next'
import EmptyState from '../components/EmptyState.vue'
import Modal from '../components/Modal.vue'
import StrukPreview from '../components/StrukPreview.vue'
import AddonTag from '../components/AddonTag.vue'
import KirimWA from '../components/KirimWA.vue'
import {
  BATAS_VOID,
  batalkanPenjualan,
  bayarPiutang,
  cekVoid,
  getPenjualan,
  HARI_INI,
  tautanPublik,
} from '../data/adapter'
import { unduhCSV } from '../lib/ekspor'
import { pesanInvoice } from '../lib/pesan'
import { qty, rupiah, selisihHari, tanggalPendek } from '../lib/format'
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
const trx = ref(getPenjualan().find((t) => t.nomor === route.params.nomor) || null)
const lebar = ref(tokoStore.data.lebar_struk === 58 ? 58 : 80)
const voidOpen = ref(false)
const alasan = ref('')
const konfirmasiVoid = ref(false)
const alasanCepat = ['Salah produk', 'Salah qty', 'Dobel scan', 'Salah harga', 'Lain-lain']
const aturanVoid = computed(() =>
  trx.value
    ? cekVoid(trx.value, { peran: sesi.peran, nama: sesi.aktif.nama })
    : { boleh: false, alasan: '', perluTinjauan: false },
)
watch(voidOpen, (v) => {
  if (!v) return
  alasan.value = ''
  konfirmasiVoid.value = false
})
const bayarOpen = ref(false)
const bayarTeks = ref('')
const bayarKanal = ref('tunai')
const waOpen = ref(false)

const totalQty = computed(() => (trx.value ? trx.value.items.reduce((s, i) => s + i.qty, 0) : 0))
const sisa = computed(() =>
  trx.value ? Math.max(0, trx.value.total - trx.value.dibayar) : 0,
)
const bisaBayar = computed(
  () => !!trx.value && trx.value.metode === 'bon' && trx.value.status === 'selesai' && sisa.value > 0,
)
const labelStatus = computed(() => {
  if (!trx.value) return ''
  if (trx.value.status === 'void') return 'Void'
  if (trx.value.metode === 'bon') return sisa.value > 0 ? `Bon · sisa ${rupiah(sisa.value)}` : 'Bon lunas'
  return 'Lunas'
})
const statusKelas = computed(() =>
  trx.value?.status === 'void' ? 'text-bad' : trx.value?.metode === 'bon' && sisa.value > 0 ? 'text-warn' : 'text-ok',
)
const labelBayar = computed(() => {
  if (!trx.value) return ''
  if (trx.value.status === 'void') return 'Batal (void)'
  return trx.value.status_bayar === 'sebagian'
    ? 'Dibayar sebagian'
    : trx.value.status_bayar === 'belum'
      ? 'Belum dibayar'
      : 'Lunas'
})
const lewat = computed(() => {
  if (!trx.value?.jatuh_tempo) return false
  return selisihHari(trx.value.jatuh_tempo, HARI_INI) < 0
})
const teksTempo = computed(() => {
  if (!trx.value?.jatuh_tempo) return ''
  const d = selisihHari(trx.value.jatuh_tempo, HARI_INI)
  if (d < 0) return `lewat ${Math.abs(d)} hari`
  if (d === 0) return 'jatuh tempo hari ini'
  return `${d} hari lagi`
})
const tautan = computed(() => (trx.value ? tautanPublik(trx.value.nomor) : ''))
const pesanWA = computed(() => (trx.value ? pesanInvoice(trx.value, toko.value, tautan.value) : ''))

const nominalBayar = computed(() => Number(String(bayarTeks.value).replace(/\D/g, '')) || 0)
const bisaBayarNominal = computed(() => nominalBayar.value > 0 && nominalBayar.value <= sisa.value)

watch(bayarOpen, (v) => {
  if (v) {
    bayarTeks.value = sisa.value.toLocaleString('id-ID')
    bayarKanal.value = 'tunai'
  }
})

function isiLunas() {
  bayarTeks.value = sisa.value.toLocaleString('id-ID')
}
function isiSetengah() {
  bayarTeks.value = Math.round(sisa.value / 2).toLocaleString('id-ID')
}

function segarkan() {
  const t = getPenjualan().find((x) => x.nomor === route.params.nomor)
  if (!t) return
  // Salinan baru supaya computed (sisa, status) ikut dihitung ulang; objek
  // di cache adapter bukan reaktif.
  trx.value = {
    ...t,
    items: t.items.map((i) => ({ ...i })),
    pembayaran: t.pembayaran.map((p) => ({ ...p })),
  }
}

function bayarBon() {
  if (!trx.value || !bisaBayarNominal.value) return
  const jumlah = nominalBayar.value
  const t = bayarPiutang(trx.value.nomor, jumlah, bayarKanal.value)
  if (!t) return ui.kabari('Pembayaran tidak dapat dicatat.', 'warn')
  segarkan()
  bayarOpen.value = false
  ui.kabari(
    `Pembayaran ${rupiah(jumlah)} dicatat. Sisa bon ${rupiah(sisa.value)}.`,
    sisa.value > 0 ? 'info' : 'ok',
  )
}

function cetak() {
  if (!trx.value) return
  cetakStore.siapkan({
    toko: toko.value,
    nomor: trx.value.nomor,
    tanggal: tanggalPendek(trx.value.tanggal),
    jam: trx.value.jam,
    kasir: trx.value.kasir,
    pelanggan: trx.value.pelanggan,
    noHp: trx.value.no_hp,
    metode: trx.value.metode,
    kanal: trx.value.kanal,
    dibayar: trx.value.dibayar,
    sisa: sisa.value,
    jatuhTempo: trx.value.jatuh_tempo ? tanggalPendek(trx.value.jatuh_tempo) : '',
    items: trx.value.items,
    total: trx.value.total,
    tunai: trx.value.tunai,
    kembalian: trx.value.kembalian,
    lebar: lebar.value,
    void: trx.value.status === 'void',
  })
  window.print()
}

function voidkan() {
  if (!trx.value) return
  if (aturanVoid.value.perluTinjauan && !konfirmasiVoid.value) {
    return ui.kabari('Centang konfirmasi untuk void di atas batas.', 'warn')
  }
  const hasil = batalkanPenjualan(trx.value.nomor, alasan.value, {
    peran: sesi.peran,
    nama: sesi.aktif.nama,
  })
  if (!hasil.ok) return ui.kabari(hasil.pesan, 'warn')
  segarkan()
  voidOpen.value = false
  alasan.value = ''
  ui.kabari(
    `${trx.value.nomor} dibatalkan${hasil.perluTinjauan ? ' dan ditandai perlu tinjauan' : ''}.`,
    'ok',
  )
}

function ekspor() {
  if (!trx.value) return
  const t = trx.value
  const baris = [
    ['Invoice', t.nomor],
    ['Tanggal', tanggalPendek(t.tanggal), t.jam],
    ['Kasir', t.kasir],
    ['Pelanggan', t.pelanggan || ''],
    ['No. HP', t.no_hp || ''],
    ['Metode', t.metode === 'bon' ? 'Bon' : t.kanal === 'qris' ? 'QRIS toko' : 'Tunai'],
    ['Kanal uang masuk', t.kanal === 'qris' ? 'QRIS toko' : 'Tunai'],
    ['Status bayar', labelBayar.value],
    [],
    ['Produk', 'Qty', 'Satuan', 'Harga', 'Subtotal'],
    ...t.items.map((i) => [i.nama, i.qty, i.satuan, i.harga, i.subtotal]),
    [],
    ['Total', t.total],
    ['Dibayar', t.dibayar],
    ['Sisa', sisa.value],
  ]
  unduhCSV(`invoice-${t.nomor}.csv`, baris)
  ui.kabari('Rincian invoice diekspor ke CSV.', 'ok')
}

async function salinTautan() {
  if (!tautan.value) return
  try {
    await navigator.clipboard.writeText(tautan.value)
    ui.kabari('Tautan invoice publik disalin.', 'ok')
  } catch {
    ui.kabari('Browser menolak akses clipboard. Salin manual dari teks tautan.', 'warn')
  }
}
</script>
