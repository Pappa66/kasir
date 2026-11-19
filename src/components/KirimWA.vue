<template>
  <Modal :open="open" title="Kirim via WhatsApp" :subtitle="subjudul" lebar="max-w-lg" @close="$emit('close')">
    <div class="space-y-3 px-4 py-4">
      <div class="flex flex-wrap items-center gap-2">
        <AddonTag />
        <span class="text-2xs text-ink-soft">
          Membuka WhatsApp dengan pesan yang sudah terisi. Pesan tidak terkirim otomatis.
        </span>
      </div>

      <div class="rounded border border-line bg-surface px-3 py-2 text-2xs leading-relaxed text-ink-soft">
        Di desktop, tautan biasanya membuka WhatsApp Web. Di HP, membuka aplikasi WhatsApp.
        Pastikan nomor sudah benar sebelum menekan Kirim di WhatsApp.
      </div>

      <div>
        <label class="label" for="wa-hp">Nomor WhatsApp</label>
        <input
          id="wa-hp"
          v-model="hp"
          type="tel"
          inputmode="tel"
          class="input tnum"
          placeholder="08xx-xxxx-xxxx"
        />
        <p class="mt-1 text-2xs text-ink-soft">
          Nomor 08… otomatis diubah ke format 62… saat membuka WhatsApp.
        </p>
      </div>

      <div>
        <label class="label" for="wa-pesan">Isi pesan</label>
        <textarea
          id="wa-pesan"
          :value="pesan"
          rows="9"
          readonly
          class="input h-auto resize-none py-2 font-mono text-[11px] leading-relaxed"
        />
      </div>
    </div>

    <template #footer>
      <span class="text-2xs text-ink-soft">Demo — tidak ada API WhatsApp.</span>
      <div class="flex flex-wrap gap-2">
        <button type="button" class="btn" @click="salin">Salin pesan</button>
        <a
          :href="tautanSiap"
          target="_blank"
          rel="noopener"
          class="btn btn-primary"
          @click="cekBuka"
        >
          <MessageCircle :size="15" :stroke-width="1.6" />
          Buka WhatsApp
        </a>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { MessageCircle } from 'lucide-vue-next'
import Modal from './Modal.vue'
import AddonTag from './AddonTag.vue'
import { nomorWA, tautanWA } from '../lib/ekspor'
import { useUi } from '../stores/ui'

const props = defineProps({
  open: { type: Boolean, default: false },
  subjudul: { type: String, default: 'Bagikan rincian invoice' },
  nomor: { type: String, default: '' },
  pesan: { type: String, default: '' },
})

defineEmits(['close'])

const ui = useUi()
const hp = ref(props.nomor || '')
const tautanSiap = computed(() =>
  nomorWA(hp.value) ? tautanWA(hp.value, props.pesan) : '',
)

watch(
  () => [props.open, props.nomor],
  () => {
    if (props.open) hp.value = props.nomor || ''
  },
  { immediate: true },
)

async function salin() {
  try {
    await navigator.clipboard.writeText(props.pesan)
    ui.kabari('Pesan disalin. Tempel di WhatsApp.', 'ok')
  } catch {
    ui.kabari('Browser menolak akses clipboard. Salin manual dari kotak pesan.', 'warn')
  }
}

function cekBuka(e) {
  if (!nomorWA(hp.value)) {
    e.preventDefault()
    ui.kabari('Nomor WhatsApp belum diisi.', 'warn')
    return
  }
  ui.kabari('WhatsApp dibuka di tab baru. Periksa pesan sebelum mengirim.', 'info')
}
</script>
