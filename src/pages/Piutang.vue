<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="text-lg font-semibold text-ink">Piutang &amp; bon</h2>
          <AddonTag />
        </div>
        <p class="mt-0.5 max-w-2xl text-xs text-ink-soft">
          Bon pelanggan yang belum lunas. Catat pembayaran sebagian atau pelunasan penuh.
        </p>
      </div>
      <RouterLink to="/kasir?bon=1" class="btn btn-primary" data-tour="piutang-aksi">
        <ShoppingCart :size="15" :stroke-width="1.6" />
        Buat bon baru
      </RouterLink>
    </div>

    <div class="panel grid grid-cols-2 overflow-hidden lg:grid-cols-4" data-tour="piutang-kpi">
      <div class="border-b border-r border-line p-4 lg:border-b-0">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Total piutang</div>
        <div class="mt-1.5 whitespace-nowrap text-lg font-semibold tnum sm:text-2xl">
          {{ rupiah(ringkas.total) }}
        </div>
        <div class="mt-0.5 text-xs text-ink-soft">sisa dari bon berjalan</div>
      </div>
      <div class="border-b border-line p-4 lg:border-b-0 lg:border-r">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Bon berjalan</div>
        <div class="mt-1.5 text-lg font-semibold tnum sm:text-2xl">{{ ringkas.jumlah }}</div>
        <div class="mt-0.5 text-xs text-ink-soft">belum lunas</div>
      </div>
      <div class="border-b border-r border-line p-4 lg:border-b-0">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Lewat tempo</div>
        <div class="mt-1.5 text-lg font-semibold tnum sm:text-2xl" :class="ringkas.lewat ? 'text-bad' : ''">
          {{ ringkas.lewat }}
        </div>
        <div class="mt-0.5 text-xs text-ink-soft">perlu ditagih</div>
      </div>
      <div class="border-b border-line p-4 lg:border-b-0">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Sudah lunas</div>
        <div class="mt-1.5 text-lg font-semibold tnum sm:text-2xl text-ok">{{ ringkas.lunas }}</div>
        <div class="mt-0.5 text-xs text-ink-soft">bon selesai</div>
      </div>
    </div>

    <section class="panel">
      <div class="flex flex-wrap items-center gap-2 border-b border-line p-3" data-tour="piutang-cari">
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
          <input v-model="cari" class="input h-9 pl-8" placeholder="Pelanggan, nomor, no. HP…" />
        </div>
      </div>

      <div class="hidden overflow-x-auto md:block" data-tour="piutang-tabel">
        <table class="tbl">
          <thead>
            <tr>
              <th>Nomor</th>
              <th>Pelanggan</th>
              <th class="hidden w-28 lg:table-cell">Jatuh tempo</th>
              <th class="num w-28">Total</th>
              <th class="num w-28">Dibayar</th>
              <th class="num w-28">Sisa</th>
              <th class="w-28">Status</th>
              <th class="w-40"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in tampil" :key="t.nomor">
              <td class="whitespace-nowrap font-mono text-xs">{{ t.nomor }}</td>
              <td>
                <div class="truncate font-medium">{{ t.pelanggan || 'Tanpa nama' }}</div>
                <div class="text-2xs text-ink-soft">{{ t.no_hp || 'tanpa no. HP' }}</div>
              </td>
              <td class="hidden text-ink-soft tnum lg:table-cell">
                {{ t.jatuh_tempo ? tanggalPendek(t.jatuh_tempo) : '—' }}
              </td>
              <td class="num text-ink-soft">{{ rupiah(t.total) }}</td>
              <td class="num text-ink-soft">{{ rupiah(t.dibayar) }}</td>
              <td class="num font-medium" :class="t.sisa > 0 ? 'text-warn' : 'text-ok'">
                {{ rupiah(t.sisa) }}
              </td>
              <td>
                <span class="status" :class="statusKelas(t)">{{ statusTeks(t) }}</span>
              </td>
              <td class="text-right">
                <div class="flex justify-end gap-1.5">
                  <RouterLink :to="`/invoice/${t.nomor}`" class="btn btn-sm">Detail</RouterLink>
                  <button
                    v-if="t.sisa > 0"
                    type="button"
                    class="btn btn-sm btn-primary"
                    @click="bukaBayar(t)"
                  >
                    Bayar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="divide-y divide-line md:hidden">
        <div v-for="t in tampil" :key="t.nomor" class="px-3 py-3">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <div class="truncate text-sm font-medium">{{ t.pelanggan || 'Tanpa nama' }}</div>
              <div class="font-mono text-2xs text-ink-soft">{{ t.nomor }}</div>
            </div>
            <span class="status shrink-0" :class="statusKelas(t)">{{ statusTeks(t) }}</span>
          </div>
          <div class="mt-2 grid grid-cols-3 gap-2 text-xs">
            <div>
              <div class="text-2xs text-ink-soft">Total</div>
              <div class="tnum">{{ rupiah(t.total) }}</div>
            </div>
            <div>
              <div class="text-2xs text-ink-soft">Dibayar</div>
              <div class="tnum">{{ rupiah(t.dibayar) }}</div>
            </div>
            <div>
              <div class="text-2xs text-ink-soft">Sisa</div>
              <div class="tnum font-medium" :class="t.sisa > 0 ? 'text-warn' : 'text-ok'">
                {{ rupiah(t.sisa) }}
              </div>
            </div>
          </div>
          <div class="mt-2 flex items-center justify-between gap-2">
            <span class="text-2xs text-ink-soft">
              Tempo {{ t.jatuh_tempo ? tanggalPendek(t.jatuh_tempo) : '—' }}
            </span>
            <div class="flex gap-1.5">
              <RouterLink :to="`/invoice/${t.nomor}`" class="btn btn-sm">Detail</RouterLink>
              <button
                v-if="t.sisa > 0"
                type="button"
                class="btn btn-sm btn-primary"
                @click="bukaBayar(t)"
              >
                Bayar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!tampil.length" class="px-4 py-10 text-center">
        <p class="text-sm font-medium text-ink">Tidak ada bon pada filter ini</p>
        <p class="mt-1 text-xs text-ink-soft">Buat bon dari Kasir dengan memilih metode Bon.</p>
      </div>
    </section>

    <p class="text-xs text-ink-soft">
      Pelunasan bisa tunai atau QRIS statis toko, dan langsung memperbarui sisa bon di seluruh
      halaman.
    </p>

    <Modal
      :open="!!pilihan"
      title="Bayar bon"
      :subtitle="pilihan ? `${pilihan.nomor} · ${pilihan.pelanggan || 'Tanpa nama'}` : ''"
      lebar="max-w-md"
      @close="tutupBayar"
    >
      <div v-if="pilihan" class="space-y-3 px-4 py-4">
        <div class="grid grid-cols-3 gap-2 rounded border border-line bg-surface p-3 text-center">
          <div>
            <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Total</div>
            <div class="mt-1 text-sm font-semibold tnum">{{ rupiah(pilihan.total) }}</div>
          </div>
          <div>
            <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Dibayar</div>
            <div class="mt-1 text-sm font-semibold tnum">{{ rupiah(pilihan.dibayar) }}</div>
          </div>
          <div>
            <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Sisa</div>
            <div class="mt-1 text-sm font-semibold tnum text-warn">{{ rupiah(pilihan.sisa) }}</div>
          </div>
        </div>

        <div>
          <label class="label" for="piutang-nominal">Jumlah dibayar</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-soft">Rp</span>
            <input
              id="piutang-nominal"
              v-model="bayarTeks"
              type="text"
              inputmode="numeric"
              class="input pl-9 text-base tnum"
            />
          </div>
          <div class="mt-2 flex gap-1.5">
            <button type="button" class="btn btn-sm" @click="isiLunas">Lunasi sisa</button>
            <button type="button" class="btn btn-sm" @click="isiSetengah">Setengah</button>
          </div>
        </div>

        <p v-if="nominal > pilihan.sisa" class="text-xs text-warn">
          Melebihi sisa. Maksimal {{ rupiah(pilihan.sisa) }}.
        </p>
        <p v-else class="text-xs text-ink-soft">
          Pembayaran dicatat sebagai riwayat dan tidak mengubah total transaksi.
        </p>

        <div>
          <span class="label">Uang masuk lewat</span>
          <div class="flex rounded border border-line p-0.5">
            <button
              type="button"
              class="inline-flex flex-1 items-center justify-center gap-1.5 rounded px-2 py-1 text-xs transition-colors"
              :class="kanal === 'tunai' ? 'bg-ink text-white' : 'text-ink-soft hover:bg-surface'"
              @click="kanal = 'tunai'"
            >
              <Banknote :size="13" :stroke-width="1.8" />
              Tunai
            </button>
            <button
              type="button"
              class="inline-flex flex-1 items-center justify-center gap-1.5 rounded px-2 py-1 text-xs transition-colors"
              :class="kanal === 'qris' ? 'bg-ink text-white' : 'text-ink-soft hover:bg-surface'"
              @click="kanal = 'qris'"
            >
              <QrCode :size="13" :stroke-width="1.8" />
              QRIS toko
            </button>
          </div>
          <p v-if="kanal === 'qris'" class="mt-1.5 text-2xs leading-relaxed text-ink-soft">
            QRIS statis toko. Cek notifikasi speaker sebelum menyimpan.
          </p>
        </div>
      </div>

      <template #footer>
        <span class="text-2xs text-ink-soft">
          Pembayaran {{ kanal === 'qris' ? 'QRIS toko' : 'tunai' }}.
        </span>
        <div class="flex gap-2">
          <button type="button" class="btn" @click="tutupBayar">Batal</button>
          <button type="button" class="btn btn-primary" :disabled="!bisaBayar" @click="bayar">
            Simpan pembayaran
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Search, ShoppingCart, Banknote, QrCode } from 'lucide-vue-next'
import Modal from '../components/Modal.vue'
import AddonTag from '../components/AddonTag.vue'
import { bayarPiutang, getPiutang } from '../data/adapter'
import { rupiah, tanggalPendek } from '../lib/format'
import { useUi } from '../stores/ui'

