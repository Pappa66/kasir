<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-ink">Sesi opname</h2>
        <p class="mt-0.5 text-xs text-ink-soft">
          Hitung fisik, catat selisih, lalu posting oleh pemilik.
        </p>
      </div>
      <button type="button" class="btn btn-primary" @click="mulaiBaru">
        <Plus :size="15" :stroke-width="1.8" />
        Sesi baru
      </button>
    </div>

    <div class="panel grid grid-cols-1 overflow-hidden sm:grid-cols-3">
      <div class="border-b border-line p-4 sm:border-b-0 sm:border-r">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Sedang berjalan</div>
        <div class="mt-1.5 text-xl font-semibold tnum sm:text-2xl">{{ berjalan.length }}</div>
        <div class="mt-0.5 text-xs text-ink-soft">sesi belum diposting</div>
      </div>
      <div class="border-b border-line p-4 sm:border-b-0 sm:border-r">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Produk dihitung</div>
        <div class="mt-1.5 text-xl font-semibold tnum sm:text-2xl">
          {{ berjalan.length ? berjalan[0].dihitung : 0 }}/{{ totalProduk }}
        </div>
        <div class="mt-0.5 text-xs text-ink-soft">pada sesi aktif</div>
      </div>
      <div class="p-4">
        <div class="text-2xs uppercase tracking-[0.04em] text-ink-soft">Selisih ditemukan</div>
        <div class="mt-1.5 text-xl font-semibold tnum sm:text-2xl">
          {{ berjalan.length ? berjalan[0].selisih : 0 }}
        </div>
        <div class="mt-0.5 text-xs text-ink-soft">perlu alasan sebelum posting</div>
      </div>
    </div>

    <section class="panel">
      <div class="panel-h">
        <span class="panel-title">Daftar sesi</span>
        <span class="text-xs text-ink-soft">terbaru di atas</span>
      </div>

      <div class="hidden overflow-x-auto md:block">
        <table class="tbl">
          <thead>
            <tr>
              <th>Nomor</th>
              <th class="hidden w-24 sm:table-cell">Tanggal</th>
              <th class="hidden w-24 md:table-cell">Petugas</th>
              <th class="w-40">Progres</th>
              <th class="num w-20">Selisih</th>
              <th class="w-24">Status</th>
              <th class="w-28"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in daftar" :key="s.id" class="cursor-pointer" @click="buka(s)">
              <td>
                <div class="whitespace-nowrap font-mono text-xs text-ink">{{ s.nomor }}</div>
                <div class="text-2xs text-ink-soft sm:hidden">{{ tanggalPendek(s.tanggal) }}</div>
              </td>
              <td class="hidden text-ink-soft sm:table-cell">{{ tanggalPendek(s.tanggal) }}</td>
              <td class="hidden text-ink-soft md:table-cell">{{ s.petugas }}</td>
              <td>
                <div class="flex items-center gap-2">
                  <div class="h-1.5 w-20 overflow-hidden rounded-full bg-[#e8edeb]">
                    <div
                      class="h-full bg-accent-2"
                      :style="{ width: (s.dihitung / s.total_item) * 100 + '%' }"
                    />
                  </div>
                  <span class="text-2xs tabular-nums text-ink-soft">
                    {{ s.dihitung }}/{{ s.total_item }}
                  </span>
                </div>
              </td>
              <td class="num" :class="s.selisih ? 'font-medium text-warn' : 'text-ink-soft'">
                {{ s.selisih }}
              </td>
              <td>
                <span
                  class="status"
                  :class="s.status === 'berjalan' ? 'text-accent-2' : 'text-ok'"
                >
                  {{ s.status === 'berjalan' ? 'Berjalan' : 'Selesai' }}
                </span>
              </td>
              <td class="text-right">
                <button type="button" class="btn btn-sm" @click.stop="buka(s)">
                  {{ s.status === 'berjalan' ? 'Lanjutkan' : 'Lihat' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="divide-y divide-line md:hidden">
        <button
          v-for="s in daftar"
          :key="s.id"
          type="button"
          class="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-surface"
          @click="buka(s)"
        >
          <div class="min-w-0 flex-1">
            <div class="font-mono text-xs text-ink">{{ s.nomor }}</div>
            <div class="mt-0.5 truncate text-2xs text-ink-soft">
              {{ tanggalPendek(s.tanggal) }} · {{ s.petugas }} · {{ s.dihitung }}/{{ s.total_item }}
              dihitung
            </div>
          </div>
          <div class="shrink-0 text-right">
            <span
              class="status"
              :class="s.status === 'berjalan' ? 'text-accent-2' : 'text-ok'"
            >
              {{ s.status === 'berjalan' ? 'Berjalan' : 'Selesai' }}
            </span>
            <div class="mt-0.5 text-2xs" :class="s.selisih ? 'font-medium text-warn' : 'text-ink-soft'">
              {{ s.selisih }} selisih
            </div>
          </div>
          <ChevronRight :size="16" :stroke-width="1.6" class="shrink-0 text-[#9aa8a5]" />
        </button>
      </div>
    </section>

    <p class="text-xs text-ink-soft">
      Posting opname menyesuaikan stok sistem dengan hasil hitung fisik. Wajib alasan untuk setiap
      selisih.
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronRight, Plus } from 'lucide-vue-next'
import { tanggalPendek } from '../lib/format'
import { useOpname } from '../stores/opname'
import { useUi } from '../stores/ui'

const router = useRouter()
const store = useOpname()
const ui = useUi()

const daftar = computed(() => store.sesi)
const berjalan = computed(() => store.berjalan)
const totalProduk = computed(() => store.sesi[0]?.total_item || 0)

function buka(s) {
  router.push(`/opname/${s.id}`)
}

function mulaiBaru() {
  const s = store.baru('Siti')
  ui.kabari(`${s.nomor} dibuat. Mulai hitung fisik.`, 'ok')
  router.push(`/opname/${s.id}`)
}
</script>
