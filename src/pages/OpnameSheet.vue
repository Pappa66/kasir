<template>
  <div v-if="!sesi" class="panel">
    <EmptyState
      :icon="ClipboardX"
      title="Sesi opname tidak ditemukan"
      desc="Sesi mungkin sudah dihapus atau tautannya salah."
    >
      <template #action>
        <RouterLink to="/opname" class="btn btn-primary">
          <ArrowLeft :size="15" :stroke-width="1.6" />
          Kembali ke daftar
        </RouterLink>
      </template>
    </EmptyState>
  </div>

  <div v-else class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex min-w-0 items-center gap-3">
        <RouterLink to="/opname" class="btn btn-sm shrink-0" title="Kembali ke daftar sesi">
          <ArrowLeft :size="15" :stroke-width="1.6" />
        </RouterLink>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 class="font-mono text-sm font-semibold text-ink">{{ sesi.nomor }}</h2>
            <span class="status shrink-0" :class="terbuka ? 'text-accent-2' : 'text-ok'">
              {{ terbuka ? 'Berjalan' : 'Selesai' }}
            </span>
          </div>
          <p class="truncate text-xs text-ink-soft">
            {{ tanggalPendek(sesi.tanggal) }} · petugas {{ sesi.petugas }} · {{ sesi.catatan }}
          </p>
        </div>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <span class="text-xs text-ink-soft">
          <span class="font-medium text-ink">{{ sesi.dihitung }}</span>/{{ sesi.total_item }} dihitung
        </span>
        <span class="h-4 w-px bg-line" aria-hidden="true" />
        <span class="text-xs" :class="sesi.selisih ? 'font-medium text-warn' : 'text-ink-soft'">
          {{ sesi.selisih }} selisih
        </span>
      </div>
    </div>

    <div v-if="!terbuka" class="panel flex items-start gap-2 border-l-2 border-l-ok p-3">
      <CheckCircle2 :size="16" :stroke-width="1.6" class="mt-0.5 shrink-0 text-ok" />
      <div class="text-xs">
        <p class="font-medium text-ink">Opname sudah diposting</p>
        <p class="mt-0.5 text-ink-soft">
          Stok sistem sudah disesuaikan dengan hasil hitung. Data di bawah hanya untuk dilihat.
        </p>
      </div>
    </div>

    <section class="panel">
      <div class="panel-h">
        <span class="panel-title">Lembar hitung fisik</span>
        <span class="hidden text-xs text-ink-soft sm:inline">
          Selisih = hitung fisik − stok sistem
        </span>
      </div>

      <div class="hidden overflow-x-auto md:block">
        <table class="tbl">
          <thead>
            <tr>
              <th>Produk</th>
              <th class="num w-28">Stok sistem</th>
              <th class="w-32">Hitung fisik</th>
              <th class="num w-24">Selisih</th>
              <th class="w-64">Alasan selisih</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in sesi.items" :key="i.produk_id" :class="selisih(i) ? 'bg-[#fdf9f3]' : ''">
              <td>
                <div class="font-medium">{{ i.nama }}</div>
                <div class="text-2xs text-ink-soft">{{ i.satuan }}</div>
              </td>
              <td class="num text-ink-soft">
                {{ qty(i.stok_sistem) }}
                <span class="text-2xs"> {{ i.satuan }}</span>
              </td>
              <td>
                <input
                  :value="i.hitung === null ? '' : i.hitung"
                  type="number"
                  min="0"
                  :step="i.satuan === 'kg' ? 0.25 : 1"
                  :disabled="!terbuka"
                  class="input h-8 w-24 text-center tnum"
                  placeholder="—"
                  @change="store.setHitung(sesi.id, i.produk_id, $event.target.value)"
                />
              </td>
              <td
                class="num"
                :class="selisih(i) && selisih(i) !== 0 ? 'font-medium text-warn' : 'text-ink-soft'"
              >
                <template v-if="i.hitung === null">—</template>
                <template v-else-if="selisih(i) === 0">0</template>
                <template v-else>{{ selisih(i) > 0 ? '+' : '' }}{{ qty(selisih(i)) }}</template>
              </td>
              <td>
                <input
                  v-if="i.hitung !== null && selisih(i) !== 0"
                  :value="i.alasan"
                  :disabled="!terbuka"
                  class="input h-8"
                  :class="!i.alasan.trim() && terbuka ? 'border-warn' : ''"
                  placeholder="Wajib diisi"
                  @input="store.setAlasan(sesi.id, i.produk_id, $event.target.value)"
                />
                <span v-else class="text-2xs text-ink-soft">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="divide-y divide-line md:hidden">
        <div
          v-for="i in sesi.items"
          :key="i.produk_id"
          class="px-3 py-3"
          :class="selisih(i) ? 'bg-[#fdf9f3]' : ''"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="text-sm font-medium text-ink">{{ i.nama }}</div>
              <div class="mt-0.5 text-2xs text-ink-soft">
                Stok sistem {{ qty(i.stok_sistem) }} {{ i.satuan }}
              </div>
            </div>
            <div class="w-24 shrink-0">
              <label class="sr-only" :for="`hitung-${i.produk_id}`">Hitung fisik</label>
              <input
                :id="`hitung-${i.produk_id}`"
                :value="i.hitung === null ? '' : i.hitung"
                type="number"
                min="0"
                :step="i.satuan === 'kg' ? 0.25 : 1"
                :disabled="!terbuka"
                class="input h-9 w-full text-center tnum"
                placeholder="—"
                @change="store.setHitung(sesi.id, i.produk_id, $event.target.value)"
              />
            </div>
          </div>

          <div v-if="i.hitung !== null && selisih(i) !== 0" class="mt-2 flex items-center gap-2">
            <span class="shrink-0 text-2xs font-medium text-warn">
              {{ selisih(i) > 0 ? '+' : '' }}{{ qty(selisih(i)) }} {{ i.satuan }}
            </span>
            <input
              :value="i.alasan"
              :disabled="!terbuka"
              class="input h-8 min-w-0 flex-1 text-xs"
              :class="!i.alasan.trim() && terbuka ? 'border-warn' : ''"
              placeholder="Alasan selisih (wajib)"
              @input="store.setAlasan(sesi.id, i.produk_id, $event.target.value)"
            />
          </div>
        </div>
      </div>

      <div
        class="sticky bottom-8 z-10 flex flex-wrap items-center justify-between gap-2 border-t border-line bg-paper px-4 py-3"
      >
        <div class="text-xs text-ink-soft">
          <span v-if="terbuka">
            {{ sisaBelumHitung }} produk belum dihitung
            <span v-if="kurangAlasan" class="text-warn">
              · {{ kurangAlasan }} selisih belum diberi alasan
            </span>
            <span v-else class="text-ok"> · semua alasan selisih terisi</span>
          </span>
          <span v-else>Ditutup dan diposting oleh pemilik.</span>
        </div>
        <div v-if="terbuka" class="flex flex-wrap gap-2">
          <button type="button" class="btn" @click="isiSisa">Tandai sisa sesuai sistem</button>
          <button type="button" class="btn" @click="simpanDraft">Simpan draft</button>
          <button type="button" class="btn btn-primary" :disabled="!bisaPosting" @click="postingOpen = true">
            <Check :size="15" :stroke-width="1.8" />
            Posting
          </button>
        </div>
        <RouterLink v-else to="/opname" class="btn">Kembali ke daftar</RouterLink>
      </div>
    </section>

    <p class="text-xs text-ink-soft">
      Posting hanya bisa dilakukan pemilik. Selisih tanpa alasan akan ditolak.
    </p>

    <Modal :open="postingOpen" title="Posting opname" :subtitle="sesi.nomor" @close="postingOpen = false">
      <div class="space-y-3 px-4 py-4">
        <p class="text-sm text-ink">
          Stok sistem akan disesuaikan untuk
          <span class="font-medium">{{ sesi.dihitung }} produk</span> yang sudah dihitung.
        </p>
        <p v-if="sisaBelumHitung" class="rounded border border-[#e3c9a8] bg-[#fdf6ec] p-3 text-xs text-warn">
          {{ sisaBelumHitung }} produk belum dihitung dan akan dianggap sesuai stok sistem.
        </p>
        <div>
          <label class="label" for="pin">PIN pemilik</label>
          <input
            id="pin"
            v-model="pin"
            type="password"
            inputmode="numeric"
            maxlength="4"
            class="input w-32 text-center tracking-[0.4em] tnum"
            placeholder="••••"
          />
          <p class="mt-1.5 text-2xs text-ink-soft">PIN demo: 1234</p>
        </div>
      </div>

      <template #footer>
        <span class="text-2xs text-ink-soft">Tindakan ini tercatat di riwayat.</span>
        <div class="flex gap-2">
          <button type="button" class="btn" @click="postingOpen = false">Batal</button>
          <button type="button" class="btn btn-primary" :disabled="!bisaPosting" @click="posting">
            Posting sekarang
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Check, CheckCircle2, ClipboardX } from 'lucide-vue-next'
import EmptyState from '../components/EmptyState.vue'
import Modal from '../components/Modal.vue'
import { qty, tanggalPendek } from '../lib/format'
import { useOpname } from '../stores/opname'
import { useUi } from '../stores/ui'