const ui = useUi()
const semua = ref(getPiutang())
const tab = ref('aktif')
const cari = ref('')
const pilihan = ref(null)
const bayarTeks = ref('')
const kanal = ref('tunai')

const ringkas = computed(() => {
  const belum = semua.value.filter((t) => t.sisa > 0)
  return {
    total: belum.reduce((s, t) => s + t.sisa, 0),
    jumlah: belum.length,
    lewat: belum.filter((t) => t.lewat !== null && t.lewat < 0).length,
    lunas: semua.value.length - belum.length,
  }
})

const jumlah = (id) => {
  if (id === 'semua') return semua.value.length
  if (id === 'aktif') return semua.value.filter((t) => t.sisa > 0).length
  if (id === 'lewat') return semua.value.filter((t) => t.sisa > 0 && t.lewat !== null && t.lewat < 0).length
  if (id === 'lunas') return semua.value.filter((t) => t.sisa <= 0).length
  return 0
}

const tabs = computed(() => [
  { id: 'aktif', label: 'Berjalan', jumlah: jumlah('aktif') },
  { id: 'lewat', label: 'Lewat tempo', jumlah: jumlah('lewat') },
  { id: 'lunas', label: 'Lunas', jumlah: jumlah('lunas') },
  { id: 'semua', label: 'Semua', jumlah: jumlah('semua') },
])

