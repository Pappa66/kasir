<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-ink">Pengaturan toko</h2>
        <p class="mt-0.5 text-xs text-ink-soft">
          Identitas, struk, dan pengguna. Perubahan berlaku selama sesi demo.
        </p>
      </div>
      <button type="button" class="btn btn-primary" @click="simpan">
        <Check :size="15" :stroke-width="1.8" />
        Simpan pengaturan
      </button>
    </div>

    <div class="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div class="min-w-0 space-y-4">
        <section class="panel">
          <div class="panel-h">
            <span class="panel-title">Identitas toko</span>
            <span class="text-xs text-ink-soft">tercetak di struk</span>
          </div>
          <div class="grid gap-3 p-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label class="label" for="t-nama">Nama toko</label>
              <input id="t-nama" v-model="form.nama_toko" class="input" />
            </div>
            <div class="sm:col-span-2">
              <label class="label" for="t-alamat">Alamat</label>
              <input id="t-alamat" v-model="form.alamat" class="input" />
            </div>
            <div>
              <label class="label" for="t-telepon">Telepon / WhatsApp</label>
              <input id="t-telepon" v-model="form.telepon" class="input tnum" />
            </div>
            <div>
              <label class="label" for="t-pajak">Pajak (%)</label>
              <input id="t-pajak" v-model="form.pajak_persen" type="number" min="0" max="100" class="input tnum" />
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-h">
            <span class="panel-title">Struk &amp; printer</span>
            <span class="text-xs text-ink-soft">thermal 58 / 80 mm</span>
          </div>
          <div class="space-y-4 p-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div class="text-sm font-medium text-ink">Lebar kertas struk</div>
                <p class="mt-0.5 text-xs text-ink-soft">
                  Pilih sesuai printer yang dipakai. Bisa diganti kapan saja.
                </p>
              </div>
              <div class="flex rounded border border-line p-0.5">
                <button
                  v-for="w in [58, 80]"
                  :key="w"
                  type="button"
                  class="rounded px-3 py-1 text-xs transition-colors"
                  :class="Number(form.lebar_struk) === w ? 'bg-accent text-white' : 'text-ink-soft hover:bg-surface'"
                  @click="form.lebar_struk = w"
                >
                  {{ w }} mm
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between gap-3 border-t border-line pt-3">
              <div>
                <div class="text-sm font-medium text-ink">Tes cetak</div>
                <p class="mt-0.5 text-xs text-ink-soft">
                  Cetak struk contoh untuk memastikan printer dan ukuran kertas benar.
                </p>
              </div>
              <button type="button" class="btn" @click="tesOpen = true">
                <Printer :size="15" :stroke-width="1.6" />
                Tes cetak
              </button>
            </div>

            <div class="border-t border-line pt-3 text-xs text-ink-soft">
              Printer 80 mm USB umumnya langsung terdeteksi setelah driver terpasang. Aktifkan
              <span class="font-mono text-[11px] text-ink">--kiosk-printing</span>
              di Chrome untuk cetak tanpa dialog.
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-h">
            <span class="panel-title">Pengguna</span>
            <span class="text-xs text-ink-soft">{{ form.pengguna.length }} akun</span>
          </div>
          <div class="overflow-x-auto">
            <table class="tbl">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th class="w-28">Peran</th>
                  <th class="w-24">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in form.pengguna" :key="u.nama">
                  <td class="font-medium">{{ u.nama }}</td>
                  <td class="text-ink-soft">{{ u.role }}</td>
                  <td>
                    <span class="status" :class="u.aktif ? 'text-ok' : 'text-ink-soft'">
                      {{ u.aktif ? 'Aktif' : 'Nonaktif' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="border-t border-line px-4 py-2.5 text-xs text-ink-soft">
            Tambah pengguna dan atur PIN pemilik tersedia di aplikasi asli.
          </div>
        </section>
      </div>

      <aside class="min-w-0 space-y-4">
        <section class="panel p-4">
          <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Tentang demo</div>
          <p class="mt-2 text-xs leading-relaxed text-ink-soft">
            Prototipe statis. Tidak ada server, tidak ada penyimpanan permanen. Semua perubahan
            hilang saat tab ditutup.
          </p>

          <dl class="mt-3 space-y-2 border-t border-line pt-3 text-sm">
            <div class="flex justify-between">
              <dt class="text-ink-soft">Produk</dt>
              <dd class="tnum">25</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-ink-soft">Transaksi contoh</dt>
              <dd class="tnum">68</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-ink-soft">Tanggal demo</dt>
              <dd class="tnum">{{ tanggalPendek(HARI_INI) }}</dd>
            </div>
          </dl>

          <button type="button" class="btn mt-3 w-full" @click="reset">
            <RotateCcw :size="15" :stroke-width="1.6" />
            Muat ulang data contoh
          </button>
        </section>

        <section class="panel p-4">
          <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Soal penyimpanan</div>
          <p class="mt-2 text-xs leading-relaxed text-ink-soft">
            Di aplikasi asli, pengaturan disimpan di database dan langsung dipakai semua perangkat.
          </p>
        </section>
      </aside>
    </div>

    <Modal
      :open="tesOpen"
      title="Tes cetak struk"
      :subtitle="`${form.lebar_struk} mm · ${form.nama_toko}`"
      lebar="max-w-md"
      @close="tesOpen = false"
    >
      <div class="flex justify-center overflow-x-auto bg-surface px-4 py-5">
        <StrukPreview
          :toko="form"
          nomor="TES-0001"
          :tanggal="tanggalPendek(HARI_INI)"
          jam="09:41"
          :kasir="toko.data.kasir_aktif"
          :items="contoh"
          :total="contohTotal"
          :tunai="150000"
          :kembalian="150000 - contohTotal"
          :lebar="Number(form.lebar_struk)"
          class="border border-line px-3 py-3"
        />
      </div>

      <template #footer>
        <span class="text-2xs text-ink-soft">Tidak tersimpan sebagai transaksi.</span>
        <div class="flex gap-2">
          <button type="button" class="btn" @click="tesOpen = false">Tutup</button>
          <button type="button" class="btn btn-primary" @click="cetakTes">
            <Printer :size="15" :stroke-width="1.6" />
            Cetak
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Check, Printer, RotateCcw } from 'lucide-vue-next'
import Modal from '../components/Modal.vue'
import StrukPreview from '../components/StrukPreview.vue'
import { HARI_INI } from '../data/adapter'
import { tanggalPendek } from '../lib/format'
import { useToko } from '../stores/toko'
import { useCetak } from '../stores/cetak'
import { useUi } from '../stores/ui'

const ui = useUi()
const toko = useToko()
const cetakStore = useCetak()
const form = ref({ ...toko.data })
const tesOpen = ref(false)

const contoh = [
  { nama: 'Beras Pandan Wangi 5kg', qty: 1, satuan: 'karung', harga: 68000 },
  { nama: 'Gula Curah', qty: 2, satuan: 'kg', harga: 15000 },
  { nama: 'Indomie Goreng', qty: 3, satuan: 'pcs', harga: 3500 },
]
const contohTotal = computed(() => contoh.reduce((s, i) => s + i.qty * i.harga, 0))

function simpan() {
  if (!String(form.value.nama_toko).trim()) return ui.kabari('Nama toko wajib diisi.', 'warn')
  if (!String(form.value.alamat).trim()) return ui.kabari('Alamat toko wajib diisi.', 'warn')

  toko.simpan({
    nama_toko: String(form.value.nama_toko).trim(),
    alamat: String(form.value.alamat).trim(),
    telepon: String(form.value.telepon).trim(),
    pajak_persen: Number(form.value.pajak_persen) || 0,
    lebar_struk: Number(form.value.lebar_struk) === 58 ? 58 : 80,
  })
  ui.kabari('Pengaturan disimpan untuk sesi demo ini.', 'ok')
}

function cetakTes() {
  cetakStore.siapkan({
    toko: form.value,
    nomor: 'TES-0001',
    tanggal: tanggalPendek(HARI_INI),
    jam: '09:41',
    kasir: toko.data.kasir_aktif,
    items: contoh,
    total: contohTotal.value,
    tunai: 150000,
    kembalian: 150000 - contohTotal.value,
    lebar: Number(form.value.lebar_struk),
  })
  window.print()
}

function reset() {
  ui.kabari('Memuat ulang data contoh…', 'info')
  setTimeout(() => window.location.reload(), 600)
}
</script>