const route = useRoute()
const router = useRouter()
const store = useOpname()
const ui = useUi()

const sesi = computed(() => store.cari(route.params.id))
const terbuka = computed(() => sesi.value?.status === 'berjalan')
const pin = ref('')
const postingOpen = ref(false)

const selisih = (i) => (i.hitung === null ? null : Number((i.hitung - i.stok_sistem).toFixed(3)))

const sisaBelumHitung = computed(() => (sesi.value ? sesi.value.total_item - sesi.value.dihitung : 0))
const kurangAlasan = computed(() => (sesi.value ? store.sisaAlasan(sesi.value) : 0))
const bisaPosting = computed(() => terbuka.value && sesi.value.dihitung > 0 && kurangAlasan.value === 0)

function isiSisa() {
  store.isiSisa(sesi.value.id)
  ui.kabari('Sisa produk ditandai sesuai stok sistem.', 'ok')
}

function simpanDraft() {
  ui.kabari('Draft opname disimpan di sesi ini.', 'ok')
}

function posting() {
  if (pin.value !== '1234') return ui.kabari('PIN pemilik salah. Gunakan 1234 untuk demo.', 'warn')
  const nomor = sesi.value.nomor
  store.posting(sesi.value.id)
  postingOpen.value = false
  pin.value = ''
  ui.kabari(`${nomor} diposting. Stok sistem sudah disesuaikan.`, 'ok')
  router.push('/opname')
}
</script>