const hasil = computed(() => {
  const q = cari.value.trim().toLowerCase()
  return semua.value.filter((t) => {
    const cocokTab =
      tab.value === 'semua' ||
      (tab.value === 'aktif' && t.sisa > 0) ||
      (tab.value === 'lewat' && t.sisa > 0 && t.lewat !== null && t.lewat < 0) ||
      (tab.value === 'lunas' && t.sisa <= 0)
    const cocokCari =
      !q ||
      t.nomor.toLowerCase().includes(q) ||
      (t.pelanggan || '').toLowerCase().includes(q) ||
      (t.no_hp || '').toLowerCase().includes(q)
    return cocokTab && cocokCari
  })
})

const tampil = computed(() => hasil.value)

const statusTeks = (t) => {
  if (t.sisa <= 0) return 'Lunas'
  if (t.lewat === null) return 'Tanpa tempo'
  if (t.lewat < 0) return `Lewat ${Math.abs(t.lewat)} hari`
  if (t.lewat === 0) return 'Jatuh tempo hari ini'
  return `${t.lewat} hari lagi`
}
const statusKelas = (t) =>
  t.sisa <= 0 ? 'text-ok' : t.lewat !== null && t.lewat <= 0 ? 'text-bad' : 'text-warn'

function bukaBayar(t) {
  pilihan.value = t
  bayarTeks.value = t.sisa.toLocaleString('id-ID')
  kanal.value = 'tunai'
}
function tutupBayar() {
  pilihan.value = null
  bayarTeks.value = ''
}
function isiLunas() {
  if (pilihan.value) bayarTeks.value = pilihan.value.sisa.toLocaleString('id-ID')
}
function isiSetengah() {
  if (pilihan.value) bayarTeks.value = Math.round(pilihan.value.sisa / 2).toLocaleString('id-ID')
}

const nominal = computed(() => Number(String(bayarTeks.value).replace(/\D/g, '')) || 0)
const bisaBayar = computed(() => !!pilihan.value && nominal.value > 0 && nominal.value <= pilihan.value.sisa)

function bayar() {
  if (!pilihan.value || !bisaBayar.value) return
  const nomor = pilihan.value.nomor
  const jumlahBayar = nominal.value
  const t = bayarPiutang(nomor, jumlahBayar, kanal.value)
  if (!t) return ui.kabari('Pembayaran tidak dapat dicatat.', 'warn')
  semua.value = getPiutang()
  tutupBayar()
  const sisa = Math.max(0, t.total - t.dibayar)
  ui.kabari(
    `Pembayaran ${rupiah(jumlahBayar)} dicatat. Sisa ${rupiah(sisa)}.`,
    sisa > 0 ? 'info' : 'ok',
  )
}
</script>
